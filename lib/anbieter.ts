/**
 * Anbieterangaben an genau einer Stelle. Impressum, AGB und Datenschutz
 * greifen alle hierauf zu — es gibt keinen zweiten Ort, an dem eine Anschrift
 * veralten kann.
 *
 * Alles, was in eckigen Klammern steht, ist noch nicht ausgefüllt. Solange das
 * so ist, verweigert die Kasse im Produktivbetrieb den Dienst: ohne Impressum
 * zu verkaufen ist keine Kleinigkeit, und ein vergessenes Feld faellt sonst
 * erst auf, wenn Post kommt.
 */
export const ANBIETER = {
  name: "[VOR- UND NACHNAME ODER FIRMENWORTLAUT]",
  strasse: "[STRASSE UND HAUSNUMMER]",
  ort: "[PLZ UND ORT]",
  land: "Österreich",
  email: "[E-MAIL-ADRESSE]",
  telefon: "[TELEFONNUMMER ODER ZWEITER KONTAKTWEG]",

  /** Leer lassen, wenn nicht im Firmenbuch eingetragen. */
  firmenbuchnummer: "",
  firmenbuchgericht: "",

  /** Leer lassen, wenn Kleinunternehmer ohne UID. */
  umsatzsteuerId: "",

  /** Bei Gewerbe: zustaendige Behoerde. Sonst leer. */
  behoerde: "",

  /** Kleinunternehmerregelung nach § 6 Abs. 1 Z 27 UStG (AT) bzw. § 19 UStG (DE). */
  kleinunternehmer: true,
} as const;

/** Felder, die zwingend gefüllt sein müssen, bevor verkauft werden darf. */
const PFLICHT = ["name", "strasse", "ort", "email"] as const;

export function fehlendeAngaben(): string[] {
  return PFLICHT.filter((feld) => {
    const wert = ANBIETER[feld];
    return !wert || wert.startsWith("[");
  });
}

export function anbieterIstVollstaendig(): boolean {
  return fehlendeAngaben().length === 0;
}
