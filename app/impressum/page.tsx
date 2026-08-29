import type { Metadata } from "next";

export const metadata: Metadata = { title: "Impressum", robots: { index: false } };

export default function Impressum() {
  return (
    <div className="huelle">
      <h1>Impressum</h1>
      <p className="hinweis">
        <strong>Noch auszufüllen.</strong> Diese Seite ist ein Platzhalter. Solange hier keine
        echten Angaben stehen, darf das Programm nicht verkauft werden — eine fehlende oder
        unvollständige Anbieterkennzeichnung ist abmahnfähig.
      </p>

      <h2>Was hier stehen muss</h2>
      <ul>
        <li>Vollständiger Name und Anschrift (kein Postfach)</li>
        <li>E-Mail-Adresse und eine zweite Kontaktmöglichkeit</li>
        <li>Bei eingetragenem Unternehmen: Firmenbuch- bzw. Handelsregisternummer und Gericht</li>
        <li>Umsatzsteuer-Identifikationsnummer, sofern vorhanden</li>
        <li>Zuständige Aufsichts- bzw. Gewerbebehörde und Kammerzugehörigkeit</li>
        <li>Link zur Online-Streitbeilegungsplattform der EU</li>
      </ul>

      <p className="hinweis">
        Die genauen Pflichten unterscheiden sich je nachdem, ob du in Österreich (ECG, UGB) oder
        Deutschland (DDG) sitzt und ob du als Einzelperson oder Unternehmen auftrittst. Das
        gehört einmal von einer Rechtsberatung geprüft — es ist überschaubar und einmalig.
      </p>
    </div>
  );
}
