# Indoor-Golfliga – vollständiger Entwicklungsauftrag

## 1. Rolle und Ziel

Du bist ein erfahrener Full-Stack-Entwickler.

Erstelle eine vollständig funktionsfähige, responsive Website für eine einmalige Indoor-Golfliga.

Die Anwendung soll mit folgenden Technologien umgesetzt werden:

- Frontend: React
- Build-Tool: Vite
- Hosting: Netlify
- Backend: Netlify Functions
- Datenbank: Netlify Database auf PostgreSQL-Basis
- Datenbankzugriff: Drizzle ORM oder eine vergleichbare sichere PostgreSQL-Anbindung
- Programmiersprache: JavaScript
- Styling: schlicht, modern, responsive und mobil gut nutzbar

Die Website muss produktionsbereit sein und auf Netlify deploybar sein.

Wenn eine Funktion von Netlify Database in der aktuellen Umgebung nicht verfügbar ist, verwende eine kompatible PostgreSQL-Datenbank über eine Environment Variable `DATABASE_URL`. Die Website muss weiterhin auf Netlify Functions laufen.

Verwende keine externe Authentifizierungsplattform. Es gibt bewusst nur zwei gemeinsame Passwörter:

- Spieler-Passwort
- Admin-Passwort

---

# 2. Wichtigste Entwicklungsregeln

## 2.1 Vollständige Anwendung erstellen

Erstelle nicht nur Beispielcode oder einzelne Dateien, sondern ein vollständiges lauffähiges Projekt.

Das Projekt muss mindestens enthalten:

```text
package.json
index.html
vite.config.js
netlify.toml
src/
netlify/functions/
drizzle/
README.md
.env.example
```

Falls weitere Dateien notwendig sind, erstelle sie ebenfalls.

## 2.2 Keine Platzhalter

Verwende keine Platzhalter wie:

```text
TODO
Coming soon
Hier später Code einfügen
```

Alle beschriebenen Funktionen müssen implementiert werden.

## 2.3 Keine sensiblen Daten im Frontend

Folgende Werte dürfen niemals im React-Frontend landen:

- `DATABASE_URL`
- Datenbankpasswort
- `PLAYER_PASSWORD`
- `ADMIN_PASSWORD`
- `SESSION_SECRET`
- PostgreSQL-Zugangsdaten

Diese Werte dürfen ausschließlich in Netlify Environment Variables und serverseitig in Netlify Functions verwendet werden.

## 2.4 Server als vertrauenswürdige Instanz

Alle wichtigen Berechnungen müssen serverseitig durchgeführt oder serverseitig geprüft werden:

- Score-to-Par
- Bestergebnis je Spieler und Platz
- Ranglisten
- Tie-Skip-Ranking
- Punkte
- Saison-Gesamtwertung
- Tiebreaker
- Berechtigungen

Das Frontend darf Werte anzeigen, aber nicht allein über gültige Ergebnisse oder Punkte entscheiden.

---

# 3. Saison

Die Website ist für eine einmalige Saison bestimmt.

Die Saison beginnt mit der Veröffentlichung der Website und endet am 31. März.

Verwende die Environment Variable:

```text
SEASON_END_DATE
```

Beispiel:

```text
SEASON_END_DATE=2027-03-31
```

Wenn die Variable nicht gesetzt ist, soll die Website als Fallback den 31. März des aktuellen Jahres verwenden.

Nach dem Saisonende dürfen Ergebnisse weiterhin vom Admin korrigiert und exportiert werden. Das normale Spieler-Eingabeformular soll nach dem Saisonende standardmäßig deaktiviert werden.

Der Admin soll weiterhin Daten ansehen, korrigieren und exportieren können.

---

# 4. Fachliche Regeln der Liga

## 4.1 Plätze

Es gibt insgesamt acht Plätze:

- vier 18-Loch-Plätze
- vier Kurz-/Par3-Plätze

Jeder Platz besitzt:

- eine eindeutige ID
- einen Namen
- einen Typ
- einen festen Par-Wert
- den Status aktiv/inaktiv

Die möglichen Platztypen sind ausschließlich:

```text
18-hole
short/par3
```

Mischformen sind nicht erlaubt.

## 4.2 Spieler

Spieler werden vom Admin verwaltet.

Jeder Spieler besitzt:

- eine eindeutige ID
- einen Namen
- den Status aktiv/inaktiv

