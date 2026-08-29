import "server-only";
import { cookies } from "next/headers";
import {
  baueZugangsWert as baueWert,
  GUELTIG_TAGE,
  pruefeZugangsWert,
} from "@/lib/zugang-kern";

/**
 * Der Zugang steckt in einem signierten Cookie statt in einer Datenbank.
 * Das reicht für ein Einmalprodukt ohne Nutzerkonten und spart den gesamten
 * Betrieb einer Datenhaltung. Grenze: wer den Browser wechselt, verliert den
 * Zugang und muss den Link aus der Bestätigungsmail erneut öffnen.
 */

const COOKIE = "zugang";

export function baueZugangsWert(kaufId: string): string {
  const geheimnis = process.env.ZUGANG_GEHEIMNIS;
  if (!geheimnis) throw new Error("ZUGANG_GEHEIMNIS fehlt.");
  return baueWert(kaufId, geheimnis);
}

/** Hat die aufrufende Person das Programm gekauft? */
export async function hatZugang(): Promise<boolean> {
  const wert = (await cookies()).get(COOKIE)?.value;
  return pruefeZugangsWert(wert, process.env.ZUGANG_GEHEIMNIS);
}

export const ZUGANG_COOKIE = COOKIE;
export const ZUGANG_MAX_ALTER = GUELTIG_TAGE * 24 * 60 * 60;
