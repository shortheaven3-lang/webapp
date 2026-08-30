import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Anmeldung from "@/components/Anmeldung";
import { BEREICHE, ERGEBNISSE, istBereich } from "@/content/selbsttest";
import { lektionFuerTag } from "@/lib/lektionen";
import { istNiveau } from "@/lib/selbsttest";

type Eigenschaften = {
  params: Promise<{ bereich: string }>;
  searchParams: Promise<{ niveau?: string }>;
};

export function generateStaticParams() {
  return BEREICHE.map((bereich) => ({ bereich }));
}

export async function generateMetadata({ params }: Eigenschaften): Promise<Metadata> {
  const { bereich } = await params;
  if (!istBereich(bereich)) return { title: "Nicht gefunden" };

  const ergebnis = ERGEBNISSE[bereich];
  return {
    title: ergebnis.titel,
    description: ergebnis.kern,
    openGraph: { title: ergebnis.titel, description: ergebnis.kern },
  };
}

export default async function ErgebnisSeite({ params, searchParams }: Eigenschaften) {
  const { bereich } = await params;
  if (!istBereich(bereich)) notFound();

  const { niveau } = await searchParams;
  const ergebnis = ERGEBNISSE[bereich];
  const tage = ergebnis.tage
    .map((tag) => lektionFuerTag(tag))
    .filter((l) => l !== undefined);

  return (
    <div className="huelle">
      <span className="marke-klein">Dein Ergebnis · {ergebnis.woche}</span>
      <h1>{ergebnis.titel}</h1>

      <p className="ergebnis-kern">{ergebnis.kern}</p>

      {ergebnis.text.map((absatz, i) => (
        <p key={i}>{absatz}</p>
      ))}

      {istNiveau(niveau) && niveau === "niedrig" && (
        <p className="hinweis">
          Fast überall „selten“ — dann ist das oben eine Tendenz und kein Problem. Gut möglich,
          dass du das hier gerade nicht brauchst. Von den beiden Nachrichten ist das die bessere,
          auch wenn sie sich auf einer Verkaufsseite seltsam liest.
        </p>
      )}

      <h2>Da fängst du an</h2>
      <p>
        Diese drei Tage gehen genau darauf ein. Tag 1 bis 3 kosten nichts, für die anderen
        brauchst du das Programm.
      </p>

      <ul className="tage">
        {tage.map((l) => (
          <li key={l.tag}>
            {l.kostenlos ? (
              <Link href={`/programm/${l.tag}`}>
                <span className="nummer">{String(l.tag).padStart(2, "0")}</span>
                <span className="titel">{l.titel}</span>
                <span className="saeule">{l.dauer} Min.</span>
              </Link>
            ) : (
              <span className="gesperrt">
                <span className="nummer">{String(l.tag).padStart(2, "0")}</span>
                <span className="titel">{l.titel}</span>
                <span className="saeule">im Programm</span>
              </span>
            )}
          </li>
        ))}
      </ul>

      <h2>Die ersten drei Tage kostenlos</h2>
      <p>
        Trag dich ein, dann kommen sie der Reihe nach. Angefangen bei Tag 1, auch wenn dein
        Ergebnis woanders liegt — die vier Wochen bauen aufeinander auf.
      </p>
      <Anmeldung quelle={`selbsttest-${bereich}`} />

      <p style={{ marginTop: "2.5rem" }}>
        <Link href="/test">Test noch einmal machen</Link> ·{" "}
        <Link href="/programm">Alle 30 Tage ansehen</Link>
      </p>

      <p className="hinweis">
        Der Test sortiert, er stellt keine Diagnose. Zwölf Sätze können nicht wissen, wie es dir
        geht. Sie können nur zeigen, wo du zuerst hinschauen solltest.
      </p>
    </div>
  );
}
