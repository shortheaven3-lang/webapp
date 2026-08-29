import Link from "next/link";
import Anmeldung from "@/components/Anmeldung";
import KaufKnopf from "@/components/KaufKnopf";
import { alleLektionen, programmLaenge } from "@/lib/lektionen";
import { PRODUKT, preisFormatiert } from "@/lib/preis";
import { verkaufIstScharf } from "@/lib/stripe";

const WOCHEN = [
  { titel: "Sehen", tage: "Tag 1–7", text: "Wo du dich verlassen hast, und wovor dich das geschützt hat." },
  { titel: "Grenzen", tage: "Tag 8–14", text: "Nein sagen, ohne dich zu erklären. Und aushalten, was danach kommt." },
  { titel: "Handeln", tage: "Tag 15–21", text: "Anfangen ohne Motivation. Zurückkommen nach dem Aussetzer." },
  { titel: "Loslassen", tage: "Tag 22–30", text: "Vergeben als Aufhören zu warten. Stille, die nicht Erschöpfung ist." },
];

export default function Startseite() {
  const lektionen = alleLektionen();
  const frei = lektionen.filter((l) => l.kostenlos);
  const scharf = verkaufIstScharf();

  return (
    <div className="huelle">
      <span className="marke-klein">Ein Programm in {programmLaenge()} Tagen</span>
      <h1>Du musst dein Leben nicht umstürzen. Du musst anfangen zu bemerken.</h1>

      <p className="vorspann">
        Selbstverlassen passiert nicht an einem Tag — es passiert in tausend kleinen Momenten,
        in denen du dich für jemand anderen entscheidest. Dieses Programm dreht die Bewegung um.
        Eine Lektion pro Tag, ein Gedanke, eine Übung, eine Frage. Sieben Minuten, nicht siebzig.
      </p>

      <h2 id="frei">Die ersten {PRODUKT.kostenloseTage} Tage sind frei</h2>
      <p>
        Kein Konto, keine Zahlung. Lies sie, mach die Übungen, und entscheide danach — genau so,
        wie es Tag 3 dir beibringt.
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
        Trag dich ein, wenn dich täglich eine Erinnerung erreichen soll:
      </p>
      <Anmeldung quelle="startseite" />

      <h2>Der Bogen</h2>
      <p>
        Vier Wochen, die aufeinander aufbauen. Wer bei Woche drei anfängt, scheitert an Woche
        drei — Handeln ohne Grenzen führt zurück in dieselbe Erschöpfung.
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
        Einmalig <strong>{preisFormatiert()}</strong> für alle {programmLaenge()} Tage. Kein Abo,
        keine Verlängerung, dauerhafter Zugang.
      </p>
      <KaufKnopf scharf={scharf} beschriftung={`Programm kaufen — ${preisFormatiert()}`} />

      <h2>Was es nicht ist</h2>
      <p className="hinweis">
        Keine Therapie und kein Ersatz dafür. Wenn dich etwas trägt, das schwerer ist als ein
        unruhiger Kopf — anhaltende Niedergeschlagenheit, Angst, die den Alltag bestimmt —,
        dann gehört das in fachliche Hände, nicht in ein Programm zum Selbstlesen.
      </p>
    </div>
  );
}
