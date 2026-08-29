import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Anmeldung from "@/components/Anmeldung";
import KaufKnopf from "@/components/KaufKnopf";
import { alleLektionen, alsHtml, lektionFuerTag } from "@/lib/lektionen";
import { preisFormatiert } from "@/lib/preis";
import { hatZugang } from "@/lib/zugang";

type Eigenschaften = { params: Promise<{ tag: string }> };

export function generateStaticParams() {
  return alleLektionen().map((l) => ({ tag: String(l.tag) }));
}

export async function generateMetadata({ params }: Eigenschaften): Promise<Metadata> {
  const { tag } = await params;
  const lektion = lektionFuerTag(Number(tag));
  if (!lektion) return { title: "Nicht gefunden" };

  return {
    title: `Tag ${lektion.tag}: ${lektion.titel}`,
    description: lektion.vorschau || undefined,
  };
}

export default async function LektionsSeite({ params }: Eigenschaften) {
  const { tag } = await params;
  const nummer = Number(tag);
  const lektion = lektionFuerTag(nummer);
  if (!lektion) notFound();

  const zugang = await hatZugang();
  const offen = zugang || lektion.kostenlos;

  const alle = alleLektionen();
  const vorher = alle.find((l) => l.tag === nummer - 1);
  const nachher = alle.find((l) => l.tag === nummer + 1);

  return (
    <article className="huelle">
      <span className="marke-klein">
        Tag {lektion.tag} · {lektion.saeule} · {lektion.dauer} Minuten
      </span>
      <h1>{lektion.titel}</h1>

      {offen ? (
        <div className="lektion" dangerouslySetInnerHTML={{ __html: alsHtml(lektion.quelle) }} />
      ) : (
        <>
          {lektion.vorschau && <p className="vorspann">{lektion.vorschau}</p>}

          <div className="schranke">
            <h2>Hier hört das Kostenlose auf</h2>
            <p>
              Alle {alle.length} Tage für einmalig {preisFormatiert()}. Kein Abo — einmal kaufen
              und dauerhaft drin bleiben.
            </p>
            <KaufKnopf beschriftung={`Freischalten — ${preisFormatiert()}`} />

            <p style={{ marginTop: "1.75rem", marginBottom: 0 }}>
              Noch nicht sicher? Die ersten Tage kosten nichts. Trag dich ein, dann schicke ich
              dir eine Erinnerung.
            </p>
            <Anmeldung quelle={`schranke-tag-${lektion.tag}`} />
          </div>
        </>
      )}

      <nav className="blaettern">
        {vorher ? <Link href={`/programm/${vorher.tag}`}>← Tag {vorher.tag}</Link> : <span />}
        <Link href="/programm">Übersicht</Link>
        {nachher ? <Link href={`/programm/${nachher.tag}`}>Tag {nachher.tag} →</Link> : <span />}
      </nav>
    </article>
  );
}
