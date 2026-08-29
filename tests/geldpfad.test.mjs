import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { spawn } from "node:child_process";

/**
 * Prüft den Geldpfad da, wo er zählt: über HTTP gegen einen laufenden Server.
 * Die Bezahlschranke muss auch dann halten, wenn niemand einen Browser benutzt.
 *
 * Voraussetzung: `npm run build` ist gelaufen.
 */

const PORT = 3111;
const BASIS = `http://localhost:${PORT}`;
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
  const antwort = await fetch(`${BASIS}${pfad}`, { redirect: "manual", ...optionen });
  return { status: antwort.status, text: await antwort.text(), kopf: antwort.headers };
}

before(async () => {
  // Erst sicherstellen, dass hier nichts Altes lauscht. Sonst wuerde gegen
  // einen Server von vorhin geprueft und jede Regression bliebe unsichtbar.
  try {
    await fetch(BASIS);
    throw new Error(
      `Auf Port ${PORT} antwortet bereits etwas. Beenden und erneut starten — ` +
        "sonst prueft dieser Lauf gegen einen alten Stand.",
    );
  } catch (fehler) {
    if (fehler instanceof Error && fehler.message.startsWith("Auf Port")) throw fehler;
  }

  // Eigene Prozessgruppe, damit spaeter der ganze Baum beendet werden kann.
  // Ein kill auf die Huelle allein laesst den Server weiterlaufen.
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(PORT)], {
    env: {
      ...process.env,
      ZUGANG_GEHEIMNIS: GEHEIM,
      STRIPE_SECRET_KEY: "sk_test_platzhalter_ohne_funktion",
      NODE_ENV: "production",
    },
    stdio: "ignore",
    detached: true,
  });

  for (let i = 0; i < 60; i++) {
    try {
      await fetch(BASIS);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error("Server ist nicht hochgekommen.");
});

after(async () => {
  if (!server?.pid) return;
  try {
    process.kill(-server.pid, "SIGKILL");
  } catch {
    server.kill("SIGKILL");
  }
  // Warten, bis der Port wirklich frei ist — sonst scheitert der naechste Lauf
  // an der Belegtpruefung oben.
  for (let i = 0; i < 20; i++) {
    try {
      await fetch(BASIS);
      await new Promise((r) => setTimeout(r, 250));
    } catch {
      return;
    }
  }
});

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
