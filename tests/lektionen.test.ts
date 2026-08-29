import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { alleLektionen, alsHtml, lektionFuerTag } from "../lib/lektionen.ts";
import { PRODUKT } from "../lib/preis.ts";

const lektionen = alleLektionen();

describe("Lektionen", () => {
  test("alle Dateien lassen sich lesen und ergeben Einträge", () => {
    assert.ok(lektionen.length > 0);
  });

  test("die Tage sind lückenlos von 1 an durchnummeriert", () => {
    const tage = lektionen.map((l) => l.tag);
    assert.deepEqual(
      tage,
      Array.from({ length: lektionen.length }, (_, i) => i + 1),
    );
  });

  test("kein Tag ist doppelt vergeben", () => {
    assert.equal(new Set(lektionen.map((l) => l.tag)).size, lektionen.length);
  });

  test("jede Lektion hat Titel, Säule und Dauer", () => {
    for (const l of lektionen) {
      assert.ok(l.titel.trim().length > 0, `Tag ${l.tag} ohne Titel`);
      assert.ok(
        ["Der Spiegel", "Das Ritual", "Die Stille"].includes(l.saeule),
        `Tag ${l.tag} hat eine unbekannte Säule: ${l.saeule}`,
      );
      assert.ok(l.dauer > 0, `Tag ${l.tag} ohne Dauer`);
    }
  });

  test("genau die ersten Tage sind kostenlos", () => {
    const frei = lektionen.filter((l) => l.kostenlos).map((l) => l.tag);
    assert.deepEqual(
      frei,
      Array.from({ length: PRODUKT.kostenloseTage }, (_, i) => i + 1),
    );
  });

  test("kein Entwurf ist als kostenlos ausgewiesen", () => {
    // Sonst stünde ein Platzhalter als Kostprobe auf der Verkaufsseite.
    for (const l of lektionen.filter((l) => l.entwurf)) {
      assert.equal(l.kostenlos, false, `Tag ${l.tag} ist Entwurf und kostenlos`);
    }
  });

  test("jede kostenpflichtige Lektion hat einen Anrisstext für die Schranke", () => {
    for (const l of lektionen.filter((l) => !l.kostenlos)) {
      assert.ok(l.vorschau.trim().length > 0, `Tag ${l.tag} ohne Vorschau`);
    }
  });

  test("lektionFuerTag findet und findet nicht", () => {
    assert.equal(lektionFuerTag(1)?.tag, 1);
    assert.equal(lektionFuerTag(999), undefined);
    assert.equal(lektionFuerTag(0), undefined);
  });

  test("jede Lektion hat Substanz, nicht nur eine Überschrift", () => {
    // Verhindert, dass eine angefangene Lektion unbemerkt ausgeliefert wird.
    for (const l of lektionen) {
      const woerter = l.quelle.split(/\s+/).filter(Boolean).length;
      assert.ok(woerter >= 120, `Tag ${l.tag} hat nur ${woerter} Wörter`);
    }
  });

  test("jede Lektion hat Übung und Abschlussfrage", () => {
    for (const l of lektionen) {
      assert.match(l.quelle, /^## Die Übung$/m, `Tag ${l.tag} ohne Übung`);
      assert.match(l.quelle, /^## Die Frage für heute$/m, `Tag ${l.tag} ohne Abschlussfrage`);
    }
  });

  test("keine Lektion ist mehr als Entwurf ausgewiesen", () => {
    const entwuerfe = lektionen.filter((l) => l.entwurf).map((l) => l.tag);
    assert.deepEqual(entwuerfe, [], `noch Entwurf: Tag ${entwuerfe.join(", ")}`);
  });

  test("Markdown wird zu HTML", () => {
    const html = alsHtml("## Titel\n\nEin Satz mit **Fettung**.");
    assert.match(html, /<h2/);
    assert.match(html, /<strong>Fettung<\/strong>/);
  });
});
