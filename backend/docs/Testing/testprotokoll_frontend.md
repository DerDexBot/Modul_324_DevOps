# Testprotokoll – Frontend (React/Jest)

**Projekt:** Modul 324 DevOps – ToDo-Applikation  
**Komponente:** Frontend (React + Vite)  
**Datum der Durchführung:** 05.06.2026  
**Durchgeführt von:** Rudy, Martin  
**Testumgebung:** Jest + jsdom, @testing-library/react  
**Gesamtergebnis:** Alle 9 Tests bestanden

---

## Übersicht

| Testgruppe | Anzahl Tests | Bestanden | Fehlgeschlagen |
|---|---|---|---|
| Grundfunktionen (Laden, Erstellen, Validierung) | 3 | 3 | 0 |
| US-20: Filter (Alle / Offen / Erledigt) | 3 | 3 | 0 |
| US-21: Fortschrittsanzeige | 3 | 3 | 0 |
| **Total** | **9** | **9** | **0** |

---

## Testklasse: `App.test.jsx`

**Testart:** Unit-/Integrationstests mit React Testing Library  
**Testumgebung:** jsdom (Browser-Simulation im Node.js-Prozess)  
**Mock-Strategie:** `globalThis.fetch` wird per `jest.fn()` gemockt — kein echter Backend-Aufruf

---

## 1. Grundfunktionen

| # | Testname | Beschreibung | Erwartetes Ergebnis | Ergebnis |
|---|---|---|---|---|
| 1 | `lädt Aufgaben vom Backend und zeigt sie in der Liste an` | Fetch-Mock gibt 2 Tasks zurück, einer erledigt | Beide Tasks sichtbar, Done-Button deaktiviert | Bestanden |
| 2 | `legt eine neue Aufgabe per POST an und lädt die Liste danach neu` | Eingabe → Absenden → Liste neu geladen | POST gefeuert, neuer Task in Liste, Eingabefeld leer | Bestanden |
| 3 | `zeigt eine Fehlermeldung, wenn eine leere Aufgabe abgesendet wird` | Absenden ohne Eingabe | Fehlermeldung sichtbar, kein POST ausgelöst | Bestanden |

---

## 2. US-20: Filter-Tests

| # | Testname | Beschreibung | Erwartetes Ergebnis | Ergebnis |
|---|---|---|---|---|
| 4 | `US-20: zeigt Filter-Buttons wenn Tasks vorhanden sind` | 2 Tasks (1 offen, 1 erledigt) vorhanden | Buttons Alle, Offen, Erledigt sichtbar | Bestanden |
| 5 | `US-20: filtert nur offene Aufgaben wenn Offen-Filter aktiv` | Klick auf „Offen" | Nur offene Task sichtbar, erledigte ausgeblendet | Bestanden |
| 6 | `US-20: filtert nur erledigte Aufgaben wenn Erledigt-Filter aktiv` | Klick auf „Erledigt" | Nur erledigte Task sichtbar, offene ausgeblendet | Bestanden |

---

## 3. US-21: Fortschrittsanzeige-Tests

| # | Testname | Beschreibung | Erwartetes Ergebnis | Ergebnis |
|---|---|---|---|---|
| 7 | `US-21: zeigt Fortschrittstext mit korrekter Anzahl` | 1 von 2 Tasks erledigt | Text „1 von 2 Aufgaben erledigt" sichtbar | Bestanden |
| 8 | `US-21: zeigt Glückwunsch-Meldung wenn alle Aufgaben erledigt sind` | Beide Tasks erledigt | Text „🎉 Alle Aufgaben erledigt!" sichtbar | Bestanden |
| 9 | `US-21: zeigt keinen Fortschrittsbalken wenn keine Tasks vorhanden` | Leere Task-Liste | Kein Fortschrittstext vorhanden | Bestanden |

---

## 4. Testinfrastruktur

### Verwendete Bibliotheken

| Bibliothek | Zweck |
|---|---|
| Jest | Test-Runner, Assertions, Mocking |
| @testing-library/react | React-Komponenten rendern und DOM abfragen |
| @testing-library/user-event | Benutzeraktionen simulieren (Klick, Eingabe) |
| jest-environment-jsdom | Browser-DOM-Simulation in Node.js |
| identity-obj-proxy | CSS-Module in Tests mocken |

### Mock-Strategie

```javascript
// Vor jedem Test: fetch mocken
globalThis.fetch = jest.fn()

// Antwort simulieren
globalThis.fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve([{ id: 1, taskdescription: '...', done: false }])
})
```

Kein echter HTTP-Aufruf — das Backend muss für Frontend-Tests **nicht** laufen.

### Tests lokal ausführen

```bash
cd frontend
npm test
```

---

## 5. Fazit

Die Frontend-Tests decken alle drei implementierten User Stories ab. Die Mock-Strategie entkoppelt die Tests vollständig vom Backend. Benutzeraktionen (Klick auf Filter-Buttons, Absenden des Formulars) werden realistisch mit `userEvent` simuliert.
