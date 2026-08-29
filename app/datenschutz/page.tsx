import type { Metadata } from "next";
import LueckenHinweis from "@/components/LueckenHinweis";
import { ANBIETER } from "@/lib/anbieter";

export const metadata: Metadata = { title: "Datenschutz", robots: { index: false } };

export default function Datenschutz() {
  return (
    <div className="huelle">
      <h1>Datenschutz</h1>
      <LueckenHinweis />

      <p className="vorspann">
        Diese Seite verarbeitet wenig, und was sie verarbeitet, steht hier vollständig. Kein
        Tracking, keine Analysewerkzeuge, keine Werbenetzwerke, keine Weitergabe zu Werbezwecken.
      </p>

      <h2>Verantwortlich</h2>
      <p>
        {ANBIETER.name}, {ANBIETER.strasse}, {ANBIETER.ort}, {ANBIETER.land}. Fragen zum
        Datenschutz an {ANBIETER.email}.
      </p>

      <h2>E-Mail-Adresse bei der Anmeldung</h2>
      <p>
        Trägst du dich für die kostenlosen Tage ein, werden deine E-Mail-Adresse, der Zeitpunkt
        und die Seite gespeichert, von der aus du dich eingetragen hast. Zweck ist der Versand
        der angekündigten Impulse und Hinweise zum Programm. Rechtsgrundlage ist deine
        Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Du kannst sie jederzeit widerrufen — über den
        Abmeldelink in jeder Mail oder formlos an {ANBIETER.email}. Danach wird die Adresse
        gelöscht.
      </p>

      <h2>Kauf und Zahlung</h2>
      <p>
        Die Zahlung wickelt Stripe ab (Stripe Payments Europe Ltd., Irland). Zahlungsdaten
        gelangen direkt dorthin und nicht zu uns. Wir sehen die Kennung des Zahlungsvorgangs, den
        Zahlungsstatus, das Rechnungsland und die zum Widerrufsrecht abgegebene Zustimmung samt
        Zeitpunkt. Rechtsgrundlage ist die Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO), für die
        Aufbewahrung der Zustimmung zusätzlich das berechtigte Interesse an ihrer Nachweisbarkeit
        (lit. f). Belege unterliegen der gesetzlichen Aufbewahrungspflicht von sieben Jahren.
      </p>

      <h2>Zugangs-Cookie</h2>
      <p>
        Nach dem Kauf wird ein Cookie namens <code>zugang</code> gesetzt. Es enthält die Kennung
        des Zahlungsvorgangs, ein Ablaufdatum und eine Signatur — keine weiteren Angaben zu deiner
        Person. Es ist technisch notwendig, um gekaufte Inhalte anzuzeigen, und läuft nach einem
        Jahr ab. Eine Einwilligung ist dafür nicht erforderlich, weil ohne dieses Cookie die
        ausdrücklich gewünschte Leistung nicht erbracht werden kann. Weitere Cookies werden nicht
        gesetzt.
      </p>

      <h2>Serverbetrieb</h2>
      <p>
        Die Website wird bei einem Hosting-Anbieter betrieben, der beim Abruf technisch bedingt
        IP-Adresse, Zeitpunkt und aufgerufene Adresse verarbeitet. Rechtsgrundlage ist das
        berechtigte Interesse am sicheren Betrieb (Art. 6 Abs. 1 lit. f DSGVO).
      </p>

      <h2>Empfänger</h2>
      <ul>
        <li>Stripe — Zahlungsabwicklung</li>
        <li>der Versanddienst für E-Mails — Verwaltung der Anmeldungen und Versand</li>
        <li>der Hosting-Anbieter — Betrieb der Website</li>
      </ul>
      <p>
        Mit diesen Dienstleistern bestehen Verträge zur Auftragsverarbeitung. Soweit Daten in
        Drittländer übermittelt werden, geschieht das auf Grundlage der Standardvertragsklauseln
        der EU-Kommission oder eines Angemessenheitsbeschlusses.
      </p>

      <h2>Deine Rechte</h2>
      <p>
        Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
        Datenübertragbarkeit und Widerspruch. Eine erteilte Einwilligung kannst du jederzeit mit
        Wirkung für die Zukunft widerrufen. Wende dich dafür an {ANBIETER.email}. Außerdem steht
        dir eine Beschwerde bei der Aufsichtsbehörde zu — in Österreich die Datenschutzbehörde,
        in Deutschland die Landesbeauftragten für den Datenschutz.
      </p>

      <p className="hinweis">
        <strong>Zum Stand dieses Textes:</strong> Entwurf, keine Rechtsberatung. Zwei Stellen sind
        erst dann korrekt, wenn die Technik danebensteht: Der Hosting-Anbieter und der
        E-Mail-Versanddienst müssen namentlich genannt werden, sobald sie feststehen. Bis dahin
        ist dieser Text unvollständig.
      </p>
    </div>
  );
}