Bei der Ergebniseingabe darf kein Freitext für Spieler verwendet werden. Es muss ein Dropdown aus der Spielerliste verwendet werden.

Ein neuer Spieler wird automatisch in die öffentliche Wertung aufgenommen, sobald er mindestens ein Ergebnis besitzt.

Wird ein Spieler deaktiviert, bleiben seine bisherigen Ergebnisse und Punkte in den Leaderboards sichtbar.

## 4.3 Ergebnisse

Pro Runde wird nur das Endergebnis gespeichert.

Gespeichert werden:

- Spieler
- Platz
- Brutto-Schläge
- optionales Spieldatum
- Erstellungsdatum

Der Benutzer gibt immer nur Brutto-Schläge ein.

Der Benutzer darf niemals Score-to-Par manuell eingeben.

Die Berechnung lautet:

```text
score_to_par = gross_strokes - course.par
```

Beispiele:

```text
Brutto 70 bei Par 72 = -2
Brutto 72 bei Par 72 = 0
Brutto 75 bei Par 72 = +3
```

## 4.4 Bestes Ergebnis

Ein Spieler darf jeden Platz beliebig oft spielen.

Für jeden Spieler und jeden Platz zählt ausschließlich das beste jemals gespeicherte Ergebnis.

Das beste Ergebnis ist der niedrigste Score-to-Par-Wert.

Beispiel:

```text
Spieler: Anna
Platz: 18-Loch-Platz 1

Runde 1: +2
Runde 2: -1
Runde 3: -4

Bestergebnis: -4
```

Nur `-4` wird für das Leaderboard dieses Platzes berücksichtigt.

Wenn zwei Runden denselben besten Score-to-Par-Wert besitzen, bleibt trotzdem nur ein Bestwert erhalten.

---

# 5. Punktetabellen

## 5.1 18-Loch-Plätze

Für jeden 18-Loch-Platz gilt:

| Rang | Punkte |
|---:|---:|
| 1 | 100 |
| 2 | 80 |
| 3 | 65 |
| 4 | 55 |
| 5 | 47 |
| 6 | 40 |
| 7 | 34 |
| 8 | 29 |
| 9 | 25 |
| 10 | 21 |
| 11 oder schlechter | 0 |

## 5.2 Kurz-/Par3-Plätze

Für jeden Kurz-/Par3-Platz gilt:

| Rang | Punkte |
|---:|---:|
| 1 | 43 |
| 2 | 34 |
| 3 | 28 |
| 4 | 24 |
| 5 | 20 |
| 6 | 17 |
| 7 | 15 |
| 8 | 12 |
| 9 | 11 |
| 10 | 9 |
| 11 oder schlechter | 0 |

Die Punktetabellen sind fest und dürfen nicht an die tatsächliche Teilnehmerzahl angepasst werden.

Wenn auf einem Platz nur drei Spieler angetreten sind, erhält der beste Spieler trotzdem die volle Punktzahl.

Maximal erreichbar sind:

```text
4 × 100 + 4 × 43 = 572 Punkte
```

---

# 6. Rangfolge und Gleichstände

Es muss das Golf-Standard-Tie-Handling mit Skip-Ranking verwendet werden.

Spieler mit identischem Score-to-Par erhalten:

- denselben Rang
- dieselbe volle Punktzahl für diesen Rang

Die nachfolgenden Ränge werden übersprungen.

Beispiel:

```text
Score-to-Par: -4, -2, -2, -1, +3

Rang:          1,  2,  2,  4,  5
```

Ein weiteres Beispiel:

```text
Rang 1: Spieler A
Rang 2: Spieler B
Rang 2: Spieler C
Rang 4: Spieler D
```

Spieler B und C erhalten beide die Punkte für Rang 2.

Spieler D erhält die Punkte für Rang 4.

## Spezialfall Rang 10

Wenn zwei Spieler auf Rang 10 gleichauf liegen, erhalten beide die Rang-10-Punkte.

Der nächste Spieler erhält aufgrund des Skip-Rankings Rang 12 und damit 0 Punkte.

Beispiel:

```text
Rang 9:  Spieler A
Rang 10: Spieler B
Rang 10: Spieler C
Rang 12: Spieler D
```

Spieler D erhält 0 Punkte.

---

# 7. Saison-Gesamtwertung

Für jeden Spieler mit mindestens einem Ergebnis werden folgende Werte berechnet:

