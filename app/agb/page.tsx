import type { Metadata } from "next";

export const metadata: Metadata = { title: "AGB & Widerruf", robots: { index: false } };

export default function AGB() {
  return (
    <div className="huelle">
      <h1>AGB &amp; Widerruf</h1>
      <p className="hinweis">
        <strong>Noch auszufüllen.</strong> Platzhalter. Ohne Widerrufsbelehrung beginnt die
        Widerrufsfrist nicht zu laufen — sie verlängert sich dann auf zwölf Monate.
      </p>

      <h2>Der Punkt, der bei digitalen Produkten entscheidet</h2>
      <p>
        Verbraucherinnen und Verbraucher haben vierzehn Tage Widerrufsrecht. Bei digitalen
        Inhalten erlischt es vorzeitig — aber nur, wenn <em>vor</em> dem Kauf beides passiert:
      </p>
      <ul>
        <li>die Person stimmt ausdrücklich zu, dass sofort mit der Bereitstellung begonnen wird</li>
        <li>sie bestätigt, dass sie dadurch ihr Widerrufsrecht verliert</li>
      </ul>
      <p>
        Beides muss dokumentiert sein. Fehlt es, kann jemand das Programm dreißig Tage lesen und
        danach das Geld zurückverlangen. Technisch gehört diese Zustimmung als Pflichtfeld in die
        Kasse — in Stripe Checkout über <code>consent_collection</code> und die
        Nutzungsbedingungen.
      </p>

      <h2>Was sonst hier stehen muss</h2>
      <ul>
        <li>Vertragspartner, Zustandekommen des Vertrags, Preise inklusive Steuer</li>
        <li>Zahlungsarten und Bereitstellung des Zugangs</li>
        <li>Widerrufsbelehrung samt Muster-Widerrufsformular</li>
        <li>Gewährleistung, Haftung, Nutzungsrechte an den Inhalten</li>
      </ul>
    </div>
  );
}
