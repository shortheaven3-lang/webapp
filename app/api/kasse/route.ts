import { NextResponse } from "next/server";
import { PRODUKT } from "@/lib/preis";
import { basisAdresse, stripe } from "@/lib/stripe";

export async function POST() {
  const s = stripe();
  if (!s || !process.env.ZUGANG_GEHEIMNIS) {
    return NextResponse.json(
      { meldung: "Der Verkauf ist noch nicht scharf geschaltet." },
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