- Gesamtpunkte
- 18-Loch-Punkte
- Par3-Punkte
- bestes einzelnes Score-to-Par-Ergebnis
- optional Anzahl gespielter Runden
- optional Anzahl Plätze mit Ergebnis

Die Gesamtpunkte berechnen sich so:

```text
Gesamtpunkte =
Summe der Punkte aus allen acht Platz-Leaderboards
```

Die Sortierung der Gesamttabelle lautet:

1. Gesamtpunkte absteigend
2. 18-Loch-Punkte absteigend
3. bestes einzelnes Score-to-Par aufsteigend

Ein niedrigeres Score-to-Par ist besser.

Beispiel:

```text
-5 ist besser als -3
-3 ist besser als 0
0 ist besser als +2
```

Wenn nach diesen drei Kriterien weiterhin Gleichstand besteht, bleiben die Spieler gleichauf.

---

# 8. Datenbankmodell

Erstelle eine PostgreSQL-Datenbank mit mindestens diesen Tabellen.

## 8.1 Tabelle `players`

```text
id
name
active
created_at
```

Vorgaben:

- `id`: UUID, Primärschlüssel
- `name`: Pflichtfeld
- `active`: Boolean, Standardwert true
- `created_at`: Zeitstempel

## 8.2 Tabelle `courses`

```text
id
name
type
par
active
created_at
```

Vorgaben:

- `id`: UUID, Primärschlüssel
- `name`: Pflichtfeld
- `type`: nur `18-hole` oder `short/par3`
- `par`: positive Ganzzahl
- `active`: Boolean, Standardwert true
- `created_at`: Zeitstempel

## 8.3 Tabelle `rounds`

```text
id
player_id
course_id
gross_strokes
played_at
created_at
```

Vorgaben:

- `id`: UUID, Primärschlüssel
- `player_id`: Fremdschlüssel auf `players`
- `course_id`: Fremdschlüssel auf `courses`
- `gross_strokes`: positive Ganzzahl
- `played_at`: optionales Datum
- `created_at`: Zeitstempel

## 8.4 Score-to-Par nicht dauerhaft speichern

Speichere `score_to_par` nicht als manuell editierbaren Datenbankwert.

Berechne ihn immer aus:

```text
gross_strokes - courses.par
```

Dadurch bleiben die Daten konsistent.

## 8.5 Datenbankmigrationen

Erstelle:

- SQL-Migrationen oder Drizzle-Migrationen
- ein Seed-Skript mit Beispielplätzen
- eine verständliche Anleitung zur Ausführung der Migrationen

Die Seed-Daten dürfen nur verwendet werden, wenn der Benutzer dies ausdrücklich ausführt.

---

# 9. Backend mit Netlify Functions

Erstelle serverseitige Netlify Functions oder eine vergleichbare API-Struktur.

Mindestens erforderlich sind:

```text
netlify/functions/public-data.js
netlify/functions/auth-player.js
netlify/functions/auth-admin.js
netlify/functions/submit-round.js
netlify/functions/admin-data.js
netlify/functions/export-csv.js
```

Zusätzliche Hilfsdateien dürfen beispielsweise hier liegen:

```text
netlify/functions/_lib/
```

## 9.1 `public-data`

Diese Funktion liefert öffentliche Daten:

- Gesamtwertung
- 18-Loch-Gesamtwertung
- Par3-Gesamtwertung
- Leaderboard eines einzelnen Platzes
- aktive Plätze
- Spieler mit mindestens einem Ergebnis

Es dürfen keine Passwörter oder internen Zugangsdaten zurückgegeben werden.

## 9.2 `auth-player`

Diese Funktion prüft das Spieler-Passwort.

Bei erfolgreicher Prüfung soll eine sichere, zeitlich begrenzte Session oder ein signiertes Token ausgegeben werden.

Die Session soll nur die Spielerrechte besitzen.

## 9.3 `auth-admin`

Diese Funktion prüft das Admin-Passwort.

Bei erfolgreicher Prüfung soll eine sichere, zeitlich begrenzte Admin-Session oder ein signiertes Token ausgegeben werden.

Die Admin-Session muss Zugriff auf alle Admin-Funktionen ermöglichen.

## 9.4 `submit-round`

Diese Funktion darf nur mit gültiger Spieler- oder Admin-Session verwendet werden.

Sie muss prüfen:

