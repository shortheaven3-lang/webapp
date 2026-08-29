import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { starteServer } from "./hilfe-server.mjs";

/**
 * Prüft den Geldpfad da, wo er zählt: über HTTP gegen einen laufenden Server.
 * Die Bezahlschranke muss auch dann halten, wenn niemand einen Browser benutzt.
 *
 * Voraussetzung: `npm run build` ist gelaufen.
 */

const PORT = 3111;
const GEHEIM = crypto.randomBytes(32).toString("hex");

// Ein Satz aus einer kostenpflichtigen Lektion. Taucht er im Ausgeliefertem
// auf, ist der bezahlte Text nach draussen gelangt.
const GEHEIMER_SATZ = "was ich nicht entscheiden will";
const FREIER_SATZ = "Die Übung";

let server;

function cookieFuer(kaufId, gueltigAb = Date.now()) {
  const bis = gueltigAb + 365 * 24 * 60 * 60 * 1000;
  const nutzlast = `${kaufId}.${bis}`;
  const sig = crypto.createHmac("sha256", GEHEIM).update(nutzlast).digest("base64url");
  return `${nutzlast}.${sig}`;
}

async function hole(pfad, optionen = {}) {
  const antwort = await fetch(`${server.basis}${pfad}`, { redirect: "manual", ...optionen });
  return { status: antwort.status, text: await antwort.text(), kopf: antwort.headers };
}

before(async () => {
  server = await starteServer(PORT, {
    ZUGANG_GEHEIMNIS: GEHEIM,
    STRIPE_SECRET_KEY: "sk_test_platzhalter_ohne_funktion",
    // Ohne diese Ausnahme sperrt die Kasse, weil die Anbieterangaben in
    // lib/anbieter.ts noch Platzhalter sind. Dass die Sperre greift, prueft
    // tests/impressumsperre.test.mjs.
    VERKAUF_TROTZ_LUECKEN: "1",
  });
});

after(async () => server?.beenden());

describe("Bezahlschranke", () => {
  test("eine freie Lektion wird ausgeliefert", async () => {
    const { status, text } = await hole("/programm/1");
    assert.equal(status, 200);
    assert.ok(text.includes(FREIER_SATZ));
  });

  test("eine bezahlte Lektion gibt ihren Text nicht heraus", async () => {
    const { status, text } = await hole("/programm/5");
    assert.equal(status, 200);
    assert.ok(!text.includes(GEHEIMER_SATZ), "Der bezahlte Text steht in der Antwort.");
  });

  test("mit gültigem Cookie wird sie ausgeliefert", async () => {
    const { text } = await hole("/programm/5", {
      headers: { Cookie: `zugang=${cookieFuer("cs_test_echt")}` },
    });
    assert.ok(text.includes(GEHEIMER_SATZ));
  });

  test("ein erfundener Cookie öffnet nichts", async () => {
    const { text } = await hole("/programm/5", {
      headers: { Cookie: `zugang=cs_frei.99999999999999.erfunden` },
    });
    assert.ok(!text.includes(GEHEIMER_SATZ));
  });

  test("ein abgelaufener, korrekt signierter Cookie öffnet nichts", async () => {
    const abgelaufen = cookieFuer("cs_test_alt", Date.now() - 400 * 24 * 60 * 60 * 1000);
    const { text } = await hole("/programm/5", {
      headers: { Cookie: `zugang=${abgelaufen}` },
    });
    assert.ok(!text.includes(GEHEIMER_SATZ));
  });

  test("die Übersicht sperrt ohne Zugang und öffnet mit", async () => {
    const ohne = await hole("/programm");
    assert.ok(ohne.text.includes('class="gesperrt"'));

    const mit = await hole("/programm", {
      headers: { Cookie: `zugang=${cookieFuer("cs_test_echt")}` },
    });
    assert.ok(!mit.text.includes('class="gesperrt"'));
  });
});

describe("Zustimmung vor der Kasse", () => {
  const kasse = (koerper) =>
    hole("/api/kasse", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: koerper === undefined ? undefined : JSON.stringify(koerper),
    });

  test("ohne Zustimmung öffnet die Kasse nicht", async () => {
    for (const koerper of [undefined, {}, { zustimmung: false }, { zustimmung: "ja" }, { zustimmung: 1 }]) {
      const { status } = await kasse(koerper);
      assert.equal(status, 400, `durchgelassen: ${JSON.stringify(koerper)}`);
    }
  });

  test("mit Zustimmung geht es bis zu Stripe weiter", async () => {
    // Der Platzhalterschlüssel lässt Stripe scheitern — 502 belegt, dass die
    // Anfrage die Zustimmungsprüfung passiert hat und tatsächlich rausging.
    const { status } = await kasse({ zustimmung: true });
    assert.equal(status, 502);
  });

  test("der Zustimmungstext steht sichtbar auf der Seite", async () => {
    const { text } = await hole("/");
    assert.ok(text.includes("Widerrufsrecht damit erlischt"));
  });
});

describe("Rücksprung aus der Kasse", () => {
  test("eine erfundene Sitzungskennung schaltet nichts frei", async () => {
    const { status, kopf } = await hole("/api/kasse/abschluss?sitzung=cs_erfunden");
    assert.equal(status, 307);
    assert.ok(!(kopf.get("set-cookie") ?? "").includes("zugang="));
  });

  test("ohne Sitzungskennung schaltet nichts frei", async () => {
    const { kopf } = await hole("/api/kasse/abschluss");
    assert.ok(!(kopf.get("set-cookie") ?? "").includes("zugang="));
  });
});
