# 30 Tage Selbstführung

Ein bezahltes, geführtes Programm als WebApp. Eine Lektion pro Tag: ein Gedanke, eine
Übung, eine Frage. Die ersten drei Tage sind frei, der Rest wird einmalig gekauft.

## Warum es so gebaut ist

**Einmalkauf statt Abo.** Abos leben von Bindung, und Programme dieser Art werden
durchgearbeitet und dann verlassen. Ein Einmalprodukt realisiert seinen Wert beim Kauf und
muss danach niemanden halten.

**Kostenloser Einstieg vor der Kasse.** Bei kleiner Reichweite bringt eine reine
Kaufabwicklung nichts — es fehlen schlicht die Leute. Der freie Einstieg sammelt
E-Mail-Adressen. Instagram gehört einem nicht, eine E-Mail-Liste schon.

**Kein Nutzerkonto, keine Datenbank.** Der Zugang steckt in einem signierten Cookie, der
nach bestätigter Zahlung gesetzt wird. Das spart den gesamten Betrieb einer Datenhaltung.
Der Preis dafür steht unter *Grenzen*.

**Inhalte als Dateien im Repository.** Lektionen sind Markdown mit Kopfdaten. Kein CMS,
keine Datenbank, und jede Änderung am Text ist ein nachvollziehbarer Commit.

## Aufbau

```
app/                          Seiten und Schnittstellen (Next.js App Router)
  page.tsx                    Verkaufsseite
  programm/                   Übersicht und einzelne Tage
  danke/                      Rücksprung nach dem Kauf
  api/anmeldung/              E-Mail-Erfassung
  api/kasse/                  Stripe Checkout öffnen
  api/kasse/abschluss/        Zahlung prüfen, Zugang setzen
components/                   Anmeldeformular, Kaufknopf
content/lektionen/tag-NN.md   die Lektionen
lib/lektionen.ts              Laden und Parsen der Lektionen
lib/zugang.ts                 signierter Zugangs-Cookie
lib/stripe.ts                 Stripe, nur wenn Schlüssel gesetzt
lib/anmeldung.ts              Anmeldungen an den E-Mail-Dienst
lib/preis.ts                  Preis und Produktdaten an einer Stelle
```

## Lokal starten

```bash
npm install
npm run dev
```

Läuft ohne jede Konfiguration. Ohne Stripe-Schlüssel zeigt der Kaufknopf einen Hinweis
statt der Kasse; Anmeldungen landen in `.daten/anmeldungen.jsonl`.

```bash
npm run build       # Produktionsbau
npm run typecheck   # nur Typen prüfen
npm test            # Einheitentests
npm run test:pfad   # baut und prüft den Geldpfad über HTTP
npm run test:alle   # beides
```

## Was die Tests abdecken

Geprüft wird das, was Geld kostet, wenn es bricht:

* **Der Zugangs-Cookie** (`tests/zugang.test.ts`): veränderte Nutzlast, verlängertes
  Ablaufdatum, fremdes Geheimnis, abgelaufen, Müll in jeder Form.
* **Die Verkaufssperre** (`tests/impressumsperre.test.mjs`): startet einen Server ohne die
  Ausnahme und prüft, dass die Kasse bei unvollständigen Anbieterangaben zubleibt. Sobald du
  sie ausfüllst, prüft derselbe Test, dass sie wieder aufgeht.
* **Die Inhalte** (`tests/lektionen.test.ts`): lückenlose Nummerierung, gültige Säulen,
  genau die ersten Tage kostenlos, und kein Entwurf als Kostprobe auf der Verkaufsseite.
* **Der Geldpfad über HTTP** (`tests/geldpfad.test.mjs`): startet einen echten
  Produktionsserver und prüft, dass bezahlter Text ohne gültigen Cookie nirgends in der
  Antwort steht, dass die Kasse ohne Zustimmung nicht aufgeht und dass ein erfundener
  Rücksprung aus Stripe nichts freischaltet.

Der Geldpfad-Test bricht ab, wenn auf seinem Port schon etwas antwortet. Das ist Absicht:
Sonst prüft ein Lauf stillschweigend gegen einen alten Serverstand und meldet grün, obwohl
die Schranke offen steht.

## Der Selbsttest

Zwölf Aussagen, zwei Minuten, keine E-Mail-Adresse nötig. Am Ende steht, welcher der vier
Bereiche gerade der lauteste ist — und welche Tage dort ansetzen.