- gültige Session
- gültige Spieler-ID
- gültige Platz-ID
- Spieler existiert
- Platz existiert
- Platz ist aktiv
- Brutto-Schläge sind eine positive Ganzzahl
- Spieldatum ist gültig, falls vorhanden
- Spieldatum liegt nicht nach dem Saisonende

Danach wird die Runde gespeichert.

## 9.5 `admin-data`

Diese Funktion verarbeitet Admin-Aktionen:

- Spieler hinzufügen
- Spieler umbenennen
- Spieler deaktivieren
- Spieler aktivieren
- Platz hinzufügen
- Platz umbenennen
- Par-Wert ändern
- Platz deaktivieren
- Runde bearbeiten
- Runde löschen
- Runden anzeigen

Nur Admin-Sessions dürfen diese Funktion verwenden.

## 9.6 `export-csv`

Nur Admin-Sessions dürfen Exporte herunterladen.

Benötigte Exporte:

1. Rohdaten aller Runden
2. Bestes Ergebnis je Spieler und Platz
3. Gesamttabelle
4. optional einzelne Platz-Leaderboards

Die CSV-Dateien müssen UTF-8 verwenden und für Excel geeignet sein.

Die CSV-Spalten sollen sprechende deutsche Überschriften besitzen, beispielsweise:

```text
Spieler;Platz;Platztyp;Par;Brutto-Schläge;Score-to-Par;Spieldatum
```

---

# 10. Passwortschutz

Verwende folgende Environment Variables:

```text
PLAYER_PASSWORD
ADMIN_PASSWORD
SESSION_SECRET
DATABASE_URL
SEASON_END_DATE
```

Erstelle außerdem eine Datei:

```text
.env.example
```

Mit folgendem Inhalt:

```env
PLAYER_PASSWORD=bitte-setzen
ADMIN_PASSWORD=bitte-setzen
SESSION_SECRET=lange-zufallszeichenfolge
DATABASE_URL=postgresql://...
SEASON_END_DATE=2027-03-31
```

Die echte `.env`-Datei darf nicht in Git committed werden.

Füge `.env` zur `.gitignore` hinzu.

Der Spieler darf:

- Ergebnisse eingeben

Der Spieler darf nicht:

- Spieler verwalten
- Plätze verwalten
- Runden bearbeiten
- Runden löschen
- Exporte erstellen

Der Admin darf alle Funktionen verwenden.

Die Passwörter dürfen nicht über die Website geändert werden.

---

# 11. Öffentliche Seiten

Erstelle folgende Routen.

## 11.1 Startseite

Route:

```text
/
```

Inhalt:

- Titel der Indoor-Golfliga
- Saisonzeitraum
- Gesamttabelle
- Rang
- Spielername
- Gesamtpunkte
- 18-Loch-Punkte
- Par3-Punkte
- bestes Einzel-Score-to-Par
- Hinweis auf die Wertungsregeln

## 11.2 18-Loch-Leaderboard

Route:

```text
/18-loch
```

Inhalt:

- kombinierte 18-Loch-Punktesumme je Spieler
- Rang
- Spielername
- Punkte je 18-Loch-Platz
- Links zu den vier Einzelplätzen

## 11.3 Par3-Leaderboard

Route:

```text
/par3
```

Inhalt:

- kombinierte Par3-Punktesumme je Spieler
- Rang
- Spielername
- Punkte je Kurz-/Par3-Platz
- Links zu den vier Einzelplätzen

## 11.4 Einzelplatz-Leaderboard

Route:

```text
/course/:courseId
```

Inhalt:

- Platzname
- Platztyp
- Par
- Rang
- Spielername
- bestes Score-to-Par
- Punkte
- optional Brutto-Schläge der besten Runde
- optional Datum der besten Runde

Das Score-to-Par muss sichtbar sein.

## 11.5 Ergebniseingabe

Route:

```text
/ergebnis-eingeben
```

Vor dem Formular muss das Spieler-Passwort eingegeben werden.

Formularfelder:

- Spieler-Dropdown
- Platz-Dropdown
- Brutto-Schläge
- optional Spieldatum
- Speichern-Schaltfläche

Nicht anzeigen:

- Freitextfeld für Spieler
- Eingabefeld für Score-to-Par
- Eingabefeld für Punkte
- Eingabefeld für Rang

Nach erfolgreichem Speichern:

- Erfolgsmeldung anzeigen
- Formular zurücksetzen
- aktualisierte öffentliche Wertung anbieten

## 11.6 Admin-Bereich

Route:

```text
/admin
```

