import Link from "next/link";
import Anmeldung from "@/components/Anmeldung";
import KaufKnopf from "@/components/KaufKnopf";
import { alleLektionen, programmLaenge } from "@/lib/lektionen";
import { PRODUKT, preisFormatiert } from "@/lib/preis";

const WOCHEN = [
  {
    titel: "Sehen",
    tage: "Tag 1–7",
    text: "Wo du dich verlässt, und wovor dich das eigentlich schützt.",
  },
  {
    titel: "Grenzen",
    tage: "Tag 8–14",
    text: "Absagen, ohne dich zu rechtfertigen. Und die Stille danach aushalten.",
  },
  {
    titel: "Handeln",
    tage: "Tag 15–21",
    text: "Anfangen, wenn keine Lust da ist. Und weitermachen, nachdem du ausgesetzt hast.",
  },
  {
    titel: "Loslassen",
    tage: "Tag 22–30",
    text: "Vergeben, ohne dass es damit in Ordnung war. Und Ruhe, die keine Erschöpfung ist.",
  },
];

export default function Startseite() {
  const lektionen = alleLektionen();
  const frei = lektionen.filter((l) => l.kostenlos);

  return (
    <div className="huelle">
      <span className="marke-klein">Ein Programm in {programmLaenge()} Tagen</span>
      <h1>Du merkst es meistens erst hinterher.</h1>

      <p className="vorspann">
        Diese halbe Sekunde nach dem Ja, in der es im Bauch kippt. Der Abend, an dem dir auffällt,
        dass der ganze Tag anderen gehört hat. {programmLaenge()} Tage lang schauen wir uns solche
        Stellen an. Eine am Tag, sieben Minuten, mit einer Übung, die du noch am selben Tag machen
        kannst.
      </p>

      <div className="anreisser">
        <h2 style={{ marginTop: 0 }}>Wo verlässt du dich selbst?</h2>
        <p>
          Zwölf Aussagen, zwei Minuten, keine E-Mail-Adresse nötig. Danach weißt du, welcher der
          vier Bereiche bei dir gerade der lauteste ist — und wo du im Programm anfangen solltest.
        </p>
        <Link className="knopf" href="/test">
          Selbsttest machen
        </Link>
      </div>

      <h2 id="frei">Die ersten {PRODUKT.kostenloseTage} Tage kosten nichts</h2>
      <p>
        Kein Konto, keine Kreditkarte. Lies sie, mach die Übungen, und entscheide danach. Ob dir
        das liegt, merkst du in zwanzig Minuten und nicht auf einer Verkaufsseite.
      </p>

      <ul className="tage">
        {frei.map((l) => (
          <li key={l.tag}>
            <Link href={`/programm/${l.tag}`}>
              <span className="nummer">{String(l.tag).padStart(2, "0")}</span>
              <span className="titel">{l.titel}</span>
              <span className="saeule">{l.dauer} Min.</span>
            </Link>
          </li>
        ))}
      </ul>

      <p style={{ marginTop: "1.5rem" }}>
        Wenn dich morgens eine Erinnerung erreichen soll, trag dich hier ein:
      </p>
      <Anmeldung quelle="startseite" />

      <h2>Wie die vier Wochen aufgebaut sind</h2>
      <p>
        Sie bauen aufeinander auf, und das ist keine Deko. Wer bei Woche drei einsteigt, scheitert
        an Woche drei: mehr tun, ohne vorher Grenzen gezogen zu haben, führt genau dorthin zurück,
        wo du schon warst.
      </p>

      {WOCHEN.map((w) => (
        <div key={w.titel} style={{ borderTop: "1px solid var(--linie)", padding: "1rem 0" }}>
          <span className="marke-klein">{w.tage}</span>
          <h3 style={{ margin: "0.15rem 0 0.35rem" }}>{w.titel}</h3>
          <p style={{ margin: 0, color: "var(--tinte-leise)" }}>{w.text}</p>
        </div>
      ))}

      <h2 id="kaufen">Teilnehmen</h2>
      <p>
        Alle {programmLaenge()} Tage kosten einmalig <strong>{preisFormatiert()}</strong>. Kein
        Abo, nichts, was sich verlängert. Du kaufst es einmal und kommst dann wieder rein, so oft
        du willst.
      </p>
      <KaufKnopf beschriftung={`Programm kaufen — ${preisFormatiert()}`} />

      <h2>Wofür das nicht gedacht ist</h2>
      <p className="hinweis">
        Das hier ist keine Therapie und kein Ersatz dafür. Wenn du gerade etwas trägst, das
        schwerer ist als ein unruhiger Kopf — eine Niedergeschlagenheit, die nicht weggeht, Angst,
        die deinen Alltag bestimmt —, dann gehört das zu jemandem, der ausgebildet ist und dir
        zuhören kann. Nicht in ein Programm, das du allein liest.
      </p>
    </div>
  );
}