Warum das der wichtigste Einstieg ist: Er redet über den Besucher statt über das Produkt.
Wer sein Ergebnis gelesen hat, ist deutlich eher bereit, die drei freien Tage zu nehmen, als
jemand, der auf einer Verkaufsseite gelandet ist.

```
content/selbsttest.ts        Aussagen, Bereiche und Ergebnistexte
lib/selbsttest.ts            Auswertung, ohne Next-Bindung und damit prüfbar
components/Selbsttest.tsx    eine Aussage pro Bildschirm
app/test/                    Einstieg und die vier Ergebnisseiten
```

Drei Dinge, die dabei absichtlich so sind:

* **Jede Ergebnisseite hat eine eigene Adresse und ein eigenes Vorschaubild.** Wer sein
  Ergebnis in einer Story teilt, teilt keinen nackten Link, sondern einen Satz, auf den
  andere reagieren.
* **Die Anmeldung vom Ergebnis trägt den Bereich mit** (`quelle: selbsttest-grenzen`). Damit
  siehst du im Versanddienst, welches Ergebnis welche Anmeldungen bringt.
* **Bei durchgehend niedrigen Antworten sagt die Ergebnisseite, dass das Programm gerade
  vielleicht nicht nötig ist.** Das kostet ein paar Anmeldungen und ist trotzdem richtig: Ein
  Test, der jedem ein Problem bescheinigt, ist kein Test, sondern ein Verkaufstrichter mit
  Fragezeichen.

Der Test sortiert, er diagnostiziert nicht — das steht auch auf der Ergebnisseite.

## Die E-Mail-Strecke

Vier Mails: Willkommen mit Tag 1, dann Tag 2 und Tag 3, und einen Tag nach dem letzten
freien Tag die Einladung zum Kauf. Die Texte liegen in `content/mails/` und sind versioniert
wie alles andere.

**Den Takt gibt der Versanddienst vor, nicht diese App.** Das ist eine bewusste Entscheidung:
Eine eigene Strecke müsste festhalten, wer wann welche Mail schon bekommen hat. Ohne
Datenhaltung wäre das eine Zustandsmaschine ohne Zustand — sie verschickt früher oder später
doppelt. Dazu kommt die Abmeldeverwaltung, die rechtlich ohnehin beim Dienst liegt.

### Einrichten

