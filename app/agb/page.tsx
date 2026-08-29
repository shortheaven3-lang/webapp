import type { Metadata } from "next";
import LueckenHinweis from "@/components/LueckenHinweis";
import { ANBIETER } from "@/lib/anbieter";
import { PRODUKT, preisFormatiert } from "@/lib/preis";
import { WIDERRUF } from "@/lib/widerruf";

export const metadata: Metadata = { title: "AGB & Widerruf", robots: { index: false } };

export default function AGB() {
  return (
    <div className="huelle">
      <h1>AGB &amp; Widerrufsbelehrung</h1>
      <LueckenHinweis />

      <h2>1. Wer verkauft</h2>
      <p>
        {ANBIETER.name}, {ANBIETER.strasse}, {ANBIETER.ort} ({ANBIETER.land}), erreichbar unter{" "}
        {ANBIETER.email}. Diese Bedingungen gelten für den Kauf des digitalen Programms
        „{PRODUKT.name}“ über diese Website.
      </p>

      <h2>2. Wie der Vertrag zustande kommt</h2>
      <p>
        Die Darstellung des Programms auf dieser Website ist noch kein Angebot. Mit dem Absenden
        der Bestellung über den Zahlungsdienstleister Stripe gibst du ein verbindliches Angebot
        ab. Der Vertrag kommt zustande, sobald die Zahlung bestätigt und der Zugang freigeschaltet
        ist.
      </p>

      <h2>3. Was du bekommst</h2>
      <p>
        Zugang zu allen Lektionen des Programms in der zum Kaufzeitpunkt verfügbaren Fassung. Die
        Inhalte sind Text und werden im Browser bereitgestellt. Der Zugang ist zeitlich nicht
        begrenzt, setzt aber voraus, dass diese Website betrieben wird; eine Mindestlaufzeit wird
        nicht zugesichert. Es besteht kein Anspruch auf künftige Erweiterungen.
      </p>

      <h2>4. Preis und Zahlung</h2>
      <p>
        Der Preis beträgt einmalig {preisFormatiert()}. Es handelt sich um einen Einmalkauf ohne
        Abonnement und ohne automatische Verlängerung. Die Zahlung wird über Stripe abgewickelt;
        dabei gelten zusätzlich deren Bedingungen.{" "}
        {ANBIETER.kleinunternehmer
          ? "Als Kleinunternehmer wird keine Umsatzsteuer ausgewiesen."
          : "Der Preis versteht sich inklusive der gesetzlichen Umsatzsteuer."}
      </p>

      <h2>5. Bereitstellung</h2>
      <p>
        Der Zugang wird unmittelbar nach bestätigter Zahlung freigeschaltet. Technisch geschieht
        das über ein Erkennungsmerkmal im Browser, mit dem du gekauft hast. Wechselst du das Gerät
        oder löschst deine Browserdaten, wende dich an {ANBIETER.email} — der Zugang wird dann
        wiederhergestellt.
      </p>

      <h2>6. Widerrufsrecht</h2>
      <p>
        Verbraucherinnen und Verbrauchern steht ein Widerrufsrecht von vierzehn Tagen ab
        Vertragsabschluss zu. Um es auszuüben, genügt eine eindeutige Erklärung an{" "}
        {ANBIETER.email}. Eine Begründung ist nicht erforderlich. Die Frist ist gewahrt, wenn die
        Erklärung vor Fristablauf abgesendet wird.
      </p>

      <h3>Vorzeitiges Erlöschen bei digitalen Inhalten</h3>
      <p>
        Das Widerrufsrecht erlischt vorzeitig, wenn du vor dem Kauf ausdrücklich zustimmst, dass
        mit der Bereitstellung sofort begonnen wird, und dabei bestätigst, dass du dadurch dein
        Widerrufsrecht verlierst. Genau dazu musst du im Bestellvorgang ein Kästchen setzen, das
        nicht vorangekreuzt ist. Der Wortlaut lautet:
      </p>
      <blockquote className="lektion">{WIDERRUF.text}</blockquote>
      <p>
        Ohne dieses Häkchen lässt sich der Kauf nicht abschließen. Zustimmung, Zeitpunkt und
        Fassung dieses Textes werden zum Zahlungsvorgang gespeichert.
      </p>

      <h3>Muster-Widerrufsformular</h3>
      <p className="lektion">
        <em>
          An {ANBIETER.name}, {ANBIETER.strasse}, {ANBIETER.ort}, {ANBIETER.email}:
          <br />
          Hiermit widerrufe ich den von mir abgeschlossenen Vertrag über den Kauf des Programms
          „{PRODUKT.name}“.
          <br />
          Bestellt am: … Name: … Anschrift: … Datum: …
        </em>
      </p>

      <h2>7. Kostenloser Teil</h2>
      <p>
        Die ersten {PRODUKT.kostenloseTage} Lektionen sind ohne Kauf zugänglich. Daraus entsteht
        kein Vertrag und kein Anspruch auf dauerhafte Verfügbarkeit.
      </p>

      <h2>8. Nutzungsrechte</h2>
      <p>
        Du darfst die Inhalte für dich persönlich nutzen. Weitergabe, Veröffentlichung,
        Vervielfältigung oder Weiterverkauf sind nicht gestattet. Zugangsdaten und Zugangslinks
        sind nicht zur Weitergabe bestimmt.
      </p>

      <h2>9. Gewährleistung und Haftung</h2>
      <p>
        Es gelten die gesetzlichen Gewährleistungsbestimmungen. Für leichte Fahrlässigkeit wird
        nicht gehaftet, ausgenommen bei Personenschäden. Die Inhalte sind Anregungen zur
        Selbstreflexion und ersetzen keine medizinische, psychotherapeutische oder rechtliche
        Beratung. Ein bestimmter Erfolg wird nicht geschuldet.
      </p>

      <h2>10. Änderungen und Schlussbestimmungen</h2>
      <p>
        Für bereits abgeschlossene Verträge gilt die zum Kaufzeitpunkt gültige Fassung dieser
        Bedingungen. Es gilt das Recht des Landes, in dem der Anbieter seinen Sitz hat; zwingende
        Verbraucherschutzbestimmungen des Aufenthaltsstaates bleiben unberührt. Sollte eine
        Bestimmung unwirksam sein, bleibt der übrige Vertrag wirksam.
      </p>

      <p className="hinweis">
        <strong>Zum Stand dieses Textes:</strong> Entwurf, keine Rechtsberatung. Er ist auf einen
        Anbieter in Österreich zugeschnitten und deckt den Normalfall ab. Drei Punkte gehören vor
        dem ersten Verkauf durchgesehen: die Umsatzsteuerlage (Kleinunternehmer oder nicht, und
        ob du bei Verkäufen ins EU-Ausland die OSS-Regelung brauchst), die Haftungsklausel unter
        Punkt 9, und ob dein Gerichtsstand so haltbar ist.
      </p>
    </div>
  );
}
