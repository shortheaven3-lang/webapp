import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "zugang";
const GUELTIG_TAGE = 365;

/**
 * Der Zugang steckt in einem signierten Cookie statt in einer Datenbank.
 * Das reicht für ein Einmalprodukt ohne Nutzerkonten und spart den gesamten
 * Betrieb einer Datenhaltung. Grenze: wer den Browser wechselt, verliert den
 * Zugang und muss den Link aus der Bestätigungsmail erneut öffnen.
 */
function geheimnis(): string | undefined {
  const s = process.env.ZUGANG_GEHEIMNIS;
  return s && s.length >= 32 ? s : undefined;
}

function signiere(nutzlast: string, s: string): string {
  return crypto.createHmac("sha256", s).update(nutzlast).digest("base64url");
}

function gleich(a: string, b: string): boolean {
  const pa = Buffer.from(a);
  const pb = Buffer.from(b);
  if (pa.length !== pb.length) return false;
  return crypto.timingSafeEqual(pa, pb);
}

export function baueZugangsWert(kaufId: string): string {
  const s = geheimnis();
  if (!s) throw new Error("ZUGANG_GEHEIMNIS fehlt oder ist kürzer als 32 Zeichen.");

  const bis = Date.now() + GUELTIG_TAGE * 24 * 60 * 60 * 1000;
  const nutzlast = `${kaufId}.${bis}`;
  return `${nutzlast}.${signiere(nutzlast, s)}`;
}

function pruefeWert(wert: string): boolean {
  const s = geheimnis();
  if (!s) return false;

  const teile = wert.split(".");
  if (teile.length !== 3) return false;

  const [kaufId, bisRoh, unterschrift] = teile;
  if (!gleich(unterschrift, signiere(`${kaufId}.${bisRoh}`, s))) return false;

  const bis = Number(bisRoh);
  return Number.isFinite(bis) && bis > Date.now();
}

/** Hat die aufrufende Person das Programm gekauft? */
export async function hatZugang(): Promise<boolean> {
  const wert = (await cookies()).get(COOKIE)?.value;
  return wert ? pruefeWert(wert) : false;
}

export const ZUGANG_COOKIE = COOKIE;
export const ZUGANG_MAX_ALTER = GUELTIG_TAGE * 24 * 60 * 60;
