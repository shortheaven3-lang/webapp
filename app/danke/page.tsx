import type { Metadata } from "next";
import Link from "next/link";
import { hatZugang } from "@/lib/zugang";

export const metadata: Metadata = { title: "Danke" };

export default async function Danke({
  searchParams,
}: {
  searchParams: Promise<{ stand?: string }>;
}) {
  const { stand } = await searchParams;
  const zugang = await hatZugang();

  if (zugang) {
    return (
      <div className="huelle">
        <h1>Alles offen.</h1>
        <p className="vorspann">
          Danke, dass du dabei bist. Eine Bitte: fang morgen früh mit Tag 1 an und lies nicht
          heute Abend gleich sechs Tage durch. Es passiert nicht beim Lesen, sondern zwischen
          den Tagen.
        </p>
        <p>
          <Link className="knopf" href="/programm/1">
            Zu Tag 1
          </Link>
        </p>
        <p className="hinweis">
          Der Zugang hängt an diesem Browser. Wenn du später am Handy weiterliest, öffne dort
          einmal den Link aus deiner Bestätigungsmail von Stripe, dann bist du auch da drin.
        </p>
      </div>
    );
  }

  return (
    <div className="huelle">
      <h1>{stand === "offen" ? "Die Zahlung läuft noch" : "Da ist etwas hängen geblieben"}</h1>
      <p className="vorspann">
        {stand === "offen"
          ? "Stripe hat die Zahlung noch nicht durchgewinkt. Bei manchen Zahlungsarten dauert das ein paar Minuten. Lad die Seite gleich noch einmal."
          : "Ich konnte den Kauf nicht bestätigen. Falls bei dir trotzdem Geld abgebucht wurde, schreib mir mit der Bestätigungsmail von Stripe — dann schalte ich dich von Hand frei."}
      </p>
      <p>
        <Link href="/programm">Zurück zur Übersicht</Link>
      </p>
    </div>
  );
}