1. Konto bei [MailerLite](https://www.mailerlite.com) anlegen. Bis 1.000 Adressen kostenlos,
   was zu deiner Größe passt.
2. Eine Gruppe anlegen, etwa *Freie Tage*. Die ID steht in der Adresszeile der Gruppe.
3. Token unter *Integrations → API* erzeugen. Beides als `MAILERLITE_TOKEN` und
   `MAILERLITE_GRUPPE` eintragen.
4. Mails erzeugen:
   ```bash
   npm run mails -- https://deine-adresse.at
   ```
   Das schreibt HTML und reinen Text nach `.ausgabe/mails/`, mit eingesetzten Links.
5. In MailerLite eine Automation anlegen: Auslöser *tritt der Gruppe bei*, dann die vier
   Mails mit den Wartezeiten aus `uebersicht.json` (Tag 0, 1, 2 und 4). HTML einfügen,
   Betreff und Vorschautext übernehmen.
6. Selbst eintragen und die Strecke einmal komplett durchlaufen lassen.

Änderst du später einen Text, läuft `npm run mails` erneut und du ersetzt ihn in der
Automation. Die Wahrheit steht im Repository, die Kopie beim Dienst.

## Live schalten

Die App ist für Vercel vorbereitet. Der Weg, Schritt für Schritt:

1. Auf [vercel.com](https://vercel.com) mit dem GitHub-Konto anmelden und
   `shortheaven3-lang/webapp` importieren. Framework wird als Next.js erkannt, an den
   Bau-Einstellungen ist nichts zu ändern.
2. Vor dem ersten Bau die Umgebungsvariablen aus `.env.example` eintragen (Settings →
   Environment Variables). **`APP_URL` muss vor dem Bau gesetzt sein** — sie landet in den
   Vorschaubild-Adressen, die beim Bauen entstehen. Nutzt du keine eigene Domain, kannst du
   sie weglassen; Vercel liefert die Adresse dann selbst.
3. Deploy. Danach unter Settings → Domains die eigene Domain verbinden, falls vorhanden.
4. `APP_URL` auf die endgültige Adresse setzen und **neu bauen** (Deployments → Redeploy).
5. Den Link teilen und prüfen, dass das Vorschaubild erscheint.

Mitgeliefert sind `robots.txt`, `sitemap.xml` (nur die frei zugänglichen Seiten), ein
Favicon und ein Vorschaubild unter `/opengraph-image`.

> Das Vorschaubild wird in einer serifenlosen Schrift gesetzt, weil auf dem Server keine
> Serifenschrift verfügbar ist. Wenn dir das wichtig ist, lege eine `.ttf` unter `app/` ab
> und übergib sie in `app/opengraph-image.tsx` an `ImageResponse` — das ist der einzige Weg,
> auf dem eine Schrift dort zuverlässig ankommt.

## Scharf schalten

1. `.env.example` nach `.env.local` kopieren und ausfüllen.
2. `ZUGANG_GEHEIMNIS` erzeugen:
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. Stripe-Schlüssel eintragen, zuerst den `sk_test_`-Schlüssel.
4. Einen Testkauf durchführen (Stripe-Testkarte `4242 4242 4242 4242`).
5. Prüfen, dass nach dem Kauf alle Tage offen sind und ein anderer Browser weiter aussperrt.
6. Erst dann auf den Live-Schlüssel wechseln.

## Vor dem ersten echten Verkauf

Das ist keine Formalität, sondern die Bedingung dafür, dass verkauft werden darf:

* **Anbieterangaben ausfüllen** in `lib/anbieter.ts`. Name, Anschrift und E-Mail stehen dort
  an genau einer Stelle; Impressum, AGB und Datenschutz greifen alle darauf zu. Solange
  Platzhalter drinstehen, **verweigert die Kasse im Produktivbetrieb den Verkauf** (503) und
  auf den Rechtsseiten steht ein sichtbarer Hinweis. Für Testkäufe lässt sich das mit
  `VERKAUF_TROTZ_LUECKEN=1` aufheben.
* **Die drei Rechtstexte durchsehen lassen.** Sie sind ausformuliert, aber ein Entwurf für
  eine Rechtsberatung — zugeschnitten auf einen Anbieter in Österreich. In Deutschland treten
  DDG und MStV an die Stelle von ECG und MedienG. Im Datenschutztext fehlen noch die Namen
  des Hosting-Anbieters und des E-Mail-Dienstes, solange die nicht feststehen.
* **Widerrufsrecht — eingebaut.** Vor der Kasse steht ein nicht vorangekreuztes Kästchen mit
  der Zustimmung zum sofortigen Beginn und dem Hinweis auf das erlöschende Widerrufsrecht.
  Geprüft wird serverseitig, nicht nur im Browser. Zustimmung, Zeitpunkt und Textfassung
  landen in den Metadaten der Stripe-Sitzung, hängen also am Zahlungsvorgang selbst. Der
  Wortlaut steht in `lib/widerruf.ts`; wird er geändert, gehört die Version hochgezählt.
* **Zusätzliche AGB-Zustimmung durch Stripe** lässt sich mit `STRIPE_AGB_ZUSTIMMUNG=1`
  einschalten. Setzt voraus, dass im Stripe-Konto unter den Checkout-Einstellungen eine
  AGB-Adresse hinterlegt ist — sonst weist Stripe die Sitzung ab.
* **Umsatzsteuer.** `automatic_tax` ist eingeschaltet; dafür muss Stripe Tax im Konto
  eingerichtet sein. Bei digitalen Leistungen an Verbraucher in der EU gilt das
  Bestimmungsland — das ist der Grund für den OSS-Weg.

## Grenzen des jetzigen Standes

Bewusst in Kauf genommen, damit die App ohne Datenbank auskommt — und die Stellen, an denen
das später eng wird:

* **Der Zugang hängt am Browser.** Wer das Gerät wechselt, kommt nicht mehr hinein. Ein
  Magic-Link per E-Mail behebt das und braucht dann doch eine Datenhaltung.
* **Kein Stripe-Webhook.** Der Zugang wird beim Rücksprung aus der Kasse gesetzt. Wer das
  Fenster vorher schließt, muss sich melden. Bei nennenswerten Stückzahlen gehört das auf
  Webhooks umgestellt.
* **Kein Fortschritt gespeichert.** Es gibt keine Markierung, welcher Tag erledigt ist.
* **Kein E-Mail-Versand.** Der tägliche Impuls, den die Verkaufsseite in Aussicht stellt,
  ist noch nicht gebaut — `ANMELDUNG_WEBHOOK` übergibt die Adresse nur an einen Dienst.
* **Der Text ist geschrieben, aber nicht lektoriert.** Alle 30 Lektionen stehen, rund 7.600
  Wörter. Vor dem Verkauf gehört das einmal von jemandem gelesen, der nicht daran
  geschrieben hat.
