# Branching-Strategie – Modul 324 DevOps

**Datum:** 22.05.2026  
**Beteiligte:** Rudy und Martin

---

## Ausgangslage

Unser Projekt ist in einem GitHub-Repository abgelegt.  
Beide Teammitglieder haben gleichermassen Zugang zum Repository und arbeiten gemeinsam an der ToDo-Anwendung.

Da mehrere Personen gleichzeitig am gleichen Projekt arbeiten, brauchen wir eine klare Strategie, wie wir Branches verwalten und Änderungen zurück in den Hauptzweig bringen.

---

## Recherche: Branching-Strategien

Wir haben uns vier verbreitete Branching-Strategien angeschaut und verglichen.

### 1. Git Flow

Git Flow verwendet mehrere langlebige Branches:

- `main` – enthält nur produktionsreife Versionen
- `develop` – Integrationsbranch für Features
- `feature/*` – für jede neue Funktion ein eigener Branch
- `release/*` – zur Vorbereitung eines neuen Releases
- `hotfix/*` – für dringende Korrekturen direkt auf `main`

Jede Änderung durchläuft mehrere Stufen, bevor sie auf `main` landet.

### 2. GitHub Flow

GitHub Flow ist eine vereinfachte Variante:

- Es gibt nur `main` als dauerhaften Branch
- Für jedes Feature oder jede Änderung wird ein kurzlebiger Branch erstellt
- Änderungen kommen via Pull Request zurück auf `main`
- Nach dem Merge wird direkt deployed

### 3. Feature Branching

Ähnlich wie GitHub Flow, jedoch ohne den Fokus auf kontinuierliches Deployment:

- Jede Funktion bekommt einen eigenen Branch
- Branches können länger offen bleiben
- Merge erfolgt nach Fertigstellung des Features

### 4. Trunk-Based Development

Alle Entwickler arbeiten direkt auf `main` oder erstellen sehr kurzlebige Branches (wenige Stunden bis maximal ein Tag):

- Kein dauerhafter Feature-Branch
- Sehr schnelle Integration
- Erfordert starke Automatisierung und Feature Flags

---

## Vergleich der Strategien

| Strategie | Anzahl Branches | Komplexität | Release-Kontrolle | Geeignet für |
|---|---|---|---|---|
| **Git Flow** | Viele (main, develop, feature, release, hotfix) | Hoch | Sehr gut | Grosse Teams, versionierte Releases |
| **GitHub Flow** | Wenige (main + kurzlebige Feature-Branches) | Niedrig | Mittel | Kleine Teams, CI/CD, schnelle Zyklen |
| **Feature Branching** | Mittel (main + je Feature-Branch) | Mittel | Mittel | Teams mit paralleler Entwicklung |
| **Trunk-Based Development** | Sehr wenige (fast nur main) | Niedrig–Mittel | Gering | Erfahrene Teams mit starker CI |

### Abwägungen

**Git Flow** bietet sehr viel Struktur und Kontrolle, ist aber für kleine Teams mit kurzen Entwicklungszyklen viel zu aufwändig. Der Overhead durch develop- und release-Branches rechtfertigt sich erst bei grösseren Projekten mit geplanten Versionszyklen.

**Trunk-Based Development** ist sehr schnell und minimiert Merge-Konflikte, setzt aber voraus, dass alle Entwickler diszipliniert testen und Feature Flags einsetzen. Für ein Schulprojekt mit wenig Erfahrung ist das Risiko hoch, dass fehlerhafte Änderungen direkt auf `main` landen.

**Feature Branching** ist ein guter Mittelweg, bietet aber keine klaren Vorgaben für den Review-Prozess.

**GitHub Flow** verbindet einfache Handhabung mit einem strukturierten Review-Prozess über Pull Requests. Jede Änderung wird auf einem eigenen Branch entwickelt und erst nach einem Review zusammengeführt.

---

## Entscheidung: GitHub Flow

