import crypto from "node:crypto";

/**
 * Signieren und Prüfen des Zugangs — bewusst ohne Next-Bindung, damit es
 * ausserhalb einer Anfrage getestet werden kann. Die Cookie-Anbindung liegt
 * in zugang.ts.
 */

export const GUELTIG_TAGE = 365;
const MINDESTLAENGE = 32;

export function geheimnisIstBrauchbar(s: string | undefined): s is string {
  return typeof s === "string" && s.length >= MINDESTLAENGE;
}

function signiere(nutzlast: string, geheimnis: string): string {
  return crypto.createHmac("sha256", geheimnis).update(nutzlast).digest("base64url");
}

function gleich(a: string, b: string): boolean {
  const pa = Buffer.from(a);
  const pb = Buffer.from(b);
  if (pa.length !== pb.length) return false;
  return crypto.timingSafeEqual(pa, pb);
}

export function baueZugangsWert(
  kaufId: string,
  geheimnis: string,
  jetzt: number = Date.now(),
): string {
  if (!geheimnisIstBrauchbar(geheimnis)) {
    throw new Error(`Geheimnis fehlt oder ist kürzer als ${MINDESTLAENGE} Zeichen.`);
  }
  if (kaufId.includes(".")) {
    // Der Punkt trennt die drei Teile. Eine Kennung mit Punkt wuerde die
    // Zerlegung verschieben und die Pruefung unbrauchbar machen.
    throw new Error("Die Kaufkennung darf keinen Punkt enthalten.");
  }

  const bis = jetzt + GUELTIG_TAGE * 24 * 60 * 60 * 1000;
  const nutzlast = `${kaufId}.${bis}`;
  return `${nutzlast}.${signiere(nutzlast, geheimnis)}`;
}

export function pruefeZugangsWert(
  wert: string | undefined,
  geheimnis: string | undefined,
  jetzt: number = Date.now(),
): boolean {
  if (!wert || !geheimnisIstBrauchbar(geheimnis)) return false;

  const teile = wert.split(".");
  if (teile.length !== 3) return false;

  const [kaufId, bisRoh, unterschrift] = teile;
  if (!gleich(unterschrift, signiere(`${kaufId}.${bisRoh}`, geheimnis))) return false;

  const bis = Number(bisRoh);
  return Number.isFinite(bis) && bis > jetzt;
}
