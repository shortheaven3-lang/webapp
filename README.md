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
* **Die Inhalte** (`tests/lektionen.test.ts`): lückenlose Nummerierung, gültige Säulen,
  genau die ersten Tage kostenlos, und kein Entwurf als Kostprobe auf der Verkaufsseite.
* **Der Geldpfad über HTTP** (`tests/geldpfad.test.mjs`): startet einen echten
  Produktionsserver und prüft, dass bezahlter Text ohne gültigen Cookie nirgends in der
  Antwort steht, dass die Kasse ohne Zustimmung nicht aufgeht und dass ein erfundener
  Rücksprung aus Stripe nichts freischaltet.

Der Geldpfad-Test bricht ab, wenn auf seinem Port schon etwas antwortet. Das ist Absicht:
Sonst prüft ein Lauf stillschweigend gegen einen alten Serverstand und meldet grün, obwohl
die Schranke offen steht.

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

* **Impressum, AGB und Datenschutz** ausfüllen — die drei Seiten liegen als Platzhalter
  bereit und benennen, was hineingehört.
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
* **25 von 30 Lektionen sind Entwürfe.** Tag 1 bis 5 sind ausgeschrieben und dienen als
  Maßstab für Aufbau, Länge und Ton.
