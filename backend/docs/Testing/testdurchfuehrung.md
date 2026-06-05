# Testdurchführung – Backend ToDo-App

**Projekt:** Modul 324 DevOps – ToDo-Applikation  
**Komponente:** Backend (Spring Boot)  
**Datum:** 05.06.2026  
**Autoren:** Rudy, Martin

---

## 1. Voraussetzungen

Für die lokale Testausführung müssen folgende Komponenten installiert sein:

| Voraussetzung | Version | Hinweis |
|---|---|---|
| Java (JDK) | 21 | `java -version` prüfen |
| Maven | via `mvnw` | Wrapper ist im Projekt enthalten |
| MySQL / Docker | — | **Nicht** nötig für Tests (H2 wird verwendet) |

Die Tests verwenden eine H2-Inmemory-Datenbank. MySQL muss **nicht** laufen.

---

## 2. Teststruktur im Projekt

```
backend/
└── src/
    ├── main/
    │   └── resources/
    │       └── application.properties       ← MySQL-Konfiguration (Produktion)
    └── test/
        ├── java/com/example/demo/
        │   ├── DemoApplicationTests.java    ← Kontexttest
        │   ├── controller/
        │   │   └── TaskControllerTest.java  ← Integrationstests (MockMvc)
        │   ├── service/
        │   │   └── TaskServiceTest.java     ← Unit-Tests (Mockito)
        │   └── repository/
        │       └── TaskRepositoryTest.java  ← JPA-Tests (@DataJpaTest)
        └── resources/
            └── application.properties       ← H2-Konfiguration (Tests)
```

---

## 3. Tests lokal ausführen

### 3.1 Alle Tests ausführen

```bash
cd backend
./mvnw test
```

Führt alle Testklassen aus. Die Ausgabe zeigt pro Testklasse wie viele Tests bestanden haben.

### 3.2 Tests + Build-Verifikation (wie in CI)

```bash
cd backend
./mvnw verify
```

Entspricht exakt dem CI-Befehl. Führt alle Tests aus und überprüft den Build vollständig. Empfohlen vor jedem Pull Request.

### 3.3 Nur eine bestimmte Testklasse ausführen

```bash
# Nur Repository-Tests
./mvnw test -Dtest=TaskRepositoryTest

# Nur Service-Tests
./mvnw test -Dtest=TaskServiceTest

# Nur Controller-Tests
./mvnw test -Dtest=TaskControllerTest
```

### 3.4 Nur eine einzelne Testmethode ausführen

```bash
./mvnw test -Dtest=TaskServiceTest#create_shouldTrimWhitespaceFromDescription
```

---

## 4. Testergebnisse lesen

Nach `./mvnw test` erscheint am Ende eine Zusammenfassung:

```
[INFO] Results:
[INFO]
[INFO] Tests run: 31, Failures: 0, Errors: 0, Skipped: 0
[INFO]
[INFO] BUILD SUCCESS
```

Bei einem Fehler wird die fehlgeschlagene Testmethode mit dem Grund angegeben:

```
[ERROR] Tests run: 31, Failures: 1, Errors: 0, Skipped: 0
[ERROR]
[ERROR] TaskServiceTest.update_withUnknownId_shouldThrow404
  expected: 404 NOT_FOUND
   but was: 200 OK
```

Detaillierte Berichte liegen nach dem Test unter:

```
backend/target/surefire-reports/
```

---

## 5. Testumgebung (H2-Konfiguration)

Die Datei `src/test/resources/application.properties` wird **ausschliesslich beim Testen** aktiv und überschreibt die Produktionskonfiguration:

```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
```

Diese Konfiguration sorgt dafür, dass:
- Eine H2-Datenbank im Arbeitsspeicher verwendet wird (kein Docker, kein MySQL)
- Das Datenbankschema beim Start automatisch erstellt und am Ende gelöscht wird
- Keine Produktionsdaten berührt werden

---

## 6. Testdaten-Isolation

Jede Testklasse bereinigt die Datenbank vor jedem einzelnen Test:

```java
@BeforeEach
void setUp() {
    taskRepository.deleteAll();
}
```

Das bedeutet: Tests laufen **unabhängig** voneinander und können in beliebiger Reihenfolge ausgeführt werden.

Bei `TaskRepositoryTest` mit `@DataJpaTest` rollt Spring jede Testart zusätzlich in einer Transaktion zurück.

---

## 7. Automatische Testausführung in der CI-Pipeline

Die GitHub Actions Pipeline führt die Tests automatisch aus bei:
- **Push** auf den Branch `main`
- **Pull Request** auf `main`

### Pipeline-Ablauf (`.github/workflows/ci.yml`):

```
1. Code auschecken (actions/checkout@v4)
2. JDK 21 einrichten (actions/setup-java@v4, distribution: temurin)
3. CodeQL initialisieren (codeql-action/init@v3, language: java)
4. mvn verify ausführen → alle Tests laufen
5. CodeQL-Analyse durchführen (codeql-action/analyze@v3)
```

### Ergebnisse in GitHub einsehen:

- **Test-Status:** GitHub → Repository → Actions → letzter CI-Lauf → Job "Tests & CodeQL"
- **SAST-Findings:** GitHub → Security → Code scanning alerts

Ein fehlgeschlagener Test markiert den CI-Lauf als **rot** und blockiert den Merge per Branch-Schutzregel.

---

## 8. Häufige Fehler bei der lokalen Ausführung

| Problem | Ursache | Lösung |
|---|---|---|
| `Connection refused` zu MySQL | MySQL läuft, aber Tests verwenden H2 | `src/test/resources/application.properties` prüfen |
| `ClassNotFoundException: org.h2.Driver` | H2-Dependency fehlt | In `pom.xml` prüfen: `<scope>test</scope>` |
| `Port 8080 already in use` | Anderer Spring-Server läuft | Server stoppen oder `server.port` in Test-Properties setzen |
| `NullPointerException` in Mockito | `@InjectMocks` ohne `@ExtendWith` | `@ExtendWith(MockitoExtension.class)` über der Klasse ergänzen |