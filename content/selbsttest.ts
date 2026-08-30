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
    text: "Am Abend fällt mir auf, dass der Tag anderen gehört hat.",
  },
  {
    id: "g1",
    bereich: "grenzen",
    text: "Ich sage zu und ärgere mich zwei Sekunden später darüber.",
  },
  {
    id: "h1",
    bereich: "handeln",
    text: "Ich schiebe eine Sache seit Wochen vor mir her, obwohl ich weiß, was zu tun wäre.",
  },
  {
    id: "l1",
    bereich: "loslassen",
    text: "Ich führe Gespräche im Kopf, die längst vorbei sind.",
  },
  {
    id: "s2",
    bereich: "sehen",
    text: "Dass mich etwas gestört hat, merke ich erst Stunden später.",
  },
  {
    id: "g2",
    bereich: "grenzen",
    text: "Wenn ich absage, liefere ich Gründe mit, nach denen niemand gefragt hat.",
  },
  {
    id: "h2",
    bereich: "handeln",
    text: "Ich warte auf den passenden Moment, um anzufangen.",
  },
  {
    id: "l2",
    bereich: "loslassen",
    text: "Ich warte darauf, dass jemand einsieht, was er mir angetan hat.",
  },
  {
    id: "s3",
    bereich: "sehen",
    text: "Wenn mich jemand fragt, wie es mir geht, muss ich erst überlegen.",
  },
  {
    id: "g3",
    bereich: "grenzen",
    text: "Ich antworte sofort auf Nachrichten, auch wenn ich gerade etwas anderes mache.",
  },
  {
    id: "h3",
    bereich: "handeln",
    text: "Wenn ich einen Tag auslasse, lasse ich den nächsten auch aus.",
  },
  {
    id: "l3",
    bereich: "loslassen",
    text: "Ich schaue nach, was jemand macht, mit dem ich eigentlich abgeschlossen habe.",
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
    kern: "Es ist nicht so, dass du dich übergehst. Du bemerkst es nur erst hinterher.",
    text: [
      "Bei dir ist der Abstand zwischen dem Moment und dem Bemerken am größten. Du sagst zu, du schluckst etwas, du übergehst dich — und die Rechnung kommt Stunden später, wenn nichts mehr zu ändern ist.",
      "Das ist die unangenehmste Ausgangslage, weil sie sich nach nichts anfühlt. Man merkt ja nichts. Und es ist zugleich die beste, weil sich daran am schnellsten etwas ändert: Bemerken ist eine Fähigkeit, keine Charaktereigenschaft.",
      "Alles Weitere setzt darauf auf. Grenzen ziehen kann nur, wer die Grenzüberschreitung mitbekommt, während sie passiert.",
    ],
    woche: "Woche 1 — Sehen",
    tage: [1, 6, 7],
  },
  grenzen: {
    bereich: "grenzen",
    titel: "Du sagst Ja und meinst Nein",
    kern: "Du weißt meistens, was du willst. Es kommt nur nicht heraus.",
    text: [
      "Bei dir liegt es nicht am Sehen. Du merkst ziemlich genau, wann dir etwas zu viel ist — es kommt nur nicht nach außen. Stattdessen kommen Gründe, Erklärungen, ein Ja, das eigentlich ein Nein war.",
      "Dahinter steckt selten Schwäche. Meistens steckt dahinter eine alte Rechnung: Widerspruch war irgendwann teuer, und der Reflex, Spannung aus dem Raum zu nehmen, hat sich seitdem gehalten.",
      "Der Weg dort heraus ist unspektakulär und unbequem. Es geht um einzelne Sätze, um die Stille danach, und darum, sie auszuhalten, ohne sie zu füllen.",
    ],
    woche: "Woche 2 — Grenzen",
    tage: [3, 8, 9],
  },
  handeln: {
    bereich: "handeln",
    titel: "Du weißt es und tust es nicht",
    kern: "An Einsicht fehlt es bei dir nicht. An Anfangen schon.",
    text: [
      "Du weißt ziemlich genau, was zu tun wäre. Es passiert nur nicht. Und weil du es weißt, kommt zur Sache selbst noch der Ärger darüber dazu, dass du sie nicht angehst.",
      "Fast immer steckt eine falsche Reihenfolge dahinter: die Annahme, dass erst die Bereitschaft kommt und dann das Tun. Es ist umgekehrt. Man fängt unmotiviert an, arbeitet zehn Minuten schlecht, und irgendwo dazwischen kippt es.",
      "Dazu kommt die Größe. Was sich Leute vornehmen, ist meistens auf gute Tage zugeschnitten. Entschieden wird aber an den schlechten.",
    ],
    woche: "Woche 3 — Handeln",
    tage: [2, 15, 18],
  },
  loslassen: {
    bereich: "loslassen",
    titel: "Du hältst fest, was vorbei ist",
    kern: "Ein Teil deiner Aufmerksamkeit ist noch woanders gebunden.",
    text: [
      "Bei dir liegt etwas offen. Eine Sache, eine Person, eine Rechnung, die nie beglichen wurde. Und ein Teil deiner Aufmerksamkeit ist noch dort, jeden Tag ein bisschen.",
      "Das Zähe daran ist, dass es sich nach Treue anfühlt oder nach Gerechtigkeit. Man wartet auf die Einsicht, die Entschuldigung, den Moment, in dem endlich jemand zugibt, dass man recht hatte. Der andere lebt weiter und merkt nichts davon.",
      "Loslassen ist dabei kein Gefühl, auf das man wartet. Es sind fünfzig kleine Unterlassungen, und das Gefühl kommt hinterher.",
    ],
    woche: "Woche 4 — Loslassen",
    tage: [22, 23, 24],
  },
};

export function istBereich(wert: string): wert is Bereich {
  return (BEREICHE as readonly string[]).includes(wert);
}
