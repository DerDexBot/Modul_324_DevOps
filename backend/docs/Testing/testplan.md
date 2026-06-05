# Testplan – Backend ToDo-App

**Projekt:** Modul 324 DevOps – ToDo-Applikation  
**Komponente:** Backend (Spring Boot)  
**Version:** 1.0  
**Datum:** 05.06.2026  
**Autoren:** Rudy, Martin

---

## 1. Ziel und Scope

Dieser Testplan beschreibt die Teststrategie für das Spring-Boot-Backend der ToDo-Applikation. Er legt fest, welche Schichten getestet werden, welche Testarten zum Einsatz kommen und welche Werkzeuge verwendet werden.

**Im Scope:**
- REST-Schnittstelle (Controller-Layer)
- Geschäftslogik (Service-Layer)
- Datenbankzugriff (Repository-Layer)
- Eingabevalidierung (`@NotBlank`, Whitespace-Trimming)
- Fehlerbehandlung (HTTP-Statuscodes 400, 404, 201, 204)

**Nicht im Scope:**
- Frontend (React/Vite)
- Netzwerkkonfiguration / Infrastruktur
- Performance-/Lasttests
- Manuelle End-to-End-Tests im Browser

---

## 2. Teststrategie – Testpyramide

Das Projekt folgt der klassischen Testpyramide mit drei Ebenen. Jede Schicht hat einen klar definierten Testzweck:

```
         ┌──────────────────────────┐
         │   Integrationstests      │  ← TaskControllerTest (MockMvc)
         │   (wenige, langsamer)    │
         ├──────────────────────────┤
         │   Service-Unit-Tests     │  ← TaskServiceTest (Mockito)
         │   (mittel, schnell)      │
         ├──────────────────────────┤
         │   Repository-Tests       │  ← TaskRepositoryTest (@DataJpaTest)
         │   (viele, sehr schnell)  │
         └──────────────────────────┘
```

| Schicht | Testklasse | Testart | Spring-Kontext |
|---|---|---|---|
| Repository | `TaskRepositoryTest` | JPA-Slicetest | Nur JPA-Layer |
| Service | `TaskServiceTest` | Unit-Test | Kein Kontext |
| Controller | `TaskControllerTest` | Integrationstest | Vollständig |

---

## 3. Testarten im Detail

### 3.1 Repository-Tests (`@DataJpaTest`)

**Zweck:** Prüft, ob die JPA-Entities korrekt persistiert, geladen und gelöscht werden.

**Ansatz:** Die Annotation `@DataJpaTest` lädt ausschliesslich den JPA-Layer (Entities, Repositories, Hibernate). Service- und Controller-Beans werden **nicht** gestartet. Spring verwendet automatisch die H2-Inmemory-Datenbank.

**Vorteil:** Sehr schnell, kein vollständiger Anwendungsstart nötig, kein externer Datenbankdienst erforderlich.

---

### 3.2 Service-Unit-Tests (Mockito)

**Zweck:** Prüft die Geschäftslogik im `TaskService` vollständig isoliert.

**Ansatz:** Das `TaskRepository` wird mit Mockito gemockt (`@Mock`). Der Service erhält das gemockte Repository per `@InjectMocks`. Es findet kein Datenbankzugriff und kein Spring-Start statt.

**Vorteil:** Schnellste Testart, testet ausschliesslich eigene Logik (Trimming, 404-Handling usw.) ohne Abhängigkeiten.

---

### 3.3 Controller-Integrationstests (`@SpringBootTest` + MockMvc)

**Zweck:** Prüft die vollständige HTTP-Schnittstelle des Backends – von der HTTP-Anfrage über Controller und Service bis zur Datenbank.

**Ansatz:** `@SpringBootTest` startet den gesamten Spring-Kontext. `@AutoConfigureMockMvc` stellt ein `MockMvc`-Objekt bereit, das HTTP-Anfragen simuliert, ohne einen echten Server zu starten. Die Tests verwenden die H2-Datenbank aus der Test-Konfiguration.

**Vorteil:** Prüft das Zusammenspiel aller Schichten, deckt HTTP-Statuscodes und JSON-Inhalte ab.

---

## 4. Testumgebung

### Produktionsumgebung
| Parameter | Wert |
|---|---|
| Datenbank | MySQL 8.4 (Docker Compose) |
| Konfiguration | `src/main/resources/application.properties` |
| Port | 8080 |

### Testumgebung
| Parameter | Wert |
|---|---|
| Datenbank | H2 In-Memory (`jdbc:h2:mem:testdb`) |
| Konfiguration | `src/test/resources/application.properties` |
| DDL | `create-drop` (Schema wird bei Teststart erstellt, danach gelöscht) |
| Isolation | `@BeforeEach` löscht alle Einträge vor jedem Test |

Die Testumgebung ist vollständig von der Produktionsdatenbank **entkoppelt**. Tests können ohne Docker, ohne MySQL und ohne Netzwerkkonfiguration ausgeführt werden.

---

## 5. Verwendete Technologien und Bibliotheken

| Bibliothek | Version | Zweck |
|---|---|---|
| JUnit 5 | via Spring Boot | Test-Framework, `@Test`, `@BeforeEach`, `@DisplayName` |
| Mockito | via Spring Boot | Mocking des Repositories in Service-Tests |
| AssertJ | via Spring Boot | Lesbare Assertions (`assertThat`, `assertThatThrownBy`) |
| Spring MockMvc | via Spring Boot | HTTP-Request-Simulation ohne echten Server |
| H2 Database | `<scope>test</scope>` | Inmemory-Datenbank für Testumgebung |
| Jackson (ObjectMapper) | via Spring Boot | JSON-Serialisierung in Controller-Tests |

---

## 6. Testdaten und Isolation

- Jeder Test ist **unabhängig** und darf keine Annahmen über den Zustand aus einem vorherigen Test machen.
- `@BeforeEach` mit `taskRepository.deleteAll()` stellt eine saubere Ausgangslage sicher.
- Repository-Tests laufen zusätzlich in einer Transaktion, die nach dem Test zurückgerollt wird (`@DataJpaTest`-Standard).
- Testdaten werden direkt im Test erstellt und nicht aus externen Dateien geladen.

---

## 7. Akzeptanzkriterien für Tests

Ein Test gilt als **bestanden**, wenn:
- Der HTTP-Statuscode mit dem erwarteten Wert übereinstimmt
- Der JSON-Inhalt der Antwort die erwarteten Felder und Werte enthält
- Keine unerwartete Exception geworfen wird
- Im Fehlerfall die korrekte `ResponseStatusException` (HTTP 404 / 400) ausgelöst wird

---

## 8. CI-Integration

Alle Tests werden bei jedem Push und Pull Request auf `main` automatisch über GitHub Actions ausgeführt (`mvn verify`). Ein fehlgeschlagener Test blockiert den Merge in den Hauptbranch.

Zusätzlich führt die Pipeline eine statische Code-Analyse mit **CodeQL** durch (Kategorie `security-and-quality`).

Konfiguration: `.github/workflows/ci.yml`