import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

/**
 * Erzeugt aus content/mails/*.md fertige Mails zum Einfuegen beim
 * Versanddienst — einmal als HTML, einmal als reiner Text.
 *
 * Die Texte liegen im Repository, weil sie zum Produkt gehoeren und
 * versioniert sein sollen. Der Versand selbst laeuft beim Dienst.
 *
 *   node skripte/mails-rendern.mjs [basisadresse]
 */

const BASIS = (process.argv[2] ?? process.env.APP_URL ?? "https://DEINE-ADRESSE")
  .replace(/\/$/, "");

const QUELLE = path.join(process.cwd(), "content", "mails");
const ZIEL = path.join(process.cwd(), ".ausgabe", "mails");

const ERSETZUNGEN = {
  TAG_1: `${BASIS}/programm/1`,
  TAG_2: `${BASIS}/programm/2`,
  TAG_3: `${BASIS}/programm/3`,
  KAUFEN: `${BASIS}/#kaufen`,
  PROGRAMM: `${BASIS}/programm`,
};

function setzeAdressen(text) {
  return text.replace(/\{\{(\w+)\}\}/g, (treffer, name) => {
    if (!(name in ERSETZUNGEN)) {
      throw new Error(`Unbekannter Platzhalter: ${treffer}`);
    }
    return ERSETZUNGEN[name];
  });
}

/** Markdown zu lesbarem Fliesstext: Links werden als "Text (Adresse)" gesetzt. */
function alsText(markdown) {
  return markdown
    .replace(/\*\*(.+?)\*\*/gs, "$1")
    .replace(/\[(.+?)\]\((.+?)\)/gs, "$1: $2")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const rahmen = (inhalt) => `<!doctype html>
<html lang="de">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<body style="margin:0;background:#faf8f5;">
<div style="max-width:34rem;margin:0 auto;padding:2rem 1.25rem;font-family:Georgia,serif;font-size:17px;line-height:1.65;color:#1c1a17;">
${inhalt}
<hr style="border:none;border-top:1px solid #e6e0d8;margin:2.5rem 0 1rem;">
<p style="font-size:13px;color:#8b847c;font-family:system-ui,sans-serif;">
Du bekommst diese Mail, weil du dich auf ${BASIS} eingetragen hast.<br>
{$unsubscribe}Abmelden{/$unsubscribe} — jederzeit, ohne Rückfrage.
</p>
</div>
</body>
</html>`;

fs.rmSync(ZIEL, { recursive: true, force: true });
fs.mkdirSync(ZIEL, { recursive: true });

const dateien = fs.readdirSync(QUELLE).filter((d) => d.endsWith(".md")).sort();
const uebersicht = [];

for (const datei of dateien) {
  const roh = fs.readFileSync(path.join(QUELLE, datei), "utf8");
  const { data, content } = matter(roh);

  if (typeof data.betreff !== "string" || !data.betreff.trim()) {
    throw new Error(`${datei}: Feld "betreff" fehlt.`);
  }
  if (!Number.isInteger(data.versandtag)) {
    throw new Error(`${datei}: Feld "versandtag" fehlt oder ist keine ganze Zahl.`);
  }

  const markdown = setzeAdressen(content.trim());
  const name = datei.replace(/\.md$/, "");

  fs.writeFileSync(path.join(ZIEL, `${name}.html`), rahmen(marked.parse(markdown, { async: false })));
  fs.writeFileSync(path.join(ZIEL, `${name}.txt`), `${alsText(markdown)}\n`);

  uebersicht.push({
    datei: name,
    versandtag: data.versandtag,
    betreff: data.betreff,
    vorschautext: data.vorschautext ?? "",
  });
}

uebersicht.sort((a, b) => a.versandtag - b.versandtag);
fs.writeFileSync(path.join(ZIEL, "uebersicht.json"), `${JSON.stringify(uebersicht, null, 2)}\n`);

console.log(`Basisadresse: ${BASIS}\n`);
for (const m of uebersicht) {
  console.log(`  Tag ${String(m.versandtag).padStart(2)} — ${m.betreff}`);
  console.log(`            ${m.datei}.html / .txt`);
}
console.log(`\n${uebersicht.length} Mails in ${path.relative(process.cwd(), ZIEL)}`);
