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
      { meldung: "Da fehlt noch etwas an der Adresse." },
      { status: 400 },
    );
  }

  const ergebnis = await speichereAnmeldung(
    email,
    typeof quelle === "string" ? quelle : "unbekannt",
  );

  if (ergebnis.ok) {
    return NextResponse.json({
      meldung: "Passt, du stehst auf der Liste.",
    });
  }

  if (ergebnis.grund === "kein_ziel") {
    // Bewusst ehrlich: lieber ein sichtbarer Fehler als eine verlorene Adresse.
    console.error("Kein Versandziel eingerichtet — Anmeldung verworfen.");
    return NextResponse.json(
      { meldung: "Das geht gerade nicht. Probier es später noch einmal." },
      { status: 503 },
    );
  }

  if (ergebnis.grund === "abgelehnt") {
    return NextResponse.json(
      { meldung: "Diese Adresse hat der Versanddienst abgelehnt." },
      { status: 400 },
    );
  }

  return NextResponse.json({ meldung: "Hat leider nicht geklappt." }, { status: 500 });
}
