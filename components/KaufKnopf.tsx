"use client";

import Link from "next/link";
import { useState } from "react";
import { WIDERRUF } from "@/lib/widerruf";

export default function KaufKnopf({ beschriftung }: { beschriftung: string }) {
  const [zugestimmt, setZugestimmt] = useState(false);
  const [laeuft, setLaeuft] = useState(false);
  const [fehler, setFehler] = useState("");

  async function zurKasse(e: React.FormEvent) {
    e.preventDefault();
    if (!zugestimmt) return;

    setLaeuft(true);
    setFehler("");

    try {
      const antwort = await fetch("/api/kasse", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ zustimmung: true, version: WIDERRUF.version }),
      });
      const daten = (await antwort.json()) as { url?: string; meldung?: string };

      if (antwort.ok && daten.url) {
        window.location.href = daten.url;
        return;
      }
      setFehler(daten.meldung ?? "Die Kasse antwortet gerade nicht.");
    } catch {
      setFehler("Keine Verbindung zur Kasse. Probier es gleich noch einmal.");
    }
    setLaeuft(false);
  }

  return (
    <form onSubmit={zurKasse}>
      <label className="zustimmung">
        <input
          type="checkbox"
          checked={zugestimmt}
          onChange={(e) => setZugestimmt(e.target.checked)}
        />
        <span>
          {WIDERRUF.text} Die <Link href="/agb">AGB und die Widerrufsbelehrung</Link> habe ich
          gelesen.
        </span>
      </label>

      <button className="knopf" type="submit" disabled={!zugestimmt || laeuft}>
        {laeuft ? "Weiter zur Kasse …" : beschriftung}
      </button>

      {!zugestimmt && (
        <p className="meldung leise">Das Häkchen brauche ich, sonst geht es nicht weiter.</p>
      )}

      {fehler && (
        <p className="meldung schlecht" role="alert">
          {fehler}
        </p>
      )}
    </form>
  );
}