Der Admin-Bereich muss zunächst das Admin-Passwort abfragen.

Unterbereiche:

- Spielerverwaltung
- Platzverwaltung
- Rundenverwaltung
- Export

---

# 12. Admin-Funktionen im Detail

## Spielerverwaltung

Möglichkeiten:

- neuen Spieler hinzufügen
- Namen bearbeiten
- Spieler deaktivieren
- Spieler wieder aktivieren
- aktive und inaktive Spieler anzeigen

Das Löschen von Spielern soll nicht angeboten werden, wenn bereits Runden vorhanden sind. So bleiben historische Ergebnisse erhalten.

## Platzverwaltung

Möglichkeiten:

- Platzname bearbeiten
- Par-Wert bearbeiten
- Platz aktivieren/deaktivieren

Wenn für einen Platz bereits Ergebnisse vorhanden sind, muss eine Änderung des Par-Werts besonders deutlich bestätigt werden, da sich dadurch alle Score-to-Par-Werte ändern.

Bevorzugte Regel:

- Par-Wert darf nur geändert werden, wenn noch keine Runde für diesen Platz gespeichert ist.
- Falls eine Änderung trotzdem möglich sein soll, muss eine Warnung angezeigt werden.

## Rundenverwaltung

Möglichkeiten:

- alle Runden anzeigen
- nach Spieler filtern
- nach Platz filtern
- nach Datum filtern
- Runde bearbeiten
- Runde löschen

Nach jeder Änderung müssen alle Leaderboards automatisch neu berechnet werden.

---

# 13. UI- und Designvorgaben

Die Website soll:

- auf Smartphones funktionieren
- auf Tablets funktionieren
- auf Desktop-Bildschirmen funktionieren
- eine klare Navigation besitzen
- Tabellen auf mobilen Geräten horizontal scrollbar machen oder sinnvoll stapeln
- verständliche Fehlermeldungen anzeigen
- Ladezustände anzeigen
- leere Zustände anzeigen
- eine Bestätigung vor dem Löschen anzeigen

Verwende ein schlichtes, sportliches Design.

Empfohlene Farben:

- Dunkelgrün
- Weiß
- Grau
- dezentes Gold für den ersten Platz

Die Anwendung soll nicht überladen wirken.

Alle sichtbaren Texte sollen auf Deutsch sein.

Technische Variablennamen und API-Namen dürfen Englisch sein.

---

# 14. Fehlerbehandlung und Validierung

Implementiere verständliche Fehlermeldungen für:

- falsches Passwort
- fehlende Eingabewerte
- ungültige Spieler-ID
- ungültige Platz-ID
- ungültige Brutto-Schläge
- ungültiges Datum
- Saison bereits beendet
- Datenbankfehler
- fehlende Berechtigung
- Netzwerkfehler

Beispiele für deutsche Meldungen:

```text
Das Passwort ist falsch.
Bitte gib eine gültige Anzahl an Brutto-Schlägen ein.
Dieser Platz ist nicht mehr aktiv.
Die Saison ist bereits beendet.
Du hast keine Berechtigung für diese Aktion.
```

---

# 15. Projektdateien

Erstelle mindestens folgende Dateien oder entsprechende Alternativen:

```text
package.json
index.html
vite.config.js
netlify.toml
.env.example
.gitignore
README.md

src/
  main.jsx
  App.jsx
  styles/
  components/
  pages/
  lib/

netlify/
  functions/
    public-data.js
    auth-player.js
    auth-admin.js
    submit-round.js
    admin-data.js
    export-csv.js
    _lib/

drizzle/
  migrations/
  schema.js
  seed.js
```

---

# 16. Netlify-Konfiguration

Erstelle eine `netlify.toml` mit einer passenden Konfiguration.

Die Konfiguration soll mindestens enthalten:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Die Konfiguration muss React-Routing und Netlify Functions unterstützen.

---

# 17. NPM-Skripte

