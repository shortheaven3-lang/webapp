import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { anbieterIstVollstaendig, fehlendeAngaben } from "../lib/anbieter.ts";

describe("Anbieterangaben", () => {
  test("meldet die noch offenen Pflichtfelder", () => {
    const fehlt = fehlendeAngaben();
    // Solange Platzhalter drinstehen, muss das auffallen. Sind die Angaben
    // ausgefüllt, ist die Liste leer — beides ist ein gültiger Zustand.
    for (const feld of fehlt) {
      assert.ok(["name", "strasse", "ort", "email"].includes(feld));
    }
    assert.equal(anbieterIstVollstaendig(), fehlt.length === 0);
  });
});
