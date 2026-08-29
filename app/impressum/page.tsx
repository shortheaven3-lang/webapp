import type { Metadata } from "next";
import LueckenHinweis from "@/components/LueckenHinweis";
import { ANBIETER } from "@/lib/anbieter";

export const metadata: Metadata = { title: "Impressum", robots: { index: false } };

export default function Impressum() {
  return (
    <div className="huelle">
      <h1>Impressum</h1>
      <LueckenHinweis />

      <h2>Angaben nach § 5 ECG und § 25 MedienG</h2>
      <p>
        {ANBIETER.name}
        <br />
        {ANBIETER.strasse}
        <br />
        {ANBIETER.ort}
        <br />
        {ANBIETER.land}
      </p>

      <p>
        E-Mail: {ANBIETER.email}
        <br />
        {ANBIETER.telefon}
      </p>

      {ANBIETER.firmenbuchnummer && (
        <p>
          Firmenbuchnummer: {ANBIETER.firmenbuchnummer}
          <br />
          Firmenbuchgericht: {ANBIETER.firmenbuchgericht}
        </p>
      )}

      {ANBIETER.umsatzsteuerId ? (
        <p>UID-Nummer: {ANBIETER.umsatzsteuerId}</p>
      ) : (
        <p>
          Kleinunternehmer im Sinne des Umsatzsteuergesetzes. Es wird keine Umsatzsteuer
          ausgewiesen.
        </p>
      )}

      {ANBIETER.behoerde && <p>Zuständige Behörde: {ANBIETER.behoerde}</p>}

      <h2>Unternehmensgegenstand</h2>
      <p>Erstellung und Vertrieb digitaler Inhalte zur persönlichen Weiterbildung.</p>

      <h2>Online-Streitbeilegung</h2>
      <p>
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit:{" "}
        <a href="https://ec.europa.eu/consumers/odr" rel="noreferrer">
          ec.europa.eu/consumers/odr
        </a>
        . Wir sind weder verpflichtet noch bereit, an einem Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>

      <h2>Haftung für Inhalte und Links</h2>
      <p>
        Die Inhalte dieser Seiten wurden mit Sorgfalt erstellt. Für die Richtigkeit,
        Vollständigkeit und Aktualität wird keine Gewähr übernommen. Für Inhalte externer Links
        ist ausschließlich deren Betreiber verantwortlich.
      </p>

      <h2>Urheberrecht</h2>
      <p>
        Die Texte und Gestaltung dieser Seiten sind urheberrechtlich geschützt. Die im Rahmen des
        Programms erworbenen Inhalte sind zum persönlichen Gebrauch bestimmt; eine Weitergabe
        oder Veröffentlichung ist nicht gestattet.
      </p>

      <p className="hinweis">
        <strong>Zum Stand dieses Textes:</strong> Das ist ein Entwurf und keine Rechtsberatung.
        Er ist auf einen Anbieter in Österreich zugeschnitten. Sitzt du in Deutschland, treten an
        die Stelle von ECG und MedienG das DDG und der MStV, und die Pflichtangaben sind teils
        andere. Lass das einmal durchsehen, bevor du verkaufst — es ist überschaubar und danach
        erledigt.
      </p>
    </div>
  );
}
