"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AUSSAGEN, STUFEN } from "@/content/selbsttest";
import { auswerten } from "@/lib/selbsttest";

/**
 * Eine Aussage pro Bildschirm. Zwölf Klicks, kein Absenden, kein Konto.
 * Am Ende wird auf die Ergebnisseite gewechselt — die hat eine eigene
 * Adresse und lässt sich teilen.
 */
export default function Selbsttest() {
  const router = useRouter();
  const [gestartet, setGestartet] = useState(false);
  const [stelle, setStelle] = useState(0);
  const [antworten, setAntworten] = useState<Record<string, number>>({});
  const frageRef = useRef<HTMLParagraphElement>(null);

  const aussage = AUSSAGEN[stelle];
  const letzte = stelle === AUSSAGEN.length - 1;

  const antworte = useCallback(
    (wert: number) => {
      const naechste = { ...antworten, [aussage.id]: wert };
      setAntworten(naechste);

      if (letzte) {
        const { bereich, niveau } = auswerten(naechste);
        router.push(`/test/${bereich}?niveau=${niveau}`);
        return;
      }
      setStelle((s) => s + 1);
    },
    [antworten, aussage, letzte, router],
  );

  // Ziffern 1 bis 3 als Abkürzung. Wer zwölf Fragen beantwortet, ist für
  // jede eingesparte Handbewegung dankbar.
  useEffect(() => {
    if (!gestartet) return;
    const beiTaste = (e: KeyboardEvent) => {
      const nummer = Number(e.key);
      if (nummer >= 1 && nummer <= STUFEN.length) antworte(STUFEN[nummer - 1].wert);
    };
    window.addEventListener("keydown", beiTaste);
    return () => window.removeEventListener("keydown", beiTaste);
  }, [gestartet, antworte]);

  // Nach dem Wechsel den neuen Satz ansagen, damit Screenreader mitkommen.
  useEffect(() => {
    if (gestartet) frageRef.current?.focus();
  }, [stelle, gestartet]);

  if (!gestartet) {
    return (
      <>
        <p>
          Zwölf Sätze. Du liest jeden und sagst, wie oft er auf dich zutrifft. Am Ende steht kein
          Punktestand und kein Typ, der du dann bist, sondern der Bereich, in dem es bei dir
          gerade am lautesten ist.
        </p>
        <p>
          Kein Konto, keine E-Mail-Adresse. Die Antworten bleiben in deinem Browser.
        </p>
        <button className="knopf" onClick={() => setGestartet(true)}>
          Test starten
        </button>
      </>
    );
  }

  return (
    <div className="test">
      <p className="marke-klein" aria-hidden="true">
        {stelle + 1} von {AUSSAGEN.length}
      </p>
      <div
        className="fortschritt"
        role="progressbar"
        aria-valuenow={stelle + 1}
        aria-valuemin={1}
        aria-valuemax={AUSSAGEN.length}
        aria-label={`Aussage ${stelle + 1} von ${AUSSAGEN.length}`}
      >
        <span style={{ width: `${((stelle + 1) / AUSSAGEN.length) * 100}%` }} />
      </div>

      <p className="test-aussage" tabIndex={-1} ref={frageRef}>
        {aussage.text}
      </p>

      <div className="test-stufen">
        {STUFEN.map((stufe, i) => (
          <button key={stufe.wert} className="knopf leise" onClick={() => antworte(stufe.wert)}>
            {stufe.text}
            <span className="taste" aria-hidden="true">
              {i + 1}
            </span>
          </button>
        ))}
      </div>

      {stelle > 0 && (
        <button className="zurueck" onClick={() => setStelle((s) => s - 1)}>
          ← eine zurück
        </button>
      )}
    </div>
  );
}
