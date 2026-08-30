import { AUSSAGEN, BEREICHE, type Bereich } from "../content/selbsttest.ts";

/**
 * Auswertung des Selbsttests. Bewusst ohne Next-Bindung, damit sie ohne
 * laufende Anwendung geprüft werden kann.
 */

export type Niveau = "niedrig" | "mittel" | "hoch";

export type Auswertung = {
  bereich: Bereich;
  summen: Record<Bereich, number>;
  gesamt: number;
  hoechstwert: number;
  niveau: Niveau;
  /** true, wenn zwei oder mehr Bereiche denselben Höchstwert haben. */
  gleichstand: boolean;
};

/** Höchstmögliche Summe: jede Aussage mit der höchsten Stufe beantwortet. */
export const HOECHSTE_GESAMTSUMME = AUSSAGEN.length * 2;

export function leereAntworten(): Record<string, number> {
  return {};
}

/**
 * Wertet die Antworten aus.
 *
 * Nicht beantwortete Aussagen zählen als 0 — ein abgebrochener Test soll ein
 * Ergebnis liefern statt eines Fehlers.
 *
 * Bei Gleichstand gewinnt der Bereich, der im Programm zuerst drankommt. Das
 * ist keine Willkür: Die vier Wochen bauen aufeinander auf, und wer bei
 * Grenzen und Handeln gleich hoch liegt, fängt sinnvoll bei Grenzen an.
 */
export function auswerten(antworten: Record<string, number>): Auswertung {
  const summen = Object.fromEntries(BEREICHE.map((b) => [b, 0])) as Record<Bereich, number>;

  for (const aussage of AUSSAGEN) {
    const roh = antworten[aussage.id];
    const wert = Number.isFinite(roh) ? Math.min(2, Math.max(0, Math.trunc(roh as number))) : 0;
    summen[aussage.bereich] += wert;
  }

  const hoechstwert = Math.max(...BEREICHE.map((b) => summen[b]));
  const bereich = BEREICHE.find((b) => summen[b] === hoechstwert) as Bereich;
  const gleichstand = BEREICHE.filter((b) => summen[b] === hoechstwert).length > 1;

  const gesamt = BEREICHE.reduce((summe, b) => summe + summen[b], 0);
  const anteil = gesamt / HOECHSTE_GESAMTSUMME;

  const niveau: Niveau = anteil < 0.25 ? "niedrig" : anteil < 0.6 ? "mittel" : "hoch";

  return { bereich, summen, gesamt, hoechstwert, niveau, gleichstand };
}

export function istNiveau(wert: string | undefined): wert is Niveau {
  return wert === "niedrig" || wert === "mittel" || wert === "hoch";
}
