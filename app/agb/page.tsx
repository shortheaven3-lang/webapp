import type { Metadata } from "next";
import { WIDERRUF } from "@/lib/widerruf";

export const metadata: Metadata = { title: "AGB & Widerruf", robots: { index: false } };

export default function AGB() {
  return (
    <div className="huelle">
      <h1>AGB &amp; Widerruf</h1>
      <p className="hinweis">
        <strong>Diese Seite ist noch nicht geschrieben.</strong> Sie muss stehen, bevor hier
        irgendetwas verkauft wird. Ohne Widerrufsbelehrung fängt die Widerrufsfrist gar nicht
        erst an zu laufen — sie wird dann zu einem Jahr und vierzehn Tagen.
      </p>

      <h2>Was in der Kasse schon eingebaut ist</h2>
      <p>
        Vor dem Bezahlen muss ein Kästchen angehakt werden, das nicht vorangekreuzt ist. Der
        Wortlaut:
      </p>
      <blockquote className="lektion">{WIDERRUF.text}</blockquote>
      <p>
        Ohne dieses Häkchen öffnet sich die Kasse nicht, und zwar serverseitig geprüft. Zustimmung,
        Zeitpunkt und Fassung des Textes werden bei Stripe am Zahlungsvorgang hinterlegt, damit im
        Streitfall nachweisbar ist, wem wann was vorlag.
      </p>
      <p>
        Das ist der Punkt, an dem es bei digitalen Produkten sonst teuer wird: Das vierzehntägige
        Widerrufsrecht erlischt nur dann vorzeitig, wenn vor dem Kauf beides passiert — die Person
        stimmt dem sofortigen Beginn zu <em>und</em> bestätigt, dass sie damit ihr Widerrufsrecht
        verliert. Fehlt das, kann jemand alles lesen und danach das Geld zurückverlangen.
      </p>

      <h2>Was noch fehlt</h2>
      <ul>
        <li>Wer der Vertragspartner ist und wie der Vertrag zustande kommt</li>
        <li>Preise inklusive Steuer, Zahlungsarten, wie und wann der Zugang bereitsteht</li>
        <li>Die Widerrufsbelehrung selbst, mit Muster-Widerrufsformular</li>
        <li>Gewährleistung, Haftung, und was mit den Texten gemacht werden darf und was nicht</li>
      </ul>
      <p className="hinweis">
        Das gehört einmal von einer Rechtsberatung durchgesehen. Es ist überschaubar, es kostet
        einmal etwas, und danach ist Ruhe.
      </p>
    </div>
  );
}
