import { NextResponse } from "next/server";
import { istEmail, speichereAnmeldung } from "@/lib/anmeldung";

export async function POST(anfrage: Request) {
  let koerper: unknown;
  try {
    koerper = await anfrage.json();
  } catch {
    return NextResponse.json({ meldung: "Ungültige Anfrage." }, { status: 400 });
  }

  const { email, quelle } = (koerper ?? {}) as { email?: unknown; quelle?: unknown };

  if (typeof email !== "string" || !istEmail(email)) {
    return NextResponse.json(
      { meldung: "Diese Adresse sieht nicht vollständig aus." },
      { status: 400 },
    );
  }

  const ergebnis = await speichereAnmeldung(
    email,
    typeof quelle === "string" ? quelle : "unbekannt",
  );

  if (ergebnis.ok) {
    return NextResponse.json({
      meldung: "Eingetragen. Die ersten drei Tage sind ab sofort frei.",
    });
  }

  if (ergebnis.grund === "kein_ziel") {
    // Bewusst ehrlich: lieber ein sichtbarer Fehler als eine verlorene Adresse.
    console.error("ANMELDUNG_WEBHOOK ist nicht gesetzt — Anmeldung verworfen.");
    return NextResponse.json(
      { meldung: "Die Anmeldung ist gerade nicht möglich. Bitte später erneut." },
      { status: 503 },
    );
  }

  return NextResponse.json({ meldung: "Das hat nicht geklappt." }, { status: 500 });
}
