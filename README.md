# webapp

Grundgerüst für eine App bzw. WebApp. Die Technikwahl steht bewusst noch offen —
dieses Repository hält vorerst nur die Struktur, damit der erste echte Schritt
nicht mit Aufräumarbeit beginnt.

## Stand

Noch kein Code. Was hier liegt, ist Vorbereitung:

```
src/                  hier entsteht die Anwendung
docs/entscheidungen.md  Notizen dazu, warum etwas so gebaut ist
.env.example          Vorlage für lokale Umgebungsvariablen
.editorconfig         einheitliche Einrückung und Zeilenenden
.gitignore            hält Abhängigkeiten, Build-Ergebnisse und Geheimnisse draußen
```

## Nächster Schritt

Die Technikwahl. Drei Wege, die je nach Ziel naheliegen:

* **Next.js + TypeScript** — Seiten und API-Routen in einem Projekt. Der übliche Weg,
  sobald die App Daten speichern oder Nutzer anmelden soll.
* **Vite + React + TypeScript** — reine Frontend-App, schlank und schnell im Start.
  Ein Backend käme später separat dazu.
* **Expo / React Native** — eine Codebasis für iOS, Android und Web, wenn es
  vorrangig eine Handy-App werden soll.

Sobald die Wahl feststeht, wird sie in `docs/entscheidungen.md` festgehalten und das
Gerüst darauf aufgesetzt.

## Einrichtung

Noch nichts einzurichten. Sobald ein Framework steht, kommen hier die Schritte hin:
Abhängigkeiten installieren, `.env.example` nach `.env` kopieren und ausfüllen,
Entwicklungsserver starten.

## Sichtbarkeit

Dieses Repository ist **privat**. Falls es später einmal Dateien ausliefern soll, die
von außen per URL abrufbar sein müssen, wäre dafür ein öffentliches Repository nötig —
private Repositories geben über `raw.githubusercontent.com` keine dauerhaft
abrufbaren Adressen aus.
