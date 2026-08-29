"use client";

import { useState } from "react";

type Zustand = "ruht" | "sendet" | "gut" | "schlecht";

export default function Anmeldung({ quelle }: { quelle: string }) {
  const [email, setEmail] = useState("");
  const [zustand, setZustand] = useState<Zustand>("ruht");
  const [meldung, setMeldung] = useState("");

  async function absenden(e: React.FormEvent) {
    e.preventDefault();
    setZustand("sendet");

    try {
      const antwort = await fetch("/api/anmeldung", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, quelle }),
      });
      const daten = (await antwort.json()) as { meldung?: string };

      if (antwort.ok) {
        setZustand("gut");
        setMeldung(daten.meldung ?? "Eingetragen. Die ersten drei Tage kommen per Mail.");
        setEmail("");
      } else {
        setZustand("schlecht");
        setMeldung(daten.meldung ?? "Das hat nicht geklappt.");
      }
    } catch {
      setZustand("schlecht");
      setMeldung("Keine Verbindung. Bitte später noch einmal versuchen.");
    }
  }

  if (zustand === "gut") {
    return (
      <p className="meldung gut" role="status">
        {meldung}
      </p>
    );
  }

  return (
    <>
      <form className="formular" onSubmit={absenden}>
        <label htmlFor={`email-${quelle}`} className="marke-klein" style={{ flexBasis: "100%" }}>
          E-Mail-Adresse
        </label>
        <input
          id={`email-${quelle}`}
          type="email"
          required
          autoComplete="email"
          placeholder="du@beispiel.at"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="knopf" type="submit" disabled={zustand === "sendet"}>
          {zustand === "sendet" ? "Einen Moment …" : "Kostenlos starten"}
        </button>
      </form>

      {zustand === "schlecht" && (
        <p className="meldung schlecht" role="alert">
          {meldung}
        </p>
      )}
    </>
  );
}
