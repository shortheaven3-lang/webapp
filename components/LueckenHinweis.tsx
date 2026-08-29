import { fehlendeAngaben } from "@/lib/anbieter";

/**
 * Sichtbarer Hinweis, solange die Anbieterangaben fehlen. Absichtlich
 * auffällig: eine Seite, die aussieht wie fertig, aber keine ist, führt
 * genau zu dem Fehler, den sie verhindern soll.
 */
export default function LueckenHinweis() {
  const fehlt = fehlendeAngaben();
  if (fehlt.length === 0) return null;

  return (
    <p className="warnung">
      <strong>Entwurf, noch nicht verwendbar.</strong> In <code>lib/anbieter.ts</code> fehlen
      noch: {fehlt.join(", ")}. Solange das so ist, verweigert die Kasse im Produktivbetrieb
      den Verkauf.
    </p>
  );
}
