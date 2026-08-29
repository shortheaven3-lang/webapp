"use client";

import { useState } from "react";

export default function KaufKnopf({
  scharf,
  beschriftung,
}: {
  scharf: boolean;
  beschriftung: string;
}) {
  const [laeuft, setLaeuft] = useState(false);
  const [fehler, setFehler] = useState("");

  async function zurKasse() {
    setLaeuft(true);
    setFehler("");

    try {
      const antwort = await fetch("/api/kasse", { method: "POST" });
      const daten = (await antwort.json()) as { url?: string; meldung?: string };

      if (antwort.ok && daten.url) {
        window.location.href = daten.url;
        return;
      }
      setFehler(daten.meldung ?? "Die Kasse ist gerade nicht erreichbar.");
    } catch {
      setFehler("Keine Verbindung zur Kasse.");
    }
    setLaeuft(false);
  }

  if (!scharf) {
    return (
      <p className="hinweis">
        Der Verkauf ist noch nicht scharf geschaltet. Sobald <code>STRIPE_SECRET_KEY</code> und{" "}
        <code>ZUGANG_GEHEIMNIS</code> gesetzt sind, steht hier der Kaufknopf.
      </p>
    );
  }

  return (
    <>
      <button className="knopf" onClick={zurKasse} disabled={laeuft}>
        {laeuft ? "Weiter zur Kasse …" : beschriftung}
      </button>
      {fehler && (
        <p className="meldung schlecht" role="alert">
          {fehler}
        </p>
      )}
    </>
  );
}
