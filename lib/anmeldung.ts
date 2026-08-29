import "server-only";
import { istEmail } from "@/lib/email";
import { trageEin, type VersandErgebnis } from "@/lib/versand";

export { istEmail };

export type AnmeldeErgebnis =
  | { ok: true }
  | { ok: false; grund: "ungueltig" | "kein_ziel" | "abgelehnt" | "fehler" };

export async function speichereAnmeldung(
  email: string,
  quelle: string,
): Promise<AnmeldeErgebnis> {
  const sauber = email.trim().toLowerCase();
  if (!istEmail(sauber)) return { ok: false, grund: "ungueltig" };

  const ergebnis: VersandErgebnis = await trageEin({
    email: sauber,
    quelle,
    zeitpunkt: new Date().toISOString(),
  });

  if (ergebnis.ok) return { ok: true };

  if (ergebnis.hinweis) console.error("Anmeldung nicht eingetragen:", ergebnis.hinweis);
  return { ok: false, grund: ergebnis.grund };
}
