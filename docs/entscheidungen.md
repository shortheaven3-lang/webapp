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

## 2026-08-29 — Zustimmung zum Erloeschen des Widerrufsrechts vor der Kasse

* **Lage:** Bei digitalen Inhalten erlischt das vierzehntaegige Widerrufsrecht nur vorzeitig,
  wenn vor dem Kauf dem sofortigen Beginn zugestimmt *und* der Verlust des Widerrufsrechts
  bestaetigt wird. Ohne das kann jemand alle 30 Tage lesen und danach das Geld zurueckfordern.
* **Wahl:** Ein nicht vorangekreuztes Kaestchen auf der eigenen Seite. Die Pruefung liegt im
  Server-Endpunkt der Kasse, nicht nur im Browser. Zustimmung, Zeitpunkt und Textfassung gehen
  als Metadaten in die Stripe-Sitzung — der Nachweis haengt damit am Zahlungsvorgang und
  ueberlebt jeden Umbau dieser App.
* **Verworfen:** Allein auf Stripes `consent_collection.terms_of_service` zu setzen. Das
  verlangt eine im Stripe-Konto hinterlegte AGB-Adresse und deckt fuer sich genommen nur die
  AGB ab, nicht die zweiteilige Zustimmung. Es laesst sich ueber `STRIPE_AGB_ZUSTIMMUNG=1`
  zusaetzlich einschalten.

## 2026-08-29 — Verkaufsbereitschaft nicht beim Bau entscheiden

* **Lage:** Die Verkaufsseite wird vorgerendert. Ob Stripe-Schluessel gesetzt sind, wurde
  dabei im Build eingefroren — wer die Schluessel spaeter nachtraegt, haette weiterhin
  "noch nicht scharf" gesehen.
* **Wahl:** Der Kaufknopf wird immer gezeigt. Ob verkauft werden kann, entscheidet der Server
  im Moment des Klicks und antwortet sonst mit 503 samt Grund.
* **Verworfen:** Die Seite dynamisch zu rendern. Das haette die wichtigste Seite des Projekts
  ohne Not verlangsamt.

## 2026-08-29 — Tests mit Nodes eigenem Runner, ohne Framework

* **Lage:** Die Bezahlschranke und die Zustimmungspflicht sind die Stellen, an denen ein
  Fehler direkt Geld kostet. Beides war ungeprueft.
* **Wahl:** Nodes eingebauter Test-Runner mit Typ-Stripping. Keine zusaetzliche
  Abhaengigkeit. Dazu ein Test, der einen echten Produktionsserver startet und ueber HTTP
  prueft — dort, wo die Schranke tatsaechlich wirken muss.
* **Verworfen:** Vitest oder Jest. Beide haetten fuer diesen Umfang mehr Wartung als Nutzen
  gebracht.
* **Nachgewiesen:** Mit absichtlich geoeffneter Schranke schlagen die Tests fehl, nach der
  Ruecknahme sind sie wieder gruen.

## 2026-08-29 — Der Geldpfad-Test bricht bei belegtem Port ab

* **Lage:** Der Testserver wurde ueber eine Huelle gestartet; `kill` beendete nur die
  Huelle. Der naechste Lauf fand einen alten Server vor, prueft gegen dessen Stand und
  meldete gruen, obwohl der neue Code die Schranke geoeffnet hatte.
* **Wahl:** Eigene Prozessgruppe und Abbruch des ganzen Baums. Zusaetzlich prueft der
  Test vorher, ob auf dem Port schon etwas antwortet, und bricht dann ab.
* **Warum das wichtig ist:** Ein Test, der gegen einen alten Stand prueft, ist schlimmer
  als kein Test. Er behauptet Sicherheit, die es nicht gibt.

## 2026-08-29 — Kasse sperrt bei unvollstaendigem Impressum

* **Lage:** Rechtstexte sind der Teil, den man aufschiebt. Ein Deployment mit leerem
  Impressum ist schnell passiert und teuer.
* **Wahl:** Anbieterdaten liegen an einer Stelle in lib/anbieter.ts. Fehlen Pflichtfelder,
  antwortet die Kasse im Produktivbetrieb mit 503 und die Rechtsseiten zeigen einen Hinweis.
  Fuer Testkaeufe hebt VERKAUF_TROTZ_LUECKEN=1 die Sperre auf.
* **Verworfen:** Nur ein Kommentar im Code. Der wird gelesen, wenn es zu spaet ist.
* **Bewusst nicht:** Die Rechtsseiten selbst sperren. Sie muessen erreichbar bleiben, auch
  waehrend sie unfertig sind.

## 2026-08-29 — robots.txt und Sitemap bei jeder Anfrage erzeugen

* **Lage:** Beide werden normalerweise beim Bauen erzeugt und frieren damit die Adresse ein,
  die zu diesem Zeitpunkt bekannt war. Wer APP_URL spaeter nachtraegt, haette eine Sitemap
  voller localhost-Adressen ausgeliefert, ohne dass etwas kaputt aussieht.
* **Wahl:** force-dynamic fuer beide. Sie sind winzig, die Kosten dafuer sind zu
  vernachlaessigen.
* **Bleibt bestehen:** Das Vorschaubild und metadataBase haengen weiterhin am Bauzeitpunkt.
  Die Verkaufsseite dafuer dynamisch zu machen waere zu teuer; stattdessen steht im README,
  dass APP_URL vor dem Bau gesetzt sein muss.

