# Self-Hosted GitHub Actions Runner – Dokumentation

**Projekt:** Modul 324 DevOps – ToDo-Applikation  
**Datum:** 12.06.2026  
**Autoren:** Rudy, Martin

---

## 1. Was ist ein Self-Hosted Runner?

GitHub Actions bietet zwei Arten von Ausführungsumgebungen:

| Typ | Beschreibung | Kosten |
|---|---|---|
| **GitHub-hosted** | GitHub stellt eine VM (`ubuntu-latest` etc.) bereit | Kostenlos bis 2000 Min/Monat |
| **Self-hosted** | Eigener Rechner/Container führt die Jobs aus | Keine Zeitbeschränkung, volle Kontrolle |

Ein Self-Hosted Runner ist ein Prozess, der auf einem eigenen Rechner läuft, sich mit GitHub verbindet und auf eingehende Workflow-Jobs wartet. Sobald GitHub einen Job für diesen Runner scheduled, zieht der Runner die Aufgaben von GitHub und führt sie lokal aus.

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant GH as GitHub
    participant Runner as Lokaler Runner (Docker)

    Dev->>GH: git push
    GH->>GH: Workflow-Job erstellen
    GH-->>Runner: Job bereitstellen (polling)
    Runner->>GH: Job abholen
    Runner->>Runner: Schritte ausführen (Tests, Build, Docker)
    Runner->>GH: Ergebnis melden (success/failure)
    GH-->>Dev: Status anzeigen
```

---

## 2. Architektur: Runner in Docker

Der Runner läuft als Docker-Container auf dem lokalen Rechner. Er verbindet sich via HTTPS mit den GitHub-Servern – kein eingehender Port muss geöffnet werden.

```mermaid
flowchart LR
    subgraph Windows["Windows 11 – Lokaler Rechner"]
        subgraph Docker["Docker Desktop (WSL2)"]
            R["myoung34/github-runner\nLinux-Container\nLabels: self-hosted, linux, x64"]
            Sock["/var/run/docker.sock\n(Docker-Socket)"]
            R -- nutzt --> Sock
        end
        D["Docker Daemon\n(Host)"]
        Sock -- verbunden --> D
    end

    R -- HTTPS polling --> GH["GitHub\nActions API"]
    D -- push --> GHCR["ghcr.io\n(Docker Registry)"]
```

**Docker-Socket-Mount:** Der Runner-Container bekommt Zugriff auf den Docker-Daemon des Host-Systems. So kann der CD-Workflow (`docker build`, `docker push`) direkt ausgeführt werden, ohne Docker im Docker zu installieren.

---

## 3. Einrichtung Schritt für Schritt

### Schritt 1: PAT erstellen (einmalig)

1. GitHub öffnen → Eigenes Profil → **Settings**
2. Links unten: **Developer settings**
3. **Personal access tokens** → **Tokens (classic)**
4. **Generate new token (classic)**
5. Name: `M324-Runner`, Expiration: nach Bedarf
6. Scope: **`repo`** (vollständig ankreuzen)
7. Token kopieren (nur einmal sichtbar!)

### Schritt 2: `.env`-Datei erstellen

```bash
# Im runner/-Verzeichnis
cd runner
cp .env.example .env
```

`.env` ausfüllen:
```env
REPO_URL=https://github.com/DerDexBot/Modul_324_DevOps
ACCESS_TOKEN=ghp_DEIN_TOKEN_HIER
RUNNER_NAME=local-docker-runner
RUNNER_LABELS=self-hosted,linux,x64
```

### Schritt 3: Runner starten

```bash
# Im runner/-Verzeichnis
docker compose up -d
```

Der Runner registriert sich automatisch bei GitHub und wartet auf Jobs.

### Schritt 4: Runner in GitHub prüfen

**GitHub → Repository → Settings → Actions → Runners**

Der Runner erscheint dort als **Idle** (bereit) wenn er läuft.

### Schritt 5: Runner stoppen / neu starten

```bash
# Stoppen
docker compose down

# Neustart
docker compose restart

# Logs ansehen
docker compose logs -f
```

---

## 4. Konfigurationsdateien

### `runner/docker-compose.yml`

```yaml
name: github-runner

services:
  runner:
    image: myoung34/github-runner:latest
    restart: unless-stopped
    environment:
      REPO_URL: ${REPO_URL}
      RUNNER_NAME: ${RUNNER_NAME:-local-docker-runner}
      ACCESS_TOKEN: ${ACCESS_TOKEN}
      RUNNER_WORKDIR: /tmp/github-runner-work
      LABELS: ${RUNNER_LABELS:-self-hosted,linux,x64}
      RUNNER_SCOPE: repo
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - runner_work:/tmp/github-runner-work
    security_opt:
      - no-new-privileges:true

volumes:
  runner_work:
    driver: local
```

**Wichtige Parameter:**

| Parameter | Wert | Erklärung |
|---|---|---|
| `image` | `myoung34/github-runner:latest` | Vorgefertigtes Runner-Image mit Auto-Registrierung |
| `restart: unless-stopped` | – | Container startet automatisch nach Reboot |
| `ACCESS_TOKEN` | PAT aus `.env` | Ermöglicht automatische Re-Registrierung bei Neustart |
| `RUNNER_SCOPE: repo` | – | Runner ist nur für dieses Repository registriert |
| `/var/run/docker.sock` | Socket-Mount | Zugriff auf Docker-Daemon des Hosts |
| `runner_work` | Docker Volume | Persistenter Arbeitsbereich für Job-Dateien |
| `no-new-privileges` | Security-Option | Container kann keine höheren Rechte erlangen |

---

## 5. Workflow-Konfiguration: `runs-on`

Alle drei Workflow-Dateien wurden auf den lokalen Runner umgestellt:

```yaml
# Vorher (GitHub-hosted)
runs-on: ubuntu-latest

