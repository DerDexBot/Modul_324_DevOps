# Pull Requests – Modul 324 DevOps

**Datum:** 22.05.2026  
**Beteiligte:** Rudy und Martin

---

## Ausgangslage

Unser Projekt liegt auf GitHub. Beide Entwickler arbeiten mit Feature-Branches gemäss GitHub Flow.  
Damit Änderungen kontrolliert und geprüft in den `main`-Branch übernommen werden können, setzen wir Pull Requests ein.

---

## Was ist ein Pull Request?

Ein Pull Request (kurz PR) ist eine Anfrage, Änderungen aus einem Branch in einen anderen zu übernehmen — meistens in `main`.

Der Begriff kommt von Git: Man „pulled" die eigenen Änderungen in den Ziel-Branch.  
In GitLab wird dasselbe als **Merge Request** bezeichnet — gemeint ist dasselbe Konzept.

Ein Pull Request ist nicht nur ein technischer Vorgang, sondern auch ein **Review-Prozess**:  
Bevor Änderungen übernommen werden, kann ein anderer Entwickler den Code prüfen, Kommentare hinterlassen und die Änderungen entweder freigeben oder Korrekturen verlangen.

---

## Funktionsweise von Pull Requests auf GitHub

### Ablauf

1. Entwickler erstellt einen Feature-Branch von `main`
2. Änderungen werden auf dem Branch committed und gepusht
3. Auf GitHub wird ein Pull Request erstellt: Base `main` ← Compare `feature/...`
4. Ein anderer Entwickler reviewed den PR (Kommentare, Fragen, Approve oder Request Changes)
5. Nach dem Approve wird der PR gemergt
6. Der Feature-Branch wird gelöscht

### Bestandteile eines Pull Requests auf GitHub

- **Titel** – kurze Zusammenfassung der Änderung
- **Beschreibung** – detailliertere Erklärung was geändert wurde und warum
- **Diff-Ansicht** – zeigt exakt welche Zeilen hinzugefügt oder entfernt wurden
- **Kommentare** – Reviewer können direkt auf einzelne Codezeilen kommentieren
- **Review-Status** – Approved / Request Changes / Comment
- **Merge-Button** – erst nach Freigabe verfügbar (wenn Branch Protection aktiv)

---

## Schritte für einen erfolgreichen Pull Request

### 1. Branch erstellen und Änderungen committen

```bash
git checkout -b feature/meine-aenderung
# Änderungen vornehmen
git add .
git commit -m "Beschreibung der Änderung"
git push origin feature/meine-aenderung
```

### 2. Pull Request auf GitHub erstellen

- Auf GitHub das Repository öffnen
- Den Button **"Compare & pull request"** klicken (erscheint nach dem Push automatisch)
- Titel und Beschreibung ausfüllen
- Sicherstellen: Base ist `main`, Compare ist der eigene Feature-Branch
- **"Create pull request"** klicken

### 3. Review durch den anderen Entwickler

- Reviewer öffnet den PR auf GitHub
- Wechselt auf den Tab **"Files changed"**
- Liest den Diff und hinterlässt Kommentare direkt auf Codezeilen
- Wählt am Ende eine der drei Optionen:
  - **Approve** – Änderung ist in Ordnung, kann gemergt werden
  - **Request changes** – Korrekturen notwendig, bevor gemergt wird
  - **Comment** – Kommentar ohne direkte Entscheidung

### 4. Merge durchführen

- Nach dem Approve klickt der Autor auf **"Merge pull request"**
- Merge-Methode wählen (Merge Commit, Squash, Rebase)
- Wir verwenden **Merge Commit**, damit die Branch-Historie sichtbar bleibt
- Branch nach dem Merge löschen mit **"Delete branch"**

---

## Gegenseitige Änderungen via Pull Request

Im Rahmen dieser Aufgabe haben wir jeweils einen PR für den anderen erstellt und reviewed:

| PR | Autor | Reviewer | Inhalt |
|---|---|---|---|
| `feature/test-Rudy` → `main` | Rudy | Martin | Testbranch mit `test.txt` |
| `feature/test-Martin` → `main` | Martin | Rudy | Testbranch mit `test.txt` |

Beide PRs wurden nach einem Review mit mindestens einem Kommentar gemergt.

---

## Nutzen von Pull Requests

### Vorteile

- **Qualitätssicherung** – jede Änderung wird vor dem Merge von einem anderen Entwickler geprüft
- **Wissensaustausch** – beide Entwickler kennen den Code des anderen, nicht nur ihren eigenen Bereich
- **Nachvollziehbarkeit** – die gesamte Diskussion zu einer Änderung ist im PR dokumentiert
- **Fehlervermeidung** – vier Augen sehen mehr als zwei; Fehler werden früh erkannt
- **Klare Abnahme** – nichts landet auf `main` ohne bewusste Freigabe

### Nachteile

- **Zeitaufwand** – PRs müssen erstellt, reviewed und gemergt werden, was zusätzliche Zeit kostet
- **Wartezeit** – der Autor muss auf den Review des anderen warten, bevor er weiterarbeiten kann
- **Potenzielle Merge-Konflikte** – wenn lange auf dem Branch gearbeitet wird, kann `main` inzwischen weiterlaufen

---

## Einfluss auf die Code-Qualität

Pull Requests haben in unserem Projekt die Codequalität positiv beeinflusst:

- Änderungen wurden bewusst formuliert und nicht einfach direkt gepusht
- Der Reviewer hat eine andere Perspektive auf denselben Code
- Kommentare im Review haben uns geholfen, Dinge zu hinterfragen
- Die Verpflichtung, einen PR zu erstellen, zwingt dazu, Änderungen sauber abzuschliessen

**Fazit zur Code-Qualität:**  
Pull Requests erleichtern die Zusammenarbeit, erhöhen die Codequalität und schaffen Transparenz — auch wenn sie kurzfristig mehr Aufwand bedeuten. Für ein Team-Projekt wie unseres überwiegen die Vorteile klar.

---

## Erkenntnisse

- Pull Requests sind mehr als ein technischer Schritt — sie sind ein Kommunikations- und Review-Prozess
- Die Diff-Ansicht auf GitHub macht es einfach, genau zu sehen was geändert wurde
- Kommentare direkt auf Codezeilen machen Reviews präzise und nachvollziehbar
- Branch Protection auf `main` stellt sicher, dass kein PR ohne Review gemergt werden kann
- Das Löschen des Branches nach dem Merge hält das Repository übersichtlich

---

## Fazit

Pull Requests sind ein zentrales Werkzeug in der modernen Softwareentwicklung.  
Sie erzwingen einen Review-Schritt, der die Qualität sichert und gleichzeitig sicherstellt, dass alle Teammitglieder über Änderungen informiert sind.  
In Verbindung mit GitHub Flow und Branch Protection bilden Pull Requests das Herzstück unseres Entwicklungsprozesses.