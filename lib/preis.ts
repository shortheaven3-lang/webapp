/** Zentrale Stelle für Produktdaten — Preis steht an genau einem Ort. */
export const PRODUKT = {
  name: "30 Tage Selbstführung",
  /** Betrag in Cent. Stripe rechnet in der kleinsten Währungseinheit. */
  betrag: 3900,
  waehrung: "eur",
  /** Anzahl frei zugänglicher Tage vor der Bezahlschranke. */
  kostenloseTage: 3,
} as const;

export function preisFormatiert(): string {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: PRODUKT.waehrung.toUpperCase(),
  }).format(PRODUKT.betrag / 100);
}