## 2026-08-29 — Takt der E-Mail-Strecke liegt beim Versanddienst

* **Lage:** Die Verkaufsseite verspricht taegliche Impulse. Ohne Versand ist das ein
  offenes Versprechen, und jede gesammelte Adresse wartet auf eine Mail, die nie kommt.
* **Wahl:** Diese App traegt nur ein. Der Dienst haelt die Adressen, gibt den Takt vor und
  verwaltet Abmeldungen. Die Texte liegen als Markdown im Repository und werden ueber
  `npm run mails` zu fertigem HTML.
* **Verworfen:** Eine eigene Strecke ueber GitHub Actions, wie beim Autoposter. Sie
  muesste festhalten, wer wann welche Mail bekommen hat — ohne Datenhaltung ist das eine
  Zustandsmaschine ohne Zustand, die frueher oder spaeter doppelt verschickt. Dazu kaeme
  die Abmeldeverwaltung, die rechtlich ohnehin beim Dienst liegt.
* **Preis:** Die Texte liegen doppelt vor, im Repository und beim Dienst. Wer einen Text
  aendert, muss ihn dort ersetzen. Das ist die Kopie, die wir bewusst in Kauf nehmen.

## 2026-08-29 — HTTP-Tests brechen bei veraltetem Bau ab

* **Lage:** Ein direkt gestarteter HTTP-Test prueft gegen den letzten Produktionsbau. Ist
  der aelter als der Quelltext, meldet er Fehler, die es nicht gibt — oder gruen fuer Code,
  der nie gebaut wurde. Genau das ist beim Bau der Anmeldung passiert.
* **Wahl:** Die Serverhilfe vergleicht das Datum von .next/BUILD_ID mit der juengsten Datei
  in app, lib, components und content und bricht mit klarer Ansage ab.

## 2026-08-29 — Alle 30 Lektionen ausgeschrieben

* **Lage:** 25 der 30 Tage waren Platzhalter. Ohne sie gab es kein Produkt, nur eine
  Verkaufsseite.
* **Wahl:** Alle ausgeschrieben, rund 7.600 Woerter, im Aufbau von Tag 1 bis 5: ein Gedanke
  ohne Ueberschrift, dann die Uebung, dann die Frage. Laenge zwischen 195 und 363 Woertern,
  damit kein Tag sich anfuehlt wie Fuellmaterial und keiner wie ein Nachmittag.
* **Bogen:** Woche 1 Sehen, Woche 2 Grenzen, Woche 3 Handeln, Woche 4 Loslassen. Die
  Rueckblicke an Tag 7, 14, 21 und 28 greifen die Notizen der jeweiligen Woche namentlich
  auf — sie funktionieren nur, wenn die Uebungen davor gemacht wurden. Das ist Absicht.
* **Offen:** Der Text ist nicht lektoriert. Das gehoert vor dem Verkauf von jemandem
  gelesen, der nicht daran geschrieben hat.

## 2026-08-30 — Selbsttest als Einstieg

* **Lage:** Der Einstieg war die Verkaufsseite. Die redet ueber das Produkt, und wer sie
  ohne Vorbereitung sieht, hat keinen Grund zu bleiben.
* **Wahl:** Zwoelf Aussagen, vier Bereiche, ein Ergebnis mit eigener Adresse und eigenem
  Vorschaubild. Keine E-Mail noetig, um das Ergebnis zu sehen — die Anmeldung kommt danach
  und traegt den Bereich als Quelle mit.
* **Verworfen:** Ergebnis erst nach Eintragen der Adresse. Das erhoeht die Ausbeute je
  Besucher und senkt die Zahl der Besucher, weil es sich wie eine Mautstelle anfuehlt. Bei
  unter 1.000 Followern ist Reichweite knapper als Ausbeute.
* **Bewusst gegen die eigene Kasse:** Wer fast ueberall "selten" antwortet, bekommt auf der
  Ergebnisseite gesagt, dass er das Programm gerade vielleicht nicht braucht. Ein Test, der
  jedem ein Problem bescheinigt, ist keiner.
* **Gleichstand:** Gewinnt der Bereich, der im Programm zuerst drankommt. Die Wochen bauen
  aufeinander auf; wer bei Grenzen und Handeln gleich hoch liegt, faengt bei Grenzen an.

## 2026-08-30 — Aussagen des Selbsttests konkretisiert

* **Lage:** Die zwoelf Aussagen beschrieben Kategorien statt Szenen ("Ich schiebe eine Sache
  seit Wochen vor mir her"). So steht es in jedem Ratgeber; niemand liest das und denkt,
  hier sitzt jemand, der es kennt.
* **Wahl:** Jede Aussage traegt jetzt einen Ort, eine Uhrzeit oder einen gedachten Satz —
  das Auto vor der Tuer, halb elf, "Dann fange ich eben Montag neu an". Dasselbe bei den
  Ergebnistexten.
* **Abgesichert:** Zwei Tests halten den Stand. Jede Aussage muss in der ersten Person
  stehen (ohne Ich wird daraus wieder eine Kategorie) und zwischen 35 und 95 Zeichen lang
  sein, weil sie gross gesetzt allein auf dem Bildschirm steht.
* **Nebenbei:** Ein Seitentest hing an einer Formulierung aus dem Fliesstext. Er prueft
  jetzt auf den Startknopf — der wird beim Feilen an der Sprache nicht mit umgeschrieben.
