import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import http from "node:http";
import { starteServer } from "./hilfe-server.mjs";

/**
 * Prüft die Anmeldung gegen einen nachgebauten Versanddienst. So lässt sich
 * sehen, was tatsächlich hinausgeht — und dass eine Adresse bei einem Fehler
 * nicht stillschweigend verschwindet.
 */

const PORT = 3113;
const DIENST_PORT = 3114;
const TOKEN = "tok_pruefung";

let server;
let dienst;
let empfangen = [];
let antwortStatus = 201;

before(async () => {
  dienst = http.createServer((anfrage, antwort) => {
    let koerper = "";
    anfrage.on("data", (teil) => (koerper += teil));
    anfrage.on("end", () => {
      empfangen.push({
        pfad: anfrage.url,
        methode: anfrage.method,
        autorisierung: anfrage.headers.authorization,
        daten: koerper ? JSON.parse(koerper) : null,
      });
      antwort.writeHead(antwortStatus, { "content-type": "application/json" });
      antwort.end(JSON.stringify({ data: { id: "1" } }));
    });
  });
  await new Promise((r) => dienst.listen(DIENST_PORT, r));

  server = await starteServer(PORT, {
    ZUGANG_GEHEIMNIS: crypto.randomBytes(32).toString("hex"),
    ANMELDUNG_ZIEL: "mailerlite",
    MAILERLITE_TOKEN: TOKEN,
    MAILERLITE_GRUPPE: "12345",
    MAILERLITE_BASIS: `http://localhost:${DIENST_PORT}`,
  });
});

after(async () => {
  await server?.beenden();
  await new Promise((r) => dienst?.close(r));
});

async function anmelden(koerper) {
  const antwort = await fetch(`${server.basis}/api/anmeldung`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(koerper),
  });
  return { status: antwort.status, daten: await antwort.json() };
}

describe("Anmeldung", () => {
  test("eine gültige Adresse wird an den Dienst übergeben", async () => {
    empfangen = [];
    antwortStatus = 201;

    const { status } = await anmelden({ email: "Du@Beispiel.AT", quelle: "startseite" });
    assert.equal(status, 200);
    assert.equal(empfangen.length, 1);

    const [anfrage] = empfangen;
    assert.equal(anfrage.methode, "POST");
    assert.equal(anfrage.pfad, "/api/subscribers");
    assert.equal(anfrage.autorisierung, `Bearer ${TOKEN}`);
    // Kleingeschrieben und ohne Leerzeichen — sonst liegen dieselben Adressen
    // beim Dienst mehrfach.
    assert.equal(anfrage.daten.email, "du@beispiel.at");
    assert.deepEqual(anfrage.daten.groups, ["12345"]);
    assert.equal(anfrage.daten.fields.quelle, "startseite");
  });

  test("eine unbrauchbare Adresse erreicht den Dienst gar nicht", async () => {
    empfangen = [];
    const { status } = await anmelden({ email: "keine-adresse", quelle: "startseite" });
    assert.equal(status, 400);
    assert.equal(empfangen.length, 0);
  });

  test("eine vom Dienst abgelehnte Adresse gibt 400 zurück", async () => {
    empfangen = [];
    antwortStatus = 422;
    const { status } = await anmelden({ email: "du@beispiel.at", quelle: "startseite" });
    assert.equal(status, 400);
  });

  test("ein Ausfall des Dienstes wird als Fehler gemeldet, nicht als Erfolg", async () => {
    empfangen = [];
    antwortStatus = 500;
    const { status } = await anmelden({ email: "du@beispiel.at", quelle: "startseite" });
    assert.equal(status, 500);
  });

  test("ohne Feldangaben wird nichts geschickt", async () => {
    empfangen = [];
    antwortStatus = 201;
    const { status } = await anmelden({});
    assert.equal(status, 400);
    assert.equal(empfangen.length, 0);
  });
});
