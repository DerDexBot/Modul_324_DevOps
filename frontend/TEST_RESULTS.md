# Testergebnisse React-Frontend

Datum: 05.06.2026
Bereich: `frontend`
Testframework: Jest + React Testing Library

## Ausgeführte Befehle

```bash
cd frontend
npm test -- --runInBand
npm run lint
npm run build
```

## Ergebnis

| Prüfung | Ergebnis |
|---|---:|
| Jest Test Suites | 1 passed, 1 total |
| Jest Tests | 3 passed, 3 total |
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

## Konsolenausgabe

```text
PASS src/App.test.jsx
  App
    ✓ lädt Aufgaben vom Backend und zeigt sie in der Liste an
    ✓ legt eine neue Aufgabe per POST an und lädt die Liste danach neu
    ✓ zeigt eine Fehlermeldung, wenn eine leere Aufgabe abgesendet wird

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
```

## Bemerkung

Die Tests verwenden gemockte `fetch`-Antworten. Dadurch sind sie unabhängig vom Spring-Boot-Backend und können lokal oder in einer CI-Pipeline stabil ausgeführt werden.