Wir haben uns für **GitHub Flow** entschieden.

### Begründung

- Unser Team besteht aus zwei Personen — eine komplexe Struktur wie Git Flow wäre überdimensioniert
- GitHub Flow passt gut zu GitHub als Plattform und unterstützt Pull Requests direkt
- Jede Änderung muss reviewed werden, bevor sie auf `main` kommt — das erhöht die Codequalität
- Die Strategie ist einfach nachvollziehbar und gut dokumentierbar
- Für ein Schulprojekt mit kontinuierlicher Weiterentwicklung ist der Ansatz ideal

---

## Anforderungsanalyse für das bestehende Projekt

Wir haben das bestehende Projekt analysiert und folgende Anforderungen für die Anwendung von GitHub Flow festgestellt:

- Es gibt aktuell nur einen Branch (`main`)
- Beide Entwickler haben Push-Zugriff auf das Repository
- Es existieren keine Branch-Protection-Rules auf `main`
- Es gibt keine Pull-Request-Vorlage

### Notwendige Anpassungen

Um GitHub Flow korrekt umzusetzen, müssen wir:

1. Branch-Protection auf `main` aktivieren (kein direkter Push, PR erforderlich)
2. Mindestens einen Reviewer pro Pull Request verlangen
3. Feature-Branches nach dem Merge-Muster `feature/<beschreibung>` benennen
4. Jeden neuen Feature-Branch von `main` erstellen
5. Nach dem Merge den Feature-Branch löschen

---

## Workflow-Regeln (GitHub Flow)

Wir haben folgende Regeln für unseren Workflow definiert:

1. `main` ist immer stabil und deploybar
2. Neue Features oder Änderungen werden auf einem eigenen Branch entwickelt (`feature/<name>`)
3. Der Branch wird regelmässig gepusht, damit die Arbeit gesichert ist
4. Wenn die Änderung fertig ist, wird ein Pull Request auf `main` erstellt
5. Der andere Entwickler reviewed den Pull Request und hinterlässt mindestens einen Kommentar
6. Nach der Freigabe (Approve) wird der Pull Request gemergt
7. Der Feature-Branch wird nach dem Merge gelöscht

---

## Umsetzung am Projekt

### Erstellte Branches

Im Rahmen dieser Aufgabe haben wir folgende Branches erstellt und per Pull Request in `main` gemergt:

- `feature/test-Rudy` – Testbranch von Rudy mit `test.txt`
- `feature/test-Rudy-v2` – Zweiter Branch von Rudy, basierend auf `feature/test-Rudy`
- `feature/test-Martin` – Testbranch von Martin mit `test.txt`

### Workflow-Ablauf (Beispiel)

1. Branch erstellen: `git checkout -b feature/test-Rudy`
2. Datei hinzufügen und committen: `git add . && git commit -m "Testbranch Rudy"`
3. Branch pushen: `git push origin feature/test-Rudy`
4. Auf GitHub Pull Request erstellen (Base: `main`, Compare: `feature/test-Rudy`)
5. Martin reviewed den PR und gibt ein Approve
6. Rudy mergt den PR
7. Branch wird gelöscht

---

## Erkenntnisse

- GitHub Flow ist auch für Anfänger gut verständlich und direkt anwendbar
- Branch-Protection auf `main` verhindert versehentliche direkte Pushes
- Pull Requests erzwingen einen Review-Schritt, der die Qualität sichtbar verbessert
- Kurzlebige Branches reduzieren Merge-Konflikte erheblich
- Die klare Benennung von Branches (`feature/<name>`) macht den Überblick einfacher

---

## Fazit

GitHub Flow ist die richtige Wahl für unser Projekt.  
Die Strategie ist einfach genug, um ohne grossen Overhead eingesetzt zu werden, bietet aber gleichzeitig eine klare Struktur mit Pull Requests und Reviews.  
Dadurch wird sichergestellt, dass alle Änderungen geprüft werden, bevor sie auf `main` landen.