import { NextResponse } from "next/server";
import { baueZugangsWert, ZUGANG_COOKIE, ZUGANG_MAX_ALTER } from "@/lib/zugang";
import { basisAdresse } from "@/lib/adresse";
import { stripe } from "@/lib/stripe";

/**
 * Rücksprung aus Stripe. Die Sitzung wird serverseitig bei Stripe nachgefragt —
 * eine mitgeschickte Kennung allein beweist nichts. Erst wenn Stripe die Zahlung
 * bestätigt, wird der Zugangs-Cookie gesetzt.
 */
export async function GET(anfrage: Request) {
  const basis = basisAdresse();
  const kennung = new URL(anfrage.url).searchParams.get("sitzung");
  const s = stripe();

  if (!s || !kennung) {
    return NextResponse.redirect(`${basis}/danke?stand=unklar`);
  }

  try {
    const sitzung = await s.checkout.sessions.retrieve(kennung);

    if (sitzung.payment_status !== "paid") {
      return NextResponse.redirect(`${basis}/danke?stand=offen`);
    }

    const antwort = NextResponse.redirect(`${basis}/danke?stand=bezahlt`);
    antwort.cookies.set(ZUGANG_COOKIE, baueZugangsWert(sitzung.id), {
      httpOnly: true,
      sameSite: "lax",
      secure: basis.startsWith("https://"),
      path: "/",
      maxAge: ZUGANG_MAX_ALTER,
    });
    return antwort;
  } catch (fehler) {
    console.error("Sitzung konnte nicht geprüft werden:", fehler);
    return NextResponse.redirect(`${basis}/danke?stand=unklar`);
  }
}
