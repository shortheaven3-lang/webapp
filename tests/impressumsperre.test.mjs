import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { starteServer } from "./hilfe-server.mjs";

/**
 * Ohne vollständiges Impressum darf nicht verkauft werden. Dieser Test läuft
 * bewusst ohne VERKAUF_TROTZ_LUECKEN und prüft, dass die Kasse dann zu bleibt.
 *
 * Sind die Anbieterangaben in lib/anbieter.ts einmal ausgefüllt, greift die
 * Sperre nicht mehr — dann prüft dieser Test, dass die Kasse wieder aufgeht.
 */

const PORT = 3112;
let server;
let vollstaendig;

before(async () => {
  const { anbieterIstVollstaendig } = await import("../lib/anbieter.ts");
  vollstaendig = anbieterIstVollstaendig();

  server = await starteServer(PORT, {
    ZUGANG_GEHEIMNIS: crypto.randomBytes(32).toString("hex"),
    STRIPE_SECRET_KEY: "sk_test_platzhalter_ohne_funktion",
  });
});

after(async () => server?.beenden());

describe("Verkaufssperre bei unvollständigem Impressum", () => {
  test("die Kasse bleibt zu, solange Anbieterangaben fehlen", async () => {
    const antwort = await fetch(`${server.basis}/api/kasse`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ zustimmung: true }),
    });

    if (vollstaendig) {
      // Angaben sind gefüllt: die Sperre darf nicht mehr greifen. 502 heisst,
      // die Anfrage ging bis zu Stripe und scheiterte erst am Platzhalterschlüssel.
      assert.equal(antwort.status, 502);
    } else {
      assert.equal(antwort.status, 503);
    }
  });

  test("die Rechtsseiten sind trotzdem erreichbar", async () => {
    for (const pfad of ["/impressum", "/agb", "/datenschutz"]) {
      const antwort = await fetch(`${server.basis}${pfad}`);
      assert.equal(antwort.status, 200, `${pfad} antwortet ${antwort.status}`);
    }
  });
});