Erstelle sinnvolle Skripte in `package.json`, mindestens:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "db:migrate": "drizzle-kit migrate",
    "db:seed": "node drizzle/seed.js"
  }
}
```

Passe die Skripte an die tatsächlich verwendeten Pakete an.

---

# 18. Tests

Erstelle Tests oder zumindest eine automatisierte Testdatei für die zentrale Berechnungslogik.

Teste mindestens:

## Bestes Ergebnis

- schlechteres Ergebnis wird ignoriert
- besseres Ergebnis wird verwendet
- mehrere identische Bestwerte funktionieren

## Tie-Ranking

Teste:

```text
-4, -2, -2, -1
```

Erwartetes Ranking:

```text
1, 2, 2, 4
```

Teste außerdem:

```text
Rang 10, Rang 10, nächster Spieler
```

Der nächste Spieler muss Rang 12 erhalten und 0 Punkte bekommen.

## Punktetabellen

Teste:

- Rang 1 bei 18-Loch = 100 Punkte
- Rang 10 bei 18-Loch = 21 Punkte
- Rang 11 bei 18-Loch = 0 Punkte
- Rang 1 bei Par3 = 43 Punkte
- Rang 10 bei Par3 = 9 Punkte
- Rang 11 bei Par3 = 0 Punkte

## Saisonwertung

Teste:

- Gesamtpunkte
- 18-Loch-Punkte
- Par3-Punkte
- Tiebreaker
- Spieler ohne Ergebnisse
- deaktivierte Spieler mit historischen Ergebnissen

---

# 19. README erstellen

Erstelle eine deutsche `README.md` mit einer verständlichen Schritt-für-Schritt-Anleitung für Anfänger.

Die Anleitung muss erklären:

1. Wie das Projekt lokal beziehungsweise in GitHub Codespaces gestartet wird
2. Wie die Environment Variables gesetzt werden
3. Wie die Datenbankmigration ausgeführt wird
4. Wie Beispielplätze angelegt werden
5. Wie Netlify mit GitHub verbunden wird
6. Welche Build-Einstellungen Netlify benötigt
7. Wie ein Deploy durchgeführt wird
8. Wie die Website getestet wird
9. Wie Spieler und Plätze eingerichtet werden
10. Wie CSV-Exporte verwendet werden

Da die Anwendung möglichst vollständig in Netlify betrieben werden soll, beschreibe insbesondere die Einrichtung der Netlify Database und Netlify Environment Variables.

---

# 20. Akzeptanzkriterien

Die Aufgabe ist erst abgeschlossen, wenn alle folgenden Punkte erfüllt sind:

- Die Website kann mit `npm run dev` gestartet werden.
- `npm run build` läuft ohne Fehler durch.
- Die Website kann auf Netlify deployed werden.
- React-Routen funktionieren auch nach einem direkten Neuladen.
- Die Datenbankmigrationen sind vorhanden.
- Spieler können gespeichert werden.
- Plätze können gespeichert werden.
- Runden können gespeichert werden.
- Score-to-Par wird korrekt berechnet.
- Bestergebnisse werden korrekt ermittelt.
- Tie-Skip-Ranking funktioniert.
- Die Punktetabellen sind korrekt umgesetzt.
- Rang 11 oder schlechter erhält 0 Punkte.
- Die Gesamtwertung wird korrekt berechnet.
- Der Tiebreaker funktioniert.
- Spielerpasswort und Adminpasswort sind getrennt.
- Passwörter werden nicht an das Frontend ausgeliefert.
- Nur Admins können Daten bearbeiten oder löschen.
- CSV-Export funktioniert.
- Die Website funktioniert auf Mobilgeräten.
- Alle wesentlichen Oberflächentexte sind auf Deutsch.
- Es existieren keine ungelösten TODO-Platzhalter.

---

# 21. Vorgehensweise des Coding Agents

Arbeite in dieser Reihenfolge:

1. Bestehendes Repository prüfen.
2. React/Vite-Projektstruktur erstellen oder vervollständigen.
3. Datenbankmodell und Migrationen erstellen.
4. Datenbankzugriff implementieren.
5. Berechnungslogik implementieren.
6. Tests für die Berechnungslogik erstellen.
7. Netlify Functions erstellen.
8. Passwortschutz implementieren.
9. Öffentliche Seiten erstellen.
10. Ergebniseingabe erstellen.
11. Admin-Bereich erstellen.
12. CSV-Export erstellen.
13. Styling und responsive Layout erstellen.
14. README und `.env.example` erstellen.
15. Build ausführen und Fehler beheben.
16. Alle Akzeptanzkriterien prüfen.
17. Am Ende eine kurze Zusammenfassung der erstellten Dateien und der nächsten Schritte ausgeben.

Wenn Informationen fehlen, triff eine sinnvolle technische Entscheidung und dokumentiere diese in der README.

Frage nicht nach jeder Kleinigkeit nach. Implementiere zunächst eine vollständige funktionierende Version.
