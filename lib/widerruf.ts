/**
 * Die Zustimmung, mit der das Widerrufsrecht vorzeitig erlischt.
 *
 * Bei digitalen Inhalten erlischt das vierzehntägige Widerrufsrecht nur, wenn
 * die Kundin oder der Kunde vor dem Kauf zweierlei tut: dem sofortigen Beginn
 * der Bereitstellung ausdrücklich zustimmen und bestätigen, dadurch das
 * Widerrufsrecht zu verlieren. Beides steht deshalb in einem Satz und in einer
 * Kästchenabfrage, die nicht vorangekreuzt ist.
 *
 * Die Version wird mitgeschrieben. Ändert sich der Wortlaut, muss später
 * nachvollziehbar bleiben, welchem Text jemand zugestimmt hat.
 */
export const WIDERRUF = {
  version: "2026-08-29",
  text:
    "Ich möchte sofort Zugang zu allen Tagen. Mir ist bewusst, dass mein " +
    "Widerrufsrecht damit erlischt, sobald der Zugang freigeschaltet ist.",
} as const;
