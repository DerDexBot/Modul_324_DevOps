# Testergebnisse React-Frontend

Datum: 05.06.2026
Bereich: `frontend`
Testframework: Jest + React Testing Library

## Ausgeführte Befehle

Empfohlene Befehle im Projekt:

```bash
cd frontend
npm test -- --runInBand
npm run lint
npm run build
```

In der Sandbox wurden wegen fehlender Unix-Ausführungsrechte im entpackten `node_modules/.bin` direkt die Node-Entrypoints ausgeführt:

```bash
node ./node_modules/jest/bin/jest.js --runInBand
node ./node_modules/eslint/bin/eslint.js .
node ./node_modules/vite/bin/vite.js build
```

## Ergebnis

| Prüfung | Ergebnis |
|---|---:|
| Jest Test Suites | 1 passed, 1 total |
| Jest Tests | 11 passed, 11 total |
| Snapshots | 0 total |
| ESLint | erfolgreich, keine Fehler |
| Vite Build | erfolgreich |

## Getestete Funktionen

1. **Aufgaben laden**
   - Mockt `GET http://localhost:8080/tasks`.
   - Prüft, ob offene und erledigte Aufgaben korrekt angezeigt werden.

2. **Neue Aufgabe erstellen**
   - Mockt initiales Laden, `POST http://localhost:8080/tasks` und erneutes Laden.
   - Prüft, ob die richtige JSON-Payload gesendet wird.
   - Prüft, ob die neue Aufgabe danach in der Liste erscheint.

3. **Leere Eingabe verhindern**
   - Prüft, ob bei leerem Formular eine Fehlermeldung angezeigt wird.
   - Prüft, dass kein zusätzlicher POST-Request ausgelöst wird.

4. **Filter-Buttons anzeigen**
   - Prüft, ob die Filter `Alle`, `Offen` und `Erledigt` angezeigt werden, sobald Tasks vorhanden sind.

5. **Offene Aufgaben filtern**
   - Prüft, ob nach Klick auf `Offen` nur offene Tasks sichtbar bleiben.

6. **Fortschritt mit korrekter Anzahl anzeigen**
   - Prüft den Fortschrittstext, z. B. `1 von 2 Aufgaben erledigt`.

7. **Glückwunsch-Meldung anzeigen**
   - Prüft, ob bei vollständig erledigter Liste `🎉 Alle Aufgaben erledigt!` angezeigt wird.

8. **Fortschritt bei leerer Liste ausblenden**
   - Prüft, dass bei leerer Aufgabenliste kein Fortschrittstext angezeigt wird.

9. **Erledigte Aufgaben filtern**
   - Prüft, ob nach Klick auf `Erledigt` nur erledigte Tasks sichtbar bleiben.

10. **Aufgabe bearbeiten**
    - Mockt `PUT http://localhost:8080/tasks/1`.
    - Prüft, ob der richtige Request mit JSON-Payload gesendet wird.
    - Prüft, ob nach dem Neuladen der aktualisierte Text angezeigt wird.

11. **Aufgabe löschen**
    - Mockt `DELETE http://localhost:8080/tasks/1`.
    - Prüft, ob der richtige Delete-Request gesendet wird.
    - Prüft, ob die gelöschte Aufgabe nach dem Neuladen nicht mehr angezeigt wird.

## Konsolenausgabe

```text
PASS src/App.test.jsx
  App
    ✓ lädt Aufgaben vom Backend und zeigt sie in der Liste an
    ✓ legt eine neue Aufgabe per POST an und lädt die Liste danach neu
    ✓ zeigt eine Fehlermeldung, wenn eine leere Aufgabe abgesendet wird
    ✓ US-20: zeigt Filter-Buttons wenn Tasks vorhanden sind
    ✓ US-20: filtert nur offene Aufgaben wenn Offen-Filter aktiv
    ✓ US-21: zeigt Fortschrittstext mit korrekter Anzahl
    ✓ US-21: zeigt Glückwunsch-Meldung wenn alle Aufgaben erledigt sind
    ✓ US-21: zeigt keinen Fortschrittsbalken wenn keine Tasks vorhanden
    ✓ US-20: filtert nur erledigte Aufgaben wenn Erledigt-Filter aktiv
    ✓ bearbeitet eine bestehende Aufgabe per PUT und lädt die aktualisierte Liste neu
    ✓ löscht eine Aufgabe per DELETE und entfernt sie nach dem Neuladen aus der Liste

Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
Snapshots:   0 total
```

## Bemerkung

Die Tests verwenden gemockte `fetch`-Antworten. Dadurch sind sie unabhängig vom Spring-Boot-Backend und können lokal oder in einer CI-Pipeline stabil ausgeführt werden.
