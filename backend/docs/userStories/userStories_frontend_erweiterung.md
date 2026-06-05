# User Stories – Frontend-Erweiterungen

**Projekt:** Modul 324 DevOps – ToDo-Applikation  
**Datum:** 05.06.2026  
**Autoren:** Rudy, Martin

---

## US-19: Frontend Redesign – Helleres, moderneres UI

**Als** Benutzer  
**möchte ich** eine ansprechendere und übersichtlichere Oberfläche,  
**damit ich** die ToDo-App gerne und intuitiv benutze.

### Akzeptanzkriterien
- **Given** die App wird geöffnet,  
  **When** die Seite geladen wird,  
  **Then** erscheint ein helles, freundliches Design mit Indigo als Primärfarbe.

- **Given** eine Aufgabe ist als erledigt markiert,  
  **When** sie in der Liste angezeigt wird,  
  **Then** hat sie einen grünen Hintergrund und durchgestrichenen Text.

- **Given** der Benutzer fährt mit der Maus über eine Aufgabe,  
  **When** der Hover-Effekt aktiv ist,  
  **Then** erscheint ein subtiler Schatten um das Element.

### Umsetzung
- `frontend/src/App.css` — vollständiges Redesign mit Indigo-Primärfarbe (`#4f46e5`)
- `frontend/src/index.css` — moderner System-Font-Stack
- `frontend/src/App.jsx` — CSS-Klasse `done` wird dynamisch auf erledigte Tasks gesetzt

---

## US-20: Aufgaben nach Status filtern

**Als** Benutzer  
**möchte ich** die Aufgabenliste nach Status filtern können,  
**damit ich** schnell nur offene oder nur erledigte Aufgaben sehe.

### Akzeptanzkriterien
- **Given** mindestens eine Aufgabe ist vorhanden,  
  **When** die Liste angezeigt wird,  
  **Then** erscheinen drei Filter-Buttons: Alle, Offen, Erledigt — jeweils mit Anzahl.

- **Given** der Filter „Offen" ist aktiv,  
  **When** die Liste dargestellt wird,  
  **Then** werden nur Aufgaben mit `done = false` angezeigt.

- **Given** der Filter „Erledigt" ist aktiv,  
  **When** die Liste dargestellt wird,  
  **Then** werden nur Aufgaben mit `done = true` angezeigt.

- **Given** ein Filter aktiv ist,  
  **When** der Button angezeigt wird,  
  **Then** ist er visuell hervorgehoben (Indigo-Hintergrund).

- **Given** kein Eintrag passt zum aktiven Filter,  
  **When** die Liste gerendert wird,  
  **Then** erscheint der Hinweis „Keine Aufgaben in dieser Kategorie."

### Umsetzung
- `frontend/src/App.jsx` — State `filter` (`'all' | 'open' | 'done'`), `filteredTodos` per `.filter()`
- `frontend/src/App.css` — Klassen `.filter-bar`, `.filter-btn`, `.filter-btn.active`
- Kein Backend-Aufruf nötig — rein clientseitige Filterung

---

## US-21: Fortschrittsanzeige

**Als** Benutzer  
**möchte ich** sehen, wie viele meiner Aufgaben ich bereits erledigt habe,  
**damit ich** meinen Fortschritt auf einen Blick erkenne.

### Akzeptanzkriterien
- **Given** mindestens eine Aufgabe ist vorhanden,  
  **When** die Liste angezeigt wird,  
  **Then** erscheint über dem Formular ein Fortschrittsbalken mit dem Text „X von Y Aufgaben erledigt".

- **Given** alle Aufgaben sind erledigt,  
  **When** der Fortschrittsbalken angezeigt wird,  
  **Then** erscheint stattdessen der Text „🎉 Alle Aufgaben erledigt!"

- **Given** keine Aufgaben vorhanden sind,  
  **When** die App geöffnet wird,  
  **Then** ist der Fortschrittsbalken nicht sichtbar.

- **Given** der Fortschritt ändert sich durch Erledigen einer Aufgabe,  
  **When** der Balken aktualisiert wird,  
  **Then** füllt er sich mit einer animierten Transition.

### Umsetzung
- `frontend/src/App.jsx` — Berechnung: `doneCount / totalCount * 100`, Progress-JSX vor dem Formular
- `frontend/src/App.css` — Klassen `.progress-section`, `.progress-bar-bg`, `.progress-bar-fill`
- Rein frontend-seitig, kein Backend-Aufruf nötig
