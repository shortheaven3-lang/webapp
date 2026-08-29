import type { Metadata } from "next";
import Link from "next/link";
import KaufKnopf from "@/components/KaufKnopf";
import { alleLektionen } from "@/lib/lektionen";
import { preisFormatiert } from "@/lib/preis";
import { verkaufIstScharf } from "@/lib/stripe";
import { hatZugang } from "@/lib/zugang";

export const metadata: Metadata = { title: "Programm" };

export default async function Uebersicht() {
  const lektionen = alleLektionen();
  const zugang = await hatZugang();

  return (
    <div className="huelle">
      <h1>Die {lektionen.length} Tage</h1>
      <p className="vorspann">
        {zugang
          ? "Dein Zugang ist freigeschaltet. Ein Tag nach dem anderen — das Programm wirkt über die Wiederholung, nicht über die Menge."
          : "Die ersten Tage sind frei zugänglich. Der Rest wird mit dem Kauf freigeschaltet."}
      </p>

      <ul className="tage">
        {lektionen.map((l) => {
          const offen = zugang || l.kostenlos;
          const nummer = String(l.tag).padStart(2, "0");

          return (
            <li key={l.tag}>
              {offen ? (
                <Link href={`/programm/${l.tag}`}>
                  <span className="nummer">{nummer}</span>
                  <span className="titel">
                    {l.titel}
                    {l.entwurf && " — Entwurf"}
                  </span>
                  <span className="saeule">{l.saeule}</span>
                </Link>
              ) : (
                <span className="gesperrt">
                  <span className="nummer">{nummer}</span>
                  <span className="titel">{l.titel}</span>
                  <span className="saeule">gesperrt</span>
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {!zugang && (
        <div className="schranke">
          <h2>Weiterlesen</h2>
          <p>
            Alle {lektionen.length} Tage, einmalig {preisFormatiert()}. Kein Abo, dauerhafter
            Zugang.
          </p>
          <KaufKnopf scharf={verkaufIstScharf()} beschriftung={`Freischalten — ${preisFormatiert()}`} />
        </div>
      )}
    </div>
  );
}
