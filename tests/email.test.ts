import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { istEmail } from "../lib/email.ts";

describe("E-Mail-Prüfung", () => {
  test("übliche Adressen gehen durch", () => {
    for (const gut of [
      "du@beispiel.at",
      "vor.nach@beispiel.co.uk",
      "a+markierung@beispiel.de",
      "  mit.leerzeichen@beispiel.at  ",
    ]) {
      assert.equal(istEmail(gut), true, `abgewiesen: ${gut}`);
    }
  });

  test("offensichtlich Falsches wird abgewiesen", () => {
    for (const schlecht of [
      "",
      "keinklammeraffe",
      "@beispiel.at",
      "du@",
      "du@beispiel",
      "du@@beispiel.at",
      "du beispiel@x.at",
      "du@beispiel.a",
    ]) {
      assert.equal(istEmail(schlecht), false, `angenommen: ${JSON.stringify(schlecht)}`);
    }
  });

  test("absurd lange Adressen werden abgewiesen", () => {
    assert.equal(istEmail(`${"x".repeat(250)}@beispiel.at`), false);
  });
});
