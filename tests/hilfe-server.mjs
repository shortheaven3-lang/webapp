import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/**
 * Startet einen echten Produktionsserver für die Dauer eines Tests.
 *
 * Zwei Dinge, die hier wichtig sind und beide schon einmal falsch waren:
 * Der Server läuft in einer eigenen Prozessgruppe, damit er sich vollständig
 * beenden lässt — sonst überlebt er den Test. Und es wird abgebrochen, wenn
 * auf dem Port schon etwas antwortet, sonst prüft der Lauf gegen einen alten
 * Stand und meldet grün, obwohl der neue Code kaputt ist.
 */

/**
 * Prueft, ob der Produktionsbau juenger ist als der Quelltext. Ohne diese
 * Pruefung testet ein direkt gestarteter Testlauf gegen einen alten Bau und
 * meldet Fehler, die es nicht gibt — oder schlimmer, meldet gruen fuer Code,
 * der nie gebaut wurde.
 */
function pruefeBauIstAktuell() {
  const kennung = path.join(process.cwd(), ".next", "BUILD_ID");
  if (!fs.existsSync(kennung)) {
    throw new Error("Kein Produktionsbau vorhanden. Erst `npm run build` ausfuehren.");
  }

  const gebautAm = fs.statSync(kennung).mtimeMs;
  let neuester = 0;
  let neuesteDatei = "";

  const durchsuche = (ordner) => {
    if (!fs.existsSync(ordner)) return;
    for (const eintrag of fs.readdirSync(ordner, { withFileTypes: true })) {
      const voll = path.join(ordner, eintrag.name);
      if (eintrag.isDirectory()) {
        durchsuche(voll);
      } else {
        const zeit = fs.statSync(voll).mtimeMs;
        if (zeit > neuester) {
          neuester = zeit;
          neuesteDatei = path.relative(process.cwd(), voll);
        }
      }
    }
  };

  for (const ordner of ["app", "lib", "components", "content"]) {
    durchsuche(path.join(process.cwd(), ordner));
  }

  if (neuester > gebautAm) {
    throw new Error(
      `Der Produktionsbau ist aelter als ${neuesteDatei}. ` +
        "Dieser Lauf wuerde gegen einen alten Stand pruefen. " +
        "Nutze `npm run test:pfad`, das baut vorher.",
    );
  }
}

export async function starteServer(port, zusatzUmgebung = {}) {
  pruefeBauIstAktuell();

  const basis = `http://localhost:${port}`;

  let belegt = false;
  try {
    await fetch(basis);
    belegt = true;
  } catch {
    // gut — der Port ist frei
  }
  if (belegt) {
    throw new Error(
      `Auf Port ${port} antwortet bereits etwas. Beenden und erneut starten — ` +
        "sonst prüft dieser Lauf gegen einen alten Stand.",
    );
  }

  const prozess = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "-p", String(port)],
    {
      env: { ...process.env, NODE_ENV: "production", ...zusatzUmgebung },
      stdio: "ignore",
      detached: true,
    },
  );

  for (let i = 0; i < 60; i++) {
    try {
      await fetch(basis);
      return {
        basis,
        async beenden() {
          if (!prozess.pid) return;
          try {
            process.kill(-prozess.pid, "SIGKILL");
          } catch {
            prozess.kill("SIGKILL");
          }
          for (let n = 0; n < 20; n++) {
            try {
              await fetch(basis);
              await new Promise((r) => setTimeout(r, 250));
            } catch {
              return;
            }
          }
        },
      };
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  throw new Error(`Server auf Port ${port} ist nicht hochgekommen.`);
}
