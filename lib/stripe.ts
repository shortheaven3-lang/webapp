import "server-only";
import Stripe from "stripe";

let zwischenspeicher: Stripe | null = null;

/**
 * Stripe wird erst beim ersten Zugriff erzeugt, damit die App auch ohne
 * Schlüssel startet und baut. Ohne Schlüssel liefert die Funktion null; die
 * Kasse antwortet dann mit 503 und der Kaufknopf zeigt den Grund an.
 *
 * Bewusst nicht beim Rendern der Seiten geprüft: die Verkaufsseite wird beim
 * Bau vorgerendert, ein dort eingefrorener Zustand wäre nach dem Nachtragen
 * der Schlüssel falsch.
 */
export function stripe(): Stripe | null {
  if (zwischenspeicher) return zwischenspeicher;

  const schluessel = process.env.STRIPE_SECRET_KEY;
  if (!schluessel) return null;

  zwischenspeicher = new Stripe(schluessel);
  return zwischenspeicher;
}

export function verkaufIstScharf(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.ZUGANG_GEHEIMNIS);
}

/** Basisadresse für Rücksprünge aus Stripe. */
export function basisAdresse(): string {
  const gesetzt = process.env.APP_URL;
  if (gesetzt) return gesetzt.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}