# Nachher (Self-hosted)
runs-on: [self-hosted, linux, x64]
```

Die Labels `self-hosted`, `linux`, `x64` müssen mit den in `RUNNER_LABELS` definierten Labels übereinstimmen. GitHub wählt automatisch einen passenden Runner aus, wenn ein Job scheduled wird.

**Betroffene Dateien:**

| Workflow | Datei |
|---|---|
| CI Backend | `.github/workflows/ci.yml` |
| CI Frontend | `.github/workflows/ci-frontend.yml` |
| CD | `.github/workflows/cd.yml` |

---

## 6. Vergleich: GitHub-hosted vs. Self-hosted

| Kriterium | GitHub-hosted | Self-hosted (Docker) |
|---|---|---|
| **Setup** | Keine | Docker + PAT + `.env` |
| **Kosten** | 2000 Min/Monat kostenlos | Unbegrenzt (eigener Strom/Hardware) |
| **Geschwindigkeit** | Standard | Schneller bei grossen Caches (lokal) |
| **Kontrolle** | Keine | Vollständig |
| **Verfügbarkeit** | Immer | Nur wenn Container läuft |
| **Docker-Zugriff** | Begrenzt | Voll (Socket-Mount) |
| **Internet-Anforderung** | Nein (GitHub-Seite) | Ja (Runner muss GitHub erreichen) |

---

## 7. Sicherheitshinweise

- Die `.env`-Datei enthält den PAT und darf **niemals** committed werden (`.gitignore` in `runner/` vorhanden)
- Der PAT hat `repo`-Scope – Zugriff auf das gesamte Repository. Token regelmässig rotieren.
- Der Docker-Socket-Mount gibt dem Container theoretisch vollen Host-Zugriff. Nur für vertrauenswürdige Repos verwenden (kein Self-Hosted Runner für öffentliche Fork-PRs!).
- `no-new-privileges: true` verhindert Privilege-Escalation im Container.

---

## 8. Fehlerbehebung

| Problem | Mögliche Ursache | Lösung |
|---|---|---|
| Runner erscheint nicht in GitHub | Falscher `ACCESS_TOKEN` oder `REPO_URL` | `.env` prüfen, Token neu generieren |
| Jobs bleiben in "Queued" | Runner ist gestoppt | `docker compose up -d` im runner/-Ordner |
| Docker-Befehle schlagen fehl | Socket nicht gemountet | `docker compose down && docker compose up -d` |
| Runner deregistriert sich | PAT abgelaufen | Neuen PAT erstellen und `.env` aktualisieren |
| `Permission denied` auf Socket | Docker Desktop nicht gestartet | Docker Desktop starten |
| `mvn: command not found` (exit 127) | Maven nicht im Runner-Image | Siehe Abschnitt 9.2 |
| Container crasht sofort, startet neu | Falsche `REPO_URL` in `.env` | Siehe Abschnitt 9.1 |

---

## 9. Bekannte Probleme & Lösungen (aus der Praxis)

### 9.1 Container-Crash-Loop: `REPO_URL` Platzhalter

**Symptom:** Der Container startet, crasht sofort und wird von `restart: unless-stopped` endlos neu gestartet. `docker compose logs` zeigt:
```
curl: (22) The requested URL returned error: 404
Invalid configuration provided for token. Terminating unattended configuration.
```

**Ursache:** In `runner/.env` wurde der Platzhalter `REPO_NAME` aus `.env.example` nicht ersetzt:
```env
# Falsch – Platzhalter nicht ersetzt
REPO_URL=https://github.com/DerDexBot/REPO_NAME

# Richtig
REPO_URL=https://github.com/DerDexBot/Modul_324_DevOps
```

**Lösung:** `.env` öffnen, `REPO_NAME` durch den tatsächlichen Repository-Namen ersetzen, dann `docker compose up -d`.

**Diagnose-Befehl:**
```bash
docker compose logs --tail=20
```

---

### 9.2 `mvn: command not found` (exit code 127)

**Symptom:** CI Backend schlägt in ~13 Sekunden fehl. Der Job-Log auf GitHub zeigt:
```
/tmp/github-runner-work/_temp/xxx.sh: line 1: mvn: command not found
##[error]Process completed with exit code 127.
```

**Ursache:** `myoung34/github-runner` basiert auf einem minimalen Ubuntu-Image – Maven ist **nicht** vorinstalliert. `actions/setup-java` installiert nur den JDK, nicht Maven.

> **Wichtig:** Auf GitHub-hosted `ubuntu-latest` Runnern ist Maven immer vorinstalliert. Beim Wechsel auf einen Self-Hosted Runner muss Maven explizit bereitgestellt werden.

**Lösung:** In `ci.yml` und `cd.yml` vor dem Maven-Schritt einfügen:
```yaml
- name: Install Maven
  run: sudo apt-get update -qq && sudo apt-get install -y maven
```

**Vergleich vorinstallierte Tools:**

| Tool | GitHub-hosted `ubuntu-latest` | `myoung34/github-runner` |
|---|---|---|
| Java (JDK) | ✅ mehrere Versionen | ❌ via `actions/setup-java` |
| Maven | ✅ vorinstalliert | ❌ manuell installieren |
| Node.js | ✅ mehrere Versionen | ❌ via `actions/setup-node` |
| Docker CLI | ✅ vorinstalliert | ✅ vorinstalliert |
| Git | ✅ vorinstalliert | ✅ vorinstalliert |
