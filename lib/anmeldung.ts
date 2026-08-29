import "server-only";
import fs from "node:fs";
import path from "node:path";

const DATEI = path.join(process.cwd(), ".daten", "anmeldungen.jsonl");

export type AnmeldeErgebnis =
  | { ok: true }
  | { ok: false; grund: "ungueltig" | "kein_ziel" | "fehler" };

/** Grobe Prüfung: genau ein @, links und rechts etwas, rechts ein Punkt. */
export function istEmail(wert: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(wert.trim());
}

/**
 * Speichert eine Anmeldung.
 *
 * Reihenfolge:
 * 1. ANMELDUNG_WEBHOOK gesetzt — die Adresse bekommt die Anmeldung als JSON.
 *    So hängt man MailerLite, Buttondown, Brevo oder einen eigenen Dienst an.
 * 2. Sonst im lokalen Betrieb: Zeile an .daten/anmeldungen.jsonl anhängen.
 * 3. Sonst: Fehler. Auf Vercel ist das Dateisystem flüchtig — eine dort
 *    geschriebene Datei wäre beim nächsten Aufruf verschwunden. Lieber ein
 *    ehrlicher Fehler als eine Adresse, die niemand je wiedersieht.
 */
export async function speichereAnmeldung(
  email: string,
  quelle: string,
): Promise<AnmeldeErgebnis> {
  const sauber = email.trim().toLowerCase();
  if (!istEmail(sauber)) return { ok: false, grund: "ungueltig" };

  const eintrag = { email: sauber, quelle, zeitpunkt: new Date().toISOString() };
  const ziel = process.env.ANMELDUNG_WEBHOOK;

  if (ziel) {
    try {
      const antwort = await fetch(ziel, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(eintrag),
      });
      return antwort.ok ? { ok: true } : { ok: false, grund: "fehler" };
    } catch {
      return { ok: false, grund: "fehler" };
    }
  }

  if (process.env.NODE_ENV !== "production") {
    try {
      fs.mkdirSync(path.dirname(DATEI), { recursive: true });
      fs.appendFileSync(DATEI, `${JSON.stringify(eintrag)}\n`, "utf8");
      return { ok: true };
    } catch {
      return { ok: false, grund: "fehler" };
    }
  }

  return { ok: false, grund: "kein_ziel" };
}
