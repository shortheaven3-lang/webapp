import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  baueZugangsWert,
  geheimnisIstBrauchbar,
  pruefeZugangsWert,
} from "../lib/zugang-kern.ts";

const GEHEIM = "a".repeat(64);
const ANDERES = "b".repeat(64);

describe("Zugangs-Cookie", () => {
  test("ein frisch gebauter Wert wird angenommen", () => {
    const wert = baueZugangsWert("cs_test_123", GEHEIM);
    assert.equal(pruefeZugangsWert(wert, GEHEIM), true);
  });

  test("veränderte Nutzlast bei behaltener Unterschrift fliegt auf", () => {
    const wert = baueZugangsWert("cs_test_123", GEHEIM);
    const [, bis, unterschrift] = wert.split(".");
    assert.equal(pruefeZugangsWert(`cs_gefaelscht.${bis}.${unterschrift}`, GEHEIM), false);
  });

  test("verlängertes Ablaufdatum fliegt auf", () => {
    const wert = baueZugangsWert("cs_test_123", GEHEIM);
    const [kauf, bis, unterschrift] = wert.split(".");
    const spaeter = String(Number(bis) + 1000);
    assert.equal(pruefeZugangsWert(`${kauf}.${spaeter}.${unterschrift}`, GEHEIM), false);
  });

  test("veränderte Unterschrift fliegt auf", () => {
    const wert = baueZugangsWert("cs_test_123", GEHEIM);
    const [kauf, bis] = wert.split(".");
    assert.equal(pruefeZugangsWert(`${kauf}.${bis}.xxxxx`, GEHEIM), false);
  });

  test("ein anderes Geheimnis öffnet nicht", () => {
    const wert = baueZugangsWert("cs_test_123", GEHEIM);
    assert.equal(pruefeZugangsWert(wert, ANDERES), false);
  });

  test("abgelaufen wird abgewiesen, auch korrekt signiert", () => {
    const vorEinemJahr = Date.now() - 400 * 24 * 60 * 60 * 1000;
    const wert = baueZugangsWert("cs_test_123", GEHEIM, vorEinemJahr);
    assert.equal(pruefeZugangsWert(wert, GEHEIM), false);
  });

  test("kurz vor Ablauf gilt der Zugang noch", () => {
    const fastAbgelaufen = Date.now() - 364 * 24 * 60 * 60 * 1000;
    const wert = baueZugangsWert("cs_test_123", GEHEIM, fastAbgelaufen);
    assert.equal(pruefeZugangsWert(wert, GEHEIM), true);
  });

  test("Müll in jeder Form wird abgewiesen", () => {
    for (const wert of ["", "abc", "a.b", "a.b.c.d", "...", "a..c"]) {
      assert.equal(pruefeZugangsWert(wert, GEHEIM), false, `angenommen: ${JSON.stringify(wert)}`);
    }
    assert.equal(pruefeZugangsWert(undefined, GEHEIM), false);
  });

  test("ohne Geheimnis wird nichts angenommen — auch kein gültiger Wert", () => {
    const wert = baueZugangsWert("cs_test_123", GEHEIM);
    assert.equal(pruefeZugangsWert(wert, undefined), false);
    assert.equal(pruefeZugangsWert(wert, ""), false);
    assert.equal(pruefeZugangsWert(wert, "zu-kurz"), false);
  });

  test("zu kurzes Geheimnis wird beim Bauen abgelehnt", () => {
    assert.throws(() => baueZugangsWert("cs_test_123", "kurz"));
  });

  test("eine Kaufkennung mit Punkt wird abgelehnt, statt still zu zerbrechen", () => {
    assert.throws(() => baueZugangsWert("cs.mit.punkt", GEHEIM));
  });

  test("geheimnisIstBrauchbar zieht die Grenze bei 32 Zeichen", () => {
    assert.equal(geheimnisIstBrauchbar("x".repeat(31)), false);
    assert.equal(geheimnisIstBrauchbar("x".repeat(32)), true);
    assert.equal(geheimnisIstBrauchbar(undefined), false);
  });
});
