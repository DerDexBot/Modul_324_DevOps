# Modul 324 DevOps – ToDo-Applikation

**Projekt:** M324 Schul-Projekt | **Team:** Rudy & Martin | **Stack:** React · Spring Boot · MySQL · Docker · GitHub Actions

---

## Inhalt

- [Architektur](#architektur)
- [CI/CD-Pipeline](#cicd-pipeline)
- [Self-Hosted Runner](#self-hosted-runner)
- [Lokale Entwicklung](#lokale-entwicklung)
- [Tests ausführen](#tests-ausführen)
- [Dokumentation](#dokumentation)

---

## Architektur

```mermaid
flowchart LR
    subgraph Client["Browser"]
        FE["React + Vite\nlocalhost:5173"]
    end

    subgraph Server["Backend"]
        BE["Spring Boot\nlocalhost:8080"]
    end

    subgraph DB["Datenbank"]
        MY[("MySQL 8.4\nPort 3306")]
    end

    subgraph Registry["GitHub Container Registry"]
        IMG["ghcr.io/derdexbot/\ntodo-backend:latest"]
    end

    FE -- REST API\nHTTP/JSON --> BE
    BE -- JPA/Hibernate --> MY
    IMG -- docker run --> BE
```

---

## CI/CD-Pipeline

Jeder Push und Pull Request auf `main` löst automatisch die Pipelines aus.

```mermaid
flowchart TD
    DEV([Developer\ngit push]) --> MAIN[main Branch\nauf GitHub]

    MAIN --> CIB & CIF

    subgraph CIB_block["CI Backend  ·  ci.yml"]
        CIB["JDK 21 einrichten\n↓\nmvn verify\n31 Tests\n↓\nCodeQL Analyse"]
    end

    subgraph CIF_block["CI Frontend  ·  ci-frontend.yml"]
        CIF["Node.js 24 einrichten\n↓\nnpm ci\n↓\nJest – 9 Tests\n↓\nESLint\n↓\nVite Build → dist/"]
    end

    CIB --> GATE{CI Backend\nerfolgreich?}
    GATE -- Nein --> STOP([Kein Image\ngebaut])
    GATE -- Ja --> CD

    subgraph CD_block["CD  ·  cd.yml"]
        CD["JAR bauen\nmvn package -DskipTests\n↓\nDocker Image bauen\n↓\nPush zu ghcr.io"]
    end

    CD --> TAG1([todo-backend:latest])
    CD --> TAG2([todo-backend:sha-&lt;commit&gt;])
    CD --> JAR([todo-backend-&lt;run&gt;.jar\nArtifact · 30 Tage])

    CIF --> FSTATUS([todo-frontend-&lt;run&gt;.zip\nArtifact · 30 Tage])
```

> **Alle drei Pipelines laufen auf dem lokalen Self-Hosted Runner** (Docker-Container auf dem eigenen Rechner).

---

## Self-Hosted Runner

Die GitHub-Actions-Jobs werden nicht auf GitHub-VMs, sondern auf einem **lokalen Docker-Container** ausgeführt. Der Runner verbindet sich via HTTPS zu GitHub und holt Jobs ab – kein eingehender Port nötig.

```mermaid
sequenceDiagram
    participant GH as GitHub
    participant R as Runner (Docker)
    participant D as Docker Daemon (Host)
    participant GHCR as ghcr.io

    GH->>R: Job bereitstellen (polling)
    R->>R: Schritte ausführen (Tests, Build)
    R->>D: docker build (via Socket-Mount)
    D->>GHCR: docker push (CD-Pipeline)
    R->>GH: Ergebnis melden
```

### Runner starten

**1. PAT erstellen**

GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
- Scope: **`repo`** (vollständig)

**2. `.env`-Datei anlegen**

```bash
cd runner
cp .env.example .env
```

```env
REPO_URL=https://github.com/DerDexBot/Modul_324_DevOps
ACCESS_TOKEN=ghp_DEIN_TOKEN_HIER
RUNNER_NAME=local-docker-runner
RUNNER_LABELS=self-hosted,linux,x64
```

**3. Runner starten**

```bash
docker compose up -d
```

**4. Status prüfen**

GitHub → Repository → Settings → Actions → Runners → Runner erscheint als **Idle**

```mermaid
flowchart LR
    subgraph Rechner["Lokaler Rechner (Windows 11)"]
        subgraph DockerDesktop["Docker Desktop (WSL2)"]
            R["github-runner\nLinux-Container"]
            SOCK["Docker-Socket\n/var/run/docker.sock"]
            R -- nutzt --> SOCK
        end
        DAEMON["Docker Daemon"]
        SOCK --> DAEMON
    end

    R -- HTTPS polling --> GH["GitHub Actions API"]
    DAEMON -- push --> GHCR["ghcr.io"]
```

---

## Lokale Entwicklung

### Voraussetzungen

- Java 21
- Node.js 24
- Docker Desktop
- Maven

### Backend starten

```bash
cd backend
./mvnw spring-boot:run
# Läuft auf http://localhost:8080
```

> Für Persistenz: MySQL über Docker Compose starten (siehe `backend/`).

### Frontend starten

```bash
cd frontend
npm install
npm run dev
# Läuft auf http://localhost:5173
```

---

## Tests ausführen

### Backend (31 Tests)

```bash
cd backend
./mvnw verify
```

| Schicht | Testklasse | Tests |
|---|---|---|
| Repository | `TaskRepositoryTest` | 9 |
| Service | `TaskServiceTest` | 10 |
| Controller | `TaskControllerTest` | 11 |
| Kontext | `DemoApplicationTests` | 1 |

### Frontend (9 Tests)

```bash
cd frontend
npm test -- --watchAll=false
```

| Kategorie | Tests |
|---|---|
| Grundfunktionen (Laden, Erstellen, Validierung) | 3 |
| US-20: Filter (Alle / Offen / Erledigt) | 3 |
| US-21: Fortschrittsbalken | 3 |

---

## Dokumentation

Alle Docs liegen unter `backend/docs/`:

| Thema | Pfad |
|---|---|
| CI Frontend | `docs/CI/ci-frontend-dokumentation.md` |
| Self-Hosted Runner | `docs/CI/runner-dokumentation.md` |
| CD / Docker | `docs/CD/cd-dokumentation.md` |
| Testplan | `docs/Testing/testplan.md` |
| Testdurchführung | `docs/Testing/testdurchfuehrung.md` |
| Testprotokolle | `docs/Testing/testprotokoll.md` |
| Branching-Strategie | `docs/Branching-Strategie/branching-strategie.md` |
| Pull Requests | `docs/Pull-Requests/pull-requests.md` |
| User Stories | `docs/userStories/userStories.md` |
| Arbeitsjournale | `docs/Arbeitsjournale/` |
