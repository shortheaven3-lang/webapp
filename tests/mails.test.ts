import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ORDNER = path.join(process.cwd(), "content", "mails");
const ERLAUBTE_PLATZHALTER = ["TAG_1", "TAG_2", "TAG_3", "KAUFEN", "PROGRAMM"];

const mails = fs
  .readdirSync(ORDNER)
  .filter((d) => d.endsWith(".md"))
  .map((datei) => {
    const { data, content } = matter(fs.readFileSync(path.join(ORDNER, datei), "utf8"));
    return { datei, data, content };
  });

describe("Mails der Willkommensstrecke", () => {
  test("es gibt Mails", () => {
    assert.ok(mails.length > 0);
  });

  test("jede Mail hat Betreff und Versandtag", () => {
    for (const { datei, data } of mails) {
      assert.ok(
        typeof data.betreff === "string" && data.betreff.trim().length > 0,
        `${datei}: Betreff fehlt`,
      );
      assert.ok(Number.isInteger(data.versandtag), `${datei}: Versandtag fehlt`);
      assert.ok(data.versandtag >= 0, `${datei}: Versandtag ist negativ`);
    }
  });

  test("kein Versandtag ist doppelt belegt", () => {
    const tage = mails.map((m) => m.data.versandtag);
    assert.equal(new Set(tage).size, tage.length, "zwei Mails am selben Tag");
  });

  test("alle Platzhalter sind bekannt", () => {
    // Ein Tippfehler im Platzhalter würde sonst als toter Link verschickt.
    for (const { datei, content } of mails) {
      for (const treffer of content.matchAll(/\{\{(\w+)\}\}/g)) {
        assert.ok(
          ERLAUBTE_PLATZHALTER.includes(treffer[1]),
          `${datei}: unbekannter Platzhalter {{${treffer[1]}}}`,
        );
      }
    }
  });

  test("keine Mail enthält eine fest eingetragene Adresse", () => {
    // Adressen gehören durch Platzhalter ersetzt, sonst zeigen sie nach dem
    // Domainwechsel ins Leere.
    for (const { datei, content } of mails) {
      assert.ok(!/https?:\/\/(localhost|beispiel\.)/i.test(content), `${datei}: feste Adresse`);
    }
  });

  test("jede Mail führt irgendwohin", () => {
    for (const { datei, content } of mails) {
      assert.match(content, /\{\{\w+\}\}/, `${datei}: kein einziger Link`);
    }
  });
});
