/**
 * Der Selbsttest.
 *
 * Zwölf Aussagen, drei je Bereich. Wer zustimmt, bekommt am Ende den Bereich
 * genannt, in dem es bei ihm am lautesten ist — und die Tage, die dort
 * ansetzen.
 *
 * Bewusst kein Punktestand und keine Typenlehre: Das ist eine Sortierhilfe,
 * kein diagnostisches Verfahren. Der Ergebnistext sagt das auch.
 */

export const BEREICHE = ["sehen", "grenzen", "handeln", "loslassen"] as const;
export type Bereich = (typeof BEREICHE)[number];

export type Aussage = {
  id: string;
  bereich: Bereich;
  text: string;
};

/** Antwortstufen. Die Werte fließen direkt in die Summe je Bereich. */
export const STUFEN = [
  { wert: 0, text: "Selten" },
  { wert: 1, text: "Manchmal" },
  { wert: 2, text: "Oft" },
] as const;

export const AUSSAGEN: Aussage[] = [
  {
    id: "s1",
    bereich: "sehen",
    text: "Ich sitze abends im Auto vor der Tür und weiß nicht, wo der Tag hin ist.",
  },
  {
    id: "g1",
    bereich: "grenzen",
    text: "Ich höre mich Ja sagen und denke gleichzeitig: Warum jetzt?",
  },
  {
    id: "h1",
    bereich: "handeln",
    text: "Es gibt einen Anruf, den ich seit Wochen jeden Morgen auf morgen verschiebe.",
  },
  {
    id: "l1",
    bereich: "loslassen",
    text: "Ich führe Gespräche im Kopf, in denen ich endlich die richtige Antwort habe.",
  },
  {
    id: "s2",
    bereich: "sehen",
    text: "Erst unter der Dusche fällt mir ein, was mich an dem Gespräch gestört hat.",
  },
  {
    id: "g2",
    bereich: "grenzen",
    text: "Für ein Nein habe ich drei Gründe parat, nach denen niemand gefragt hat.",
  },
  {
    id: "h2",
    bereich: "handeln",
    text: "Ich räume erst den Schreibtisch auf. Dann ist der Vormittag weg.",
  },
  {
    id: "l2",
    bereich: "loslassen",
    text: "Ich warte auf einen Satz, den diese Person nie sagen wird.",
  },
  {
    id: "s3",
    bereich: "sehen",
    text: "Jemand fragt, wie es mir geht, und ich sage „gut“, bevor ich nachgesehen habe.",
  },
  {
    id: "g3",
    bereich: "grenzen",
    text: "Es ist halb elf und ich beantworte noch eine Nachricht, die bis morgen Zeit hätte.",
  },
  {
    id: "h3",
    bereich: "handeln",
    text: "Nach einem ausgelassenen Tag denke ich: Dann fange ich eben Montag neu an.",
  },
  {
    id: "l3",
    bereich: "loslassen",
    text: "Ich habe diese Woche nachgesehen, was jemand macht, mit dem ich abgeschlossen habe.",
  },
];

export type Ergebnis = {
  bereich: Bereich;
  /** Kurzform für Überschriften und geteilte Links. */
  titel: string;
  /** Ein Satz, der das Ergebnis benennt. */
  kern: string;
  /** Der ausführliche Text auf der Ergebnisseite. */
  text: string[];
  /** Die Woche des Programms, die hier ansetzt. */
  woche: string;
  /** Tage, die diesen Bereich behandeln. */
  tage: number[];
};

