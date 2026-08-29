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
        <h1>Freigeschaltet</h1>
        <p className="vorspann">
          Alle Tage stehen dir offen. Fang morgen früh mit Tag 1 an, nicht heute Abend mit
          Tag 1 bis 6 — das Programm wirkt über die Wiederholung.
        </p>
        <p>
          <Link className="knopf" href="/programm/1">
            Zu Tag 1
          </Link>
        </p>
        <p className="hinweis">
          Der Zugang hängt an diesem Browser. Wenn du das Gerät wechselst, öffne den Link aus
          deiner Bestätigungsmail von Stripe erneut.
        </p>
      </div>
    );
  }

  return (
    <div className="huelle">
      <h1>{stand === "offen" ? "Die Zahlung steht noch aus" : "Da ist etwas offen geblieben"}</h1>
      <p className="vorspann">
        {stand === "offen"
          ? "Stripe hat die Zahlung noch nicht bestätigt. Bei manchen Zahlungsarten dauert das ein paar Minuten — lade diese Seite gleich noch einmal."
          : "Der Zugang konnte nicht bestätigt werden. Falls Geld abgebucht wurde, schreib mir mit der Bestätigungsmail von Stripe, dann schalte ich von Hand frei."}
      </p>
      <p>
        <Link href="/programm">Zur Übersicht</Link>
      </p>
    </div>
  );
}
