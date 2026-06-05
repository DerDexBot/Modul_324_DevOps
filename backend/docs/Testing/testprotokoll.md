# Testprotokoll – Backend ToDo-App

**Projekt:** Modul 324 DevOps – ToDo-Applikation  
**Komponente:** Backend (Spring Boot)  
**Datum der Durchführung:** 29.05.2026  
**Durchgeführt von:** Rudy, Martin  
**Testumgebung:** H2 In-Memory, JDK 21, `mvn verify`  
**Gesamtergebnis:** Alle 31 Tests bestanden

---

## Übersicht

| Testklasse | Testart | Anzahl Tests | Bestanden | Fehlgeschlagen |
|---|---|---|---|---|
| `DemoApplicationTests` | Kontexttest | 1 | 1 | 0 |
| `TaskRepositoryTest` | JPA-Slicetest | 9 | 9 | 0 |
| `TaskServiceTest` | Unit-Test (Mockito) | 10 | 10 | 0 |
| `TaskControllerTest` | Integrationstest (MockMvc) | 11 | 11 | 0 |
| **Total** | | **31** | **31** | **0** |

---

## 1. Kontexttest – `DemoApplicationTests`

**Testart:** Spring Context Test (`@SpringBootTest`)  
**Zweck:** Stellt sicher, dass der gesamte Spring-Kontext ohne Fehler startet.

| # | Testmethode | Beschreibung | Ergebnis |
|---|---|---|---|
| 1 | `contextLoads` | Spring-Kontext startet ohne Fehler | Bestanden |

---

## 2. Repository-Tests – `TaskRepositoryTest`

**Testart:** JPA-Slicetest (`@DataJpaTest`)  
**Datenbank:** H2 In-Memory  
**Zweck:** Prüft den direkten Datenbankzugriff über Spring Data JPA.

### `save` – Persistierung

| # | Testmethode | Beschreibung | Erwartetes Ergebnis | Ergebnis |
|---|---|---|---|---|
| 2 | `save_shouldPersistTaskWithGeneratedId` | Neue Task wird gespeichert und erhält eine generierte ID | `id` ≠ null, `taskdescription` = "Persistente Aufgabe", `done` = false | Bestanden |
| 3 | `save_shouldPersistDoneFlag` | Das `done`-Flag wird korrekt mit `true` persistiert | `done` = true | Bestanden |

### `findById` – Einzelsuche

| # | Testmethode | Beschreibung | Erwartetes Ergebnis | Ergebnis |
|---|---|---|---|---|
| 4 | `findById_shouldReturnPersistedTask` | Gespeicherte Task wird über ID gefunden | `Optional` ist befüllt, Beschreibung korrekt | Bestanden |
| 5 | `findById_withUnknownId_shouldReturnEmpty` | Unbekannte ID gibt leeres Optional zurück | `Optional.empty()` | Bestanden |

### `findAll` – Gesamtabfrage

| # | Testmethode | Beschreibung | Erwartetes Ergebnis | Ergebnis |
|---|---|---|---|---|
| 6 | `findAll_shouldReturnAllPersistedTasks` | Alle 3 gespeicherten Tasks werden zurückgegeben | Liste mit 3 Einträgen | Bestanden |
| 7 | `findAll_shouldReturnEmptyListWhenNoTasksExist` | Leere Datenbank liefert leere Liste | Leere Liste | Bestanden |

### `deleteById` – Löschen

| # | Testmethode | Beschreibung | Erwartetes Ergebnis | Ergebnis |
|---|---|---|---|---|
| 8 | `deleteById_shouldRemoveTask` | Task wird dauerhaft aus der Datenbank entfernt | `findById` gibt danach `Optional.empty()` zurück | Bestanden |

### `existsById` – Existenzprüfung

| # | Testmethode | Beschreibung | Erwartetes Ergebnis | Ergebnis |
|---|---|---|---|---|
| 9 | `existsById_shouldReturnTrueForExistingTask` | Vorhandene Task: `existsById` = true | `true` | Bestanden |
| 10 | `existsById_withUnknownId_shouldReturnFalse` | Unbekannte ID: `existsById` = false | `false` | Bestanden |

---

## 3. Service-Tests – `TaskServiceTest`

**Testart:** Unit-Test mit Mockito (`@ExtendWith(MockitoExtension.class)`)  
**Datenbank:** Kein Datenbankzugriff (Repository gemockt)  
**Zweck:** Prüft die Geschäftslogik im `TaskService` vollständig isoliert.

### `findAll` – Alle Tasks laden

| # | Testmethode | Beschreibung | Erwartetes Ergebnis | Ergebnis |
|---|---|---|---|---|
| 11 | `findAll_shouldReturnAllTasks` | Repository gibt 2 Tasks zurück, Service leitet weiter | Liste mit 2 Einträgen, `findAll()` 1× aufgerufen | Bestanden |
| 12 | `findAll_shouldReturnEmptyListWhenNoTasks` | Repository gibt leere Liste zurück | Leere Liste | Bestanden |

### `create` – Task erstellen

| # | Testmethode | Beschreibung | Erwartetes Ergebnis | Ergebnis |
|---|---|---|---|---|
| 13 | `create_shouldSaveAndReturnTask` | Task wird gespeichert und zurückgegeben | Beschreibung korrekt, `save()` 1× aufgerufen | Bestanden |
| 14 | `create_shouldTrimWhitespaceFromDescription` | Leerzeichen am Rand der Beschreibung werden entfernt | `"  Aufgabe  "` → `"Aufgabe"` | Bestanden |

