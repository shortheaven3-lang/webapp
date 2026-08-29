# Entscheidungen

Kurze Notizen darueber, *warum* etwas so gebaut ist — nicht *was* gebaut ist.
Das "Was" steht im Code, das "Warum" geht sonst verloren.

Ein Eintrag je Entscheidung, neueste oben.

## 2026-08-29 — Zugang im signierten Cookie statt in einer Datenbank

* **Lage:** Das Programm ist ein Einmalkauf. Eine Datenbank haette Betrieb, Kosten und
  Datenschutzpflichten mitgebracht, bevor der erste Euro geflossen ist.
* **Wahl:** Nach bestaetigter Zahlung wird ein HMAC-signierter Cookie gesetzt, der die
  Kassenkennung und ein Ablaufdatum traegt. Geprueft wird serverseitig.
* **Verworfen:** Nutzerkonten mit Passwort (zu viel Aufwand fuer ein Einmalprodukt),
  Magic-Link (braucht doch eine Datenhaltung und E-Mail-Versand).
* **Preis:** Der Zugang haengt am Browser. Geraetewechsel bedeutet Aussperrung. Sobald es
  die ersten Beschwerden gibt, ist der Magic-Link der naechste Schritt.

## 2026-08-29 — Kostenloser Einstieg vor der Bezahlschranke

* **Lage:** Reichweite unter 1.000 Followern. Eine reine Kaufabwicklung haette rechnerisch
  eine Handvoll Verkaeufe gebracht.
* **Wahl:** Die ersten drei Tage sind frei und sammeln E-Mail-Adressen. Der Bezahlteil ist
  fertig verdrahtet und wird scharf, sobald die Reichweite ihn traegt.
* **Verworfen:** Sofortige Bezahlschranke ab Tag 1 (verschenkt bei dieser Groesse die
  einzige Chance, eine Liste aufzubauen).

## 2026-08-29 — Einmalkauf statt Abo

* **Lage:** Wiederkehrende Einnahmen waeren attraktiver.
* **Wahl:** Einmalig 39 Euro fuer alle 30 Tage.
* **Verworfen:** Abo. Ein durchgearbeitetes Programm haelt niemanden; die Abwanderung
  waere hoch und der Aufwand fuer staendigen Nachschub dauerhaft.

## 2026-08-29 — Next.js, Inhalte als Markdown im Repository

* **Lage:** Es braucht serverseitige Pruefung des Zugangs, sonst laege der bezahlte Text
  im Quelltext offen.
* **Wahl:** Next.js App Router. Gesperrte Lektionen werden serverseitig gar nicht erst
  gerendert. Inhalte als Markdown-Dateien, versioniert wie Code.
* **Verworfen:** Reines Frontend (kann Inhalte nicht verbergen), CMS (Betrieb und Kosten
  ohne Gegenwert bei 30 Texten).
