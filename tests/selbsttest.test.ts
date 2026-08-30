import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { AUSSAGEN, BEREICHE, ERGEBNISSE, istBereich } from "../content/selbsttest.ts";
import { auswerten, HOECHSTE_GESAMTSUMME } from "../lib/selbsttest.ts";

/** Alle Aussagen eines Bereichs mit der höchsten Stufe beantworten. */
function nurBereich(bereich: string, wert = 2) {
  return Object.fromEntries(
    AUSSAGEN.filter((a) => a.bereich === bereich).map((a) => [a.id, wert]),
  );
}

describe("Selbsttest — Inhalt", () => {
  test("jeder Bereich hat gleich viele Aussagen", () => {
    const anzahl = BEREICHE.map((b) => AUSSAGEN.filter((a) => a.bereich === b).length);
    // Sonst gewinnt der Bereich mit den meisten Aussagen unabhängig von den Antworten.
    assert.equal(new Set(anzahl).size, 1, `ungleich verteilt: ${anzahl.join(", ")}`);
  });

  test("keine Kennung ist doppelt vergeben", () => {
    const ids = AUSSAGEN.map((a) => a.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  test("jede Aussage hat einen Text und einen bekannten Bereich", () => {
    for (const a of AUSSAGEN) {
      assert.ok(a.text.trim().length > 10, `${a.id}: Text zu kurz`);
      assert.ok(istBereich(a.bereich), `${a.id}: unbekannter Bereich`);
    }
  });

  test("zu jedem Bereich gibt es ein vollständiges Ergebnis", () => {
    for (const b of BEREICHE) {
      const e = ERGEBNISSE[b];
      assert.ok(e, `${b}: kein Ergebnis`);
      assert.ok(e.titel.trim().length > 0, `${b}: kein Titel`);
      assert.ok(e.kern.trim().length > 0, `${b}: kein Kernsatz`);
      assert.ok(e.text.length >= 2, `${b}: Text zu dünn`);
      assert.ok(e.tage.length > 0, `${b}: keine Tage genannt`);
    }
  });

  test("die genannten Tage liegen im Programm", () => {
    for (const b of BEREICHE) {
      for (const tag of ERGEBNISSE[b].tage) {
        assert.ok(tag >= 1 && tag <= 30, `${b}: Tag ${tag} gibt es nicht`);
      }
    }
  });
});

describe("Selbsttest — Auswertung", () => {
  test("wer nur in einem Bereich zustimmt, bekommt diesen Bereich", () => {
    for (const b of BEREICHE) {
      assert.equal(auswerten(nurBereich(b)).bereich, b);
    }
  });

  test("nicht beantwortete Aussagen zählen als null statt zu scheitern", () => {
    const ergebnis = auswerten({ [AUSSAGEN[0].id]: 2 });
    assert.equal(ergebnis.bereich, AUSSAGEN[0].bereich);
    assert.equal(ergebnis.gesamt, 2);
  });

  test("gar keine Antworten ergeben trotzdem ein Ergebnis", () => {
    const ergebnis = auswerten({});
    assert.ok(BEREICHE.includes(ergebnis.bereich));
    assert.equal(ergebnis.gesamt, 0);
    assert.equal(ergebnis.niveau, "niedrig");
    assert.equal(ergebnis.gleichstand, true);
  });

  test("bei Gleichstand gewinnt der Bereich, der im Programm zuerst kommt", () => {
    const antworten = { ...nurBereich("handeln"), ...nurBereich("grenzen") };
    const ergebnis = auswerten(antworten);
    assert.equal(ergebnis.bereich, "grenzen");
    assert.equal(ergebnis.gleichstand, true);
  });

  test("unsinnige Werte werden begrenzt statt übernommen", () => {
    const ergebnis = auswerten({
      [AUSSAGEN[0].id]: 999,
      [AUSSAGEN[1].id]: -5,
      [AUSSAGEN[2].id]: Number.NaN,
    });
    assert.ok(ergebnis.gesamt <= HOECHSTE_GESAMTSUMME);
    assert.equal(ergebnis.summen[AUSSAGEN[0].bereich], 2);
    assert.equal(ergebnis.summen[AUSSAGEN[1].bereich], 0);
  });

  test("das Niveau folgt der Gesamtsumme", () => {
    const alles = Object.fromEntries(AUSSAGEN.map((a) => [a.id, 2]));
    assert.equal(auswerten(alles).niveau, "hoch");
    assert.equal(auswerten({}).niveau, "niedrig");

    const haelfte = Object.fromEntries(AUSSAGEN.map((a) => [a.id, 1]));
    assert.equal(auswerten(haelfte).niveau, "mittel");
  });

  test("die Summen überschreiten nie das Maximum je Bereich", () => {
    const alles = Object.fromEntries(AUSSAGEN.map((a) => [a.id, 2]));
    const ergebnis = auswerten(alles);
    for (const b of BEREICHE) {
      const moeglich = AUSSAGEN.filter((a) => a.bereich === b).length * 2;
      assert.equal(ergebnis.summen[b], moeglich);
    }
  });
});