### `update` – Task bearbeiten

| # | Testmethode | Beschreibung | Erwartetes Ergebnis | Ergebnis |
|---|---|---|---|---|
| 15 | `update_shouldUpdateAndReturnTask` | Bestehende Task erhält neue Beschreibung | Neue Beschreibung korrekt gespeichert | Bestanden |
| 16 | `update_withUnknownId_shouldThrow404` | Update mit unbekannter ID wirft 404 | `ResponseStatusException` mit HTTP 404 | Bestanden |

### `markDone` – Task erledigen

| # | Testmethode | Beschreibung | Erwartetes Ergebnis | Ergebnis |
|---|---|---|---|---|
| 17 | `markDone_shouldSetDoneFlagToTrue` | `done`-Flag wird auf `true` gesetzt | `task.isDone()` = true | Bestanden |
| 18 | `markDone_withUnknownId_shouldThrow404` | Unbekannte ID wirft 404 | `ResponseStatusException` mit HTTP 404 | Bestanden |

### `deleteById` – Task löschen

| # | Testmethode | Beschreibung | Erwartetes Ergebnis | Ergebnis |
|---|---|---|---|---|
| 19 | `deleteById_shouldCallRepositoryDelete` | `deleteById()` des Repositories wird genau einmal aufgerufen | `deleteById(1L)` 1× aufgerufen | Bestanden |
| 20 | `deleteById_withUnknownId_shouldThrow404` | Unbekannte ID wirft 404 | `ResponseStatusException` mit HTTP 404 | Bestanden |

---

## 4. Controller-Integrationstests – `TaskControllerTest`

**Testart:** Integrationstest (`@SpringBootTest` + `@AutoConfigureMockMvc`)  
**Datenbank:** H2 In-Memory (vollständiger Spring-Kontext)  
**Zweck:** Prüft die REST-Schnittstelle von HTTP-Anfrage bis Datenbank.

### `GET /tasks` – Alle Tasks abrufen

| # | Testmethode | Beschreibung | Erwarteter HTTP-Status | Erwarteter Body | Ergebnis |
|---|---|---|---|---|---|
| 21 | `getAllTasks_shouldReturnEmptyList` | Leere Datenbank liefert leere JSON-Liste | 200 OK | `[]` | Bestanden |
| 22 | `getAllTasks_shouldReturnAllTasks` | 2 gespeicherte Tasks werden zurückgegeben | 200 OK | Array mit 2 Objekten, korrekte Beschreibungen | Bestanden |

### `POST /tasks` – Task erstellen

| # | Testmethode | Beschreibung | Erwarteter HTTP-Status | Erwarteter Body | Ergebnis |
|---|---|---|---|---|---|
| 23 | `createTask_shouldReturn201WithCreatedTask` | Neue Task wird erstellt | 201 Created | `id` ≠ null, `done` = false, korrekte Beschreibung | Bestanden |
| 24 | `createTask_withBlankDescription_shouldReturn400` | Leere Beschreibung wird abgelehnt | 400 Bad Request | — | Bestanden |
| 25 | `createTask_shouldTrimWhitespace` | Leerzeichen werden beim Speichern entfernt | 201 Created | Beschreibung ohne Rand-Leerzeichen | Bestanden |

### `PUT /tasks/{id}` – Task bearbeiten

| # | Testmethode | Beschreibung | Erwarteter HTTP-Status | Erwarteter Body | Ergebnis |
|---|---|---|---|---|---|
| 26 | `updateTask_shouldReturnUpdatedTask` | Bestehende Task wird mit neuer Beschreibung aktualisiert | 200 OK | Neue Beschreibung, gleiche ID | Bestanden |
| 27 | `updateTask_withUnknownId_shouldReturn404` | Unbekannte ID liefert 404 | 404 Not Found | — | Bestanden |

### `PUT /tasks/{id}/done` – Task als erledigt markieren

| # | Testmethode | Beschreibung | Erwarteter HTTP-Status | Erwarteter Body | Ergebnis |
|---|---|---|---|---|---|
| 28 | `markTaskDone_shouldSetDoneToTrue` | Task wird als erledigt markiert | 200 OK | `done` = true | Bestanden |
| 29 | `markTaskDone_withUnknownId_shouldReturn404` | Unbekannte ID liefert 404 | 404 Not Found | — | Bestanden |

### `DELETE /tasks/{id}` – Task löschen

| # | Testmethode | Beschreibung | Erwarteter HTTP-Status | Erwarteter Body | Ergebnis |
|---|---|---|---|---|---|
| 30 | `deleteTask_shouldReturn204` | Task wird gelöscht | 204 No Content | Kein Body | Bestanden |
| 31 | `deleteTask_withUnknownId_shouldReturn404` | Unbekannte ID liefert 404 | 404 Not Found | — | Bestanden |

---

## 5. Fazit

Alle 31 automatisierten Tests wurden erfolgreich ausgeführt. Die dreischichtige Teststrategie deckt folgende Bereiche vollständig ab:

- **Datenbankzugriff:** Persistierung, Suche, Löschen und Existenzprüfung (Repository)
- **Geschäftslogik:** Whitespace-Trimming, 404-Fehlerbehandlung, korrekte Delegation an das Repository (Service)
- **HTTP-Schnittstelle:** Alle REST-Endpunkte mit Erfolgsfällen und Fehlerfällen (Controller)

Die Tests werden bei jedem Push auf `main` automatisch durch die CI-Pipeline ausgeführt.