import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import http from "node:http";
import { starteServer } from "./hilfe-server.mjs";

/**
 * Der Selbsttest ist der erste Kontakt für die meisten Besucher. Wenn er
 * bricht, merkt es niemand — es kommen nur keine Anmeldungen mehr.
 */

const PORT = 3115;
const DIENST_PORT = 3116;

let server;
let dienst;
let empfangen = [];

before(async () => {
  dienst = http.createServer((anfrage, antwort) => {
    let koerper = "";
    anfrage.on("data", (teil) => (koerper += teil));
    anfrage.on("end", () => {
      empfangen.push(koerper ? JSON.parse(koerper) : null);
      antwort.writeHead(201, { "content-type": "application/json" });
      antwort.end(JSON.stringify({ data: { id: "1" } }));
    });
  });
  await new Promise((r) => dienst.listen(DIENST_PORT, r));

  server = await starteServer(PORT, {
    ZUGANG_GEHEIMNIS: crypto.randomBytes(32).toString("hex"),
    ANMELDUNG_ZIEL: "mailerlite",
    MAILERLITE_TOKEN: "tok_pruefung",
    MAILERLITE_BASIS: `http://localhost:${DIENST_PORT}`,
  });
});

after(async () => {
  await server?.beenden();
  await new Promise((r) => dienst?.close(r));
});

const BEREICHE = ["sehen", "grenzen", "handeln", "loslassen"];

describe("Selbsttest im Browser", () => {
  test("die Testseite wird ausgeliefert", async () => {
    const antwort = await fetch(`${server.basis}/test`);
    assert.equal(antwort.status, 200);
    const text = await antwort.text();
    assert.ok(text.includes("Wo verlässt du dich selbst"));
    // Die erste Aussage muss im ausgelieferten HTML stehen, sonst hängt der
    // Test an JavaScript, das vielleicht nie ankommt.
    assert.ok(text.includes("Zwölf Aussagen"));
  });

  test("jede Ergebnisseite antwortet und nennt ihren Kernsatz", async () => {
    for (const bereich of BEREICHE) {
      const antwort = await fetch(`${server.basis}/test/${bereich}`);
      assert.equal(antwort.status, 200, `${bereich} antwortet ${antwort.status}`);
      const text = await antwort.text();
      assert.ok(text.includes("Dein Ergebnis"), `${bereich}: keine Ergebnisüberschrift`);
      assert.ok(text.includes("Die ersten drei Tage"), `${bereich}: keine Anmeldung`);
    }
  });

  test("ein erfundener Bereich führt zu 404 statt zu einer leeren Seite", async () => {
    const antwort = await fetch(`${server.basis}/test/erfunden`);
    assert.equal(antwort.status, 404);
  });

  test("der Hinweis bei niedrigem Ergebnis erscheint nur bei niedrigem Ergebnis", async () => {
    const mit = await (await fetch(`${server.basis}/test/sehen?niveau=niedrig`)).text();
    const ohne = await (await fetch(`${server.basis}/test/sehen?niveau=hoch`)).text();

    assert.ok(mit.includes("brauchst du dieses Programm gerade nicht"));
    assert.ok(!ohne.includes("brauchst du dieses Programm gerade nicht"));
  });

  test("ein unsinniges Niveau kippt die Seite nicht", async () => {
    const antwort = await fetch(`${server.basis}/test/sehen?niveau=<script>`);
    assert.equal(antwort.status, 200);
  });

  test("die Anmeldung vom Ergebnis trägt den Bereich mit", async () => {
    // Damit sich später sagen lässt, welches Ergebnis welche Anmeldung bringt.
    empfangen = [];
    const antwort = await fetch(`${server.basis}/api/anmeldung`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "du@beispiel.at", quelle: "selbsttest-grenzen" }),
    });

    assert.equal(antwort.status, 200);
    assert.equal(empfangen.length, 1);
    assert.equal(empfangen[0].fields.quelle, "selbsttest-grenzen");
  });

  test("die Ergebnisse stehen in der Sitemap", async () => {
    const sitemap = await (await fetch(`${server.basis}/sitemap.xml`)).text();
    assert.ok(sitemap.includes("/test</loc>"));
    for (const bereich of BEREICHE) {
      assert.ok(sitemap.includes(`/test/${bereich}</loc>`), `${bereich} fehlt in der Sitemap`);
    }
  });

  test("jedes Ergebnis hat ein eigenes Vorschaubild", async () => {
    for (const bereich of BEREICHE) {
      const antwort = await fetch(`${server.basis}/test/${bereich}/opengraph-image`);
      assert.equal(antwort.status, 200, `${bereich}: ${antwort.status}`);
      assert.equal(antwort.headers.get("content-type"), "image/png");
    }
  });

  test("die Startseite führt zum Test", async () => {
    const text = await (await fetch(server.basis)).text();
    assert.ok(text.includes('href="/test"'));
  });
});
