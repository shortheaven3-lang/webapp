import type { Metadata } from "next";

export const metadata: Metadata = { title: "Datenschutz", robots: { index: false } };

export default function Datenschutz() {
  return (
    <div className="huelle">
      <h1>Datenschutz</h1>
      <p className="hinweis">
        <strong>Noch auszufüllen.</strong> Platzhalter.
      </p>

      <h2>Was diese App tatsächlich verarbeitet</h2>
      <p>Damit die Erklärung nicht an der Wirklichkeit vorbeigeht — der Stand heute:</p>
      <ul>
        <li>
          <strong>E-Mail-Adresse</strong> bei der Anmeldung zum kostenlosen Einstieg, samt
          Zeitpunkt und Herkunftsseite. Empfänger ist der unter{" "}
          <code>ANMELDUNG_WEBHOOK</code> eingetragene Dienst.
        </li>
        <li>
          <strong>Zahlungsdaten</strong> ausschließlich bei Stripe. Die App sieht davon nur die
          Kennung der Kassensitzung.
        </li>
        <li>
          <strong>Ein Cookie</strong> namens <code>zugang</code>: technisch notwendig, speichert
          nur die signierte Kaufkennung und ein Ablaufdatum, keine personenbezogenen Daten.
        </li>
        <li>Kein Tracking, keine Analyse, keine Werbenetzwerke.</li>
      </ul>

      <p className="hinweis">
        Ergänzt werden müssen: Verantwortlicher, Rechtsgrundlagen, Speicherdauer, Betroffenenrechte,
        Auftragsverarbeitung mit Stripe und dem E-Mail-Dienst sowie Hinweise zur
        Datenübermittlung in Drittländer.
      </p>
    </div>
  );
}
