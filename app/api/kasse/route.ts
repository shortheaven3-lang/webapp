import { NextResponse } from "next/server";
import { anbieterIstVollstaendig, fehlendeAngaben } from "@/lib/anbieter";
import { PRODUKT } from "@/lib/preis";
import { basisAdresse } from "@/lib/adresse";
import { stripe } from "@/lib/stripe";
import { WIDERRUF } from "@/lib/widerruf";

export async function POST(anfrage: Request) {
  const s = stripe();
  if (!s || !process.env.ZUGANG_GEHEIMNIS) {
    return NextResponse.json(
      { meldung: "Der Verkauf ist noch nicht scharf geschaltet." },
      { status: 503 },
    );
  }

  // Ohne Zustimmung keine Kasse. Die Prüfung gehört auf den Server: ein
  // deaktivierter Knopf im Browser ist keine Hürde, sondern eine Bitte.
  let koerper: unknown;
  try {
    koerper = await anfrage.json();
  } catch {
    koerper = null;
  }
  const { zustimmung } = (koerper ?? {}) as { zustimmung?: unknown };

  if (zustimmung !== true) {
    return NextResponse.json(
      { meldung: "Ohne die Zustimmung zur sofortigen Bereitstellung geht es nicht weiter." },
      { status: 400 },
    );
  }

  // Ohne vollständiges Impressum darf nicht verkauft werden. Die Sperre greift
  // nur im Produktivbetrieb und lässt sich für Testkäufe mit
  // VERKAUF_TROTZ_LUECKEN=1 aufheben — bewusst umständlich, damit sie nicht
  // beiläufig verschwindet.
  if (
    !anbieterIstVollstaendig() &&
    process.env.NODE_ENV === "production" &&
    process.env.VERKAUF_TROTZ_LUECKEN !== "1"
  ) {
    console.error(
      "Verkauf gesperrt — in lib/anbieter.ts fehlt noch:",
      fehlendeAngaben().join(", "),
    );
    return NextResponse.json(
      { meldung: "Der Verkauf ist gerade nicht möglich. Bitte melde dich kurz bei mir." },
      { status: 503 },
    );
  }

  const basis = basisAdresse();

  try {
    const sitzung = await s.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: PRODUKT.waehrung,
            unit_amount: PRODUKT.betrag,
            product_data: {
              name: PRODUKT.name,
              description: "Dreißig Tage, eine Lektion pro Tag. Dauerhafter Zugang.",
            },
          },
        },
      ],

      // Die Zustimmung wird bei Stripe hinterlegt. Damit hängt der Nachweis am
      // Zahlungsvorgang selbst und überlebt jeden Umbau dieser App.
      metadata: {
        widerruf_zustimmung: "ja",
        widerruf_version: WIDERRUF.version,
        widerruf_zeitpunkt: new Date().toISOString(),
        widerruf_text: WIDERRUF.text.slice(0, 480),
      },

      // Derselbe Satz noch einmal auf der Kassenseite, damit die Zustimmung
      // nicht nur auf der Seite davor gestanden hat.
      custom_text: {
        submit: { message: WIDERRUF.text },
      },

      // Zusätzliche Zustimmung zu den AGB durch Stripe. Setzt voraus, dass im
      // Stripe-Konto unter Checkout-Einstellungen eine AGB-Adresse hinterlegt
      // ist — sonst weist Stripe die Sitzung ab. Deshalb erst einschalten,
      // wenn das erledigt ist.
      ...(process.env.STRIPE_AGB_ZUSTIMMUNG === "1"
        ? { consent_collection: { terms_of_service: "required" as const } }
        : {}),

      // Für digitale Produkte an Verbraucher in der EU: Stripe Tax berechnet
      // die Umsatzsteuer nach dem Wohnsitzland der Kundin bzw. des Kunden.
      automatic_tax: { enabled: true },
      billing_address_collection: "required",
      success_url: `${basis}/api/kasse/abschluss?sitzung={CHECKOUT_SESSION_ID}`,
      cancel_url: `${basis}/#kaufen`,
    });

    if (!sitzung.url) {
      return NextResponse.json({ meldung: "Stripe lieferte keine Kassenadresse." }, { status: 502 });
    }

    return NextResponse.json({ url: sitzung.url });
  } catch (fehler) {
    console.error("Kasse konnte nicht geöffnet werden:", fehler);
    return NextResponse.json({ meldung: "Die Kasse ist gerade nicht erreichbar." }, { status: 502 });
  }
}