export const ERGEBNISSE: Record<Bereich, Ergebnis> = {
  sehen: {
    bereich: "sehen",
    titel: "Du merkst es zu spät",
    kern: "Zwischen dem Moment und dem Bemerken liegt bei dir der größte Abstand.",
    text: [
      "Du übergehst dich nicht öfter als andere. Du bekommst es nur später mit. Das Ja ist schon draußen, die Tür ist schon zu, und irgendwann später meldet sich das Gefühl, das vorher dran gewesen wäre.",
      "Das fühlt sich nach nichts an, und genau darin liegt das Zähe. Man kann schwer etwas ändern, das man nicht bemerkt hat. Viele halten sich deshalb für zufrieden und sind bloß langsam.",
      "Die gute Nachricht steckt in derselben Sache. Bemerken ist keine Eigenschaft, die man hat oder nicht hat, sondern eine Frage von Sekunden. Und die werden kürzer, wenn man ein paar Tage darauf achtet.",
    ],
    woche: "Woche 1 — Sehen",
    tage: [1, 6, 7],
  },
  grenzen: {
    bereich: "grenzen",
    titel: "Du sagst Ja und meinst Nein",
    kern: "Du weißt ziemlich genau, was du willst. Es kommt nur nicht heraus.",
    text: [
      "Am Merken liegt es bei dir nicht. Du spürst früh, wann dir etwas zu viel wird. Zwischen dem Spüren und dem Sagen gibt es nur diese eine Stelle, an der es regelmäßig abbiegt — meistens Richtung Erklärung.",
      "Dahinter steckt selten Schwäche. Meistens eine alte Erfahrung: Widerspruch war irgendwann teuer, und der Reflex, Spannung aus dem Raum zu nehmen, ist geblieben, obwohl die Lage sich längst geändert hat.",
      "Was hilft, ist unspektakulär. Ein Satz ohne Begründung, und die drei Sekunden Stille danach. Genau dort knicken die meisten ein und liefern doch noch einen Grund nach.",
    ],
    woche: "Woche 2 — Grenzen",
    tage: [3, 8, 9],
  },
  handeln: {
    bereich: "handeln",
    titel: "Du weißt es und tust es nicht",
    kern: "Du weißt es, du nimmst es dir vor, und dann passiert es trotzdem nicht.",
    text: [
      "An Einsicht fehlt es dir nicht. Die Sache, die du seit Wochen vor dir herschiebst, könntest du in zwei Sätzen erklären. Deshalb kommt zur Sache noch der Ärger darüber, dass sie liegen bleibt — und der macht sie schwerer, nicht leichter.",
      "Meistens steckt eine verdrehte Reihenfolge dahinter: die Annahme, dass erst die Bereitschaft kommt und dann das Anfangen. Es läuft andersherum. Man setzt sich lustlos hin, macht zehn Minuten schlecht, und irgendwo dazwischen kippt es.",
      "Dazu die Größe. Was Leute sich vornehmen, ist auf gute Tage gerechnet. Entschieden wird an den schlechten, und davon gibt es mehr.",
    ],
    woche: "Woche 3 — Handeln",
    tage: [2, 15, 18],
  },
  loslassen: {
    bereich: "loslassen",
    titel: "Du hältst fest, was vorbei ist",
    kern: "Ein Teil von dir ist noch in einer Sache, die längst vorbei ist.",
    text: [
      "Da liegt etwas offen. Eine Person, ein Satz, der nie gesagt wurde, eine Rechnung, die niemand mehr begleicht. Und ein Teil deiner Aufmerksamkeit ist jeden Tag noch kurz dort.",
      "Zäh wird es, weil es sich nach Treue anfühlt oder nach Gerechtigkeit. Man wartet auf die Einsicht, die Entschuldigung, den Moment, in dem endlich jemand zugibt, dass man recht hatte. Die andere Seite weiß meistens nicht einmal davon.",
      "Loslassen ist dabei kein Gefühl, auf das man wartet. Es sind fünfzig kleine Unterlassungen, und das Gefühl kommt erst, wenn die schon eine Weile laufen.",
    ],
    woche: "Woche 4 — Loslassen",
    tage: [22, 23, 24],
  },
};

export function istBereich(wert: string): wert is Bereich {
  return (BEREICHE as readonly string[]).includes(wert);
}
