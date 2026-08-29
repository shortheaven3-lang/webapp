import "server-only";
import fs from "node:fs";
import path from "node:path";

/**
 * Anbindung an den Versanddienst.
 *
 * Warum der Takt nicht hier liegt: Eine eigene Strecke muesste festhalten, wer
 * wann welche Mail bekommen hat. Ohne Datenhaltung waere das eine
 * Zustandsmaschine ohne Zustand — sie verschickt frueher oder spaeter doppelt.
 * Der Versanddienst kann das, inklusive Abmeldeverwaltung, die rechtlich
 * ohnehin dorthin gehoert. Hier wird deshalb nur eingetragen.
 *
 * Welcher Weg genommen wird, entscheidet ANMELDUNG_ZIEL:
 *   mailerlite  — API von MailerLite (kostenlos bis 1.000 Adressen)
 *   webhook     — beliebige Adresse bekommt die Anmeldung als JSON
 *   datei       — nur lokal: Zeile in .daten/anmeldungen.jsonl
 * Ohne Angabe wird im Entwicklungsbetrieb "datei" genommen und im
 * Produktivbetrieb abgelehnt — eine Adresse still zu verlieren ist schlimmer
 * als ein sichtbarer Fehler.
 */

export type Anmeldung = {
  email: string;
  quelle: string;
  zeitpunkt: string;
};

export type VersandErgebnis =
  | { ok: true }
  | { ok: false; grund: "kein_ziel" | "abgelehnt" | "fehler"; hinweis?: string };

const DATEI = path.join(process.cwd(), ".daten", "anmeldungen.jsonl");

function gewaehltesZiel(): string {
  const gesetzt = process.env.ANMELDUNG_ZIEL?.trim().toLowerCase();
  if (gesetzt) return gesetzt;
  if (process.env.MAILERLITE_TOKEN) return "mailerlite";
  if (process.env.ANMELDUNG_WEBHOOK) return "webhook";
  return process.env.NODE_ENV === "production" ? "keins" : "datei";
}

async function anMailerlite(anmeldung: Anmeldung): Promise<VersandErgebnis> {
  const token = process.env.MAILERLITE_TOKEN;
  const gruppe = process.env.MAILERLITE_GRUPPE;
  if (!token) return { ok: false, grund: "kein_ziel", hinweis: "MAILERLITE_TOKEN fehlt." };

  const basis = process.env.MAILERLITE_BASIS ?? "https://connect.mailerlite.com";

  try {
    const antwort = await fetch(`${basis}/api/subscribers`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: anmeldung.email,
        ...(gruppe ? { groups: [gruppe] } : {}),
        fields: { quelle: anmeldung.quelle },
      }),
    });

    // 200 und 201 sind beide gut: MailerLite antwortet mit 200, wenn die
    // Adresse schon eingetragen war. Doppelt anmelden ist kein Fehler.
    if (antwort.ok) return { ok: true };

    if (antwort.status === 422) {
      return { ok: false, grund: "abgelehnt", hinweis: "Adresse wurde abgelehnt." };
    }

    const text = await antwort.text();
    console.error("MailerLite antwortete", antwort.status, text.slice(0, 300));
    return { ok: false, grund: "fehler" };
  } catch (fehler) {
    console.error("MailerLite nicht erreichbar:", fehler);
    return { ok: false, grund: "fehler" };
  }
}

async function anWebhook(anmeldung: Anmeldung): Promise<VersandErgebnis> {
  const ziel = process.env.ANMELDUNG_WEBHOOK;
  if (!ziel) return { ok: false, grund: "kein_ziel", hinweis: "ANMELDUNG_WEBHOOK fehlt." };

  try {
    const antwort = await fetch(ziel, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(anmeldung),
    });
    return antwort.ok ? { ok: true } : { ok: false, grund: "fehler" };
  } catch {
    return { ok: false, grund: "fehler" };
  }
}

function inDatei(anmeldung: Anmeldung): VersandErgebnis {
  if (process.env.NODE_ENV === "production") {
    // Auf Vercel ist das Dateisystem fluechtig. Eine hier geschriebene Zeile
    // waere beim naechsten Aufruf verschwunden.
    return { ok: false, grund: "kein_ziel", hinweis: "Dateiziel ist im Produktivbetrieb aus." };
  }
  try {
    fs.mkdirSync(path.dirname(DATEI), { recursive: true });
    fs.appendFileSync(DATEI, `${JSON.stringify(anmeldung)}\n`, "utf8");
    return { ok: true };
  } catch {
    return { ok: false, grund: "fehler" };
  }
}

export async function trageEin(anmeldung: Anmeldung): Promise<VersandErgebnis> {
  switch (gewaehltesZiel()) {
    case "mailerlite":
      return anMailerlite(anmeldung);
    case "webhook":
      return anWebhook(anmeldung);
    case "datei":
      return inDatei(anmeldung);
    default:
      return {
        ok: false,
        grund: "kein_ziel",
        hinweis: "Kein Versandziel eingerichtet (ANMELDUNG_ZIEL).",
      };
  }
}

/** Für die Anzeige im Betrieb: welches Ziel greift gerade? */
export function aktuellesZiel(): string {
  return gewaehltesZiel();
}
