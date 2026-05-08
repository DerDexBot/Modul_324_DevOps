# User Stories und Akzeptanzkriterien – ToDo-App

## 1. User Story: Aufgaben anzeigen

### User Story US-01
**Als** Benutzer  
**möchte ich** alle vorhandenen ToDos beim Öffnen der Anwendung sehen,  
**damit ich** einen Überblick über meine offenen Aufgaben habe.

### Akzeptanzkriterien
- **Given** die Anwendung wird geöffnet,  
  **When** die Startseite geladen wird,  
  **Then** werden die vorhandenen Aufgaben vom Backend geladen.

- **Given** das Backend liefert eine Liste von Aufgaben,  
  **When** die Daten erfolgreich empfangen werden,  
  **Then** werden alle Aufgaben in der Oberfläche als Liste angezeigt.

- **Given** mehrere Aufgaben sind vorhanden,  
  **When** die Liste dargestellt wird,  
  **Then** wird jede Aufgabe einzeln mit ihrer Beschreibung angezeigt.

- **Given** keine Aufgabe ist vorhanden,  
  **When** die Anwendung geladen wird,  
  **Then** wird eine leere Liste angezeigt.

---

## 2. User Story: Neue Aufgabe erfassen

### User Story US-02
**Als** Benutzer  
**möchte ich** eine neue Aufgabe eingeben und absenden können,  
**damit ich** neue Arbeiten in meiner ToDo-Liste speichern kann.

### Akzeptanzkriterien
- **Given** ich befinde mich auf der Startseite,  
  **When** ich eine Aufgabenbeschreibung in das Eingabefeld eingebe,  
  **Then** wird der eingegebene Text im Formular angezeigt.

- **Given** ich habe eine Aufgabenbeschreibung eingegeben,  
  **When** ich auf **Absenden** klicke,  
  **Then** wird die Aufgabe an das Backend gesendet.

- **Given** das Backend speichert die Aufgabe erfolgreich,  
  **When** die Anfrage abgeschlossen ist,  
  **Then** wird die Startseite neu geladen.

- **Given** eine neue Aufgabe wurde erfolgreich erstellt,  
  **When** die Seite neu geladen ist,  
  **Then** erscheint die neue Aufgabe in der Aufgabenliste.

- **Given** eine Aufgabe wurde erfolgreich abgesendet,  
  **When** das Formular zurückgesetzt wird,  
  **Then** ist das Eingabefeld wieder leer.

---

## 3. User Story: Aufgabe als erledigt markieren und entfernen

### User Story US-03
**Als** Benutzer  
**möchte ich** eine erledigte Aufgabe aus der Liste entfernen können,  
**damit ich** nur noch offene Aufgaben angezeigt werden.

### Akzeptanzkriterien
- **Given** mindestens eine Aufgabe ist in der Liste vorhanden,  
  **When** ich bei einer Aufgabe auf den Haken-Button klicke,  
  **Then** wird eine Löschanfrage an das Backend gesendet.

- **Given** die Aufgabe wurde im Backend gefunden,  
  **When** die Löschanfrage erfolgreich verarbeitet wurde,  
  **Then** wird die Startseite neu geladen.

- **Given** die Seite wurde nach dem Löschen neu geladen,  
  **When** die Aufgabenliste erneut angezeigt wird,  
  **Then** ist die gelöschte Aufgabe nicht mehr sichtbar.

---

## 4. User Story: Aufgabenliste nach Aktualisierung neu laden

### User Story US-04
**Als** Benutzer  
**möchte ich** nach dem Hinzufügen oder Löschen wieder den aktuellen Stand sehen,  
**damit ich** meine Liste immer aktuell ist.

### Akzeptanzkriterien
- **Given** ich habe eine neue Aufgabe hinzugefügt,  
  **When** die Anfrage erfolgreich abgeschlossen wurde,  
  **Then** wird die Seite neu geladen und der aktuelle Stand angezeigt.

- **Given** ich habe eine Aufgabe gelöscht,  
  **When** die Anfrage erfolgreich abgeschlossen wurde,  
  **Then** wird die Seite neu geladen und der aktuelle Stand angezeigt.

---

## 5. User Story: Einfache und übersichtliche Bedienung

### User Story US-05
**Als** Benutzer  
**möchte ich** die ToDo-App einfach bedienen können,  
**damit ich** schnell Aufgaben erfassen und abschliessen kann.

### Akzeptanzkriterien
- **Given** ich öffne die Anwendung,  
  **When** die Oberfläche angezeigt wird,  
  **Then** sehe ich einen Titel, ein Eingabefeld, einen Absenden-Button und die Aufgabenliste.

- **Given** Aufgaben sind vorhanden,  
  **When** ich die Liste betrachte,  
  **Then** ist pro Aufgabe ein Button zum Erledigen/Löschen sichtbar.

---

# Erweiterungen für weitere User Stories

## 6. User Story: Leere Eingaben verhindern

### User Story US-06
**Als** Benutzer  
**möchte ich** keine leeren Aufgaben speichern können,  
**damit ich** keine ungültigen Einträge in meiner ToDo-Liste entstehen.

### Akzeptanzkriterien
- **Given** das Eingabefeld ist leer,  
  **When** ich auf **Absenden** klicke,  
  **Then** wird keine Aufgabe gespeichert.

- **Given** das Eingabefeld enthält nur Leerzeichen,  
  **When** ich auf **Absenden** klicke,  
  **Then** wird keine Aufgabe gespeichert.

- **Given** eine ungültige Eingabe wurde erkannt,  
  **When** das Formular geprüft wird,  
  **Then** erhält der Benutzer eine verständliche Fehlermeldung.

---

## 7. User Story: Doppelte Aufgaben vermeiden

### User Story US-07
**Als** Benutzer  
**möchte ich** nicht dieselbe Aufgabe mehrfach speichern,  
**damit ich** meine ToDo-Liste übersichtlich bleibt.

### Akzeptanzkriterien
- **Given** eine Aufgabe mit derselben Beschreibung existiert bereits,  
  **When** ich dieselbe Aufgabe nochmals speichere,  
  **Then** wird sie nicht doppelt angelegt.

- **Given** eine doppelte Aufgabe wurde erkannt,  
  **When** die Speicherung abgelehnt wird,  
  **Then** wird eine passende Meldung angezeigt.

---

## 8. User Story: Fehlermeldung bei Serverproblemen

### User Story US-08
**Als** Benutzer  
**möchte ich** eine Meldung erhalten, wenn das Backend nicht erreichbar ist,  
**damit ich** weiss, warum die Aktion nicht funktioniert.

### Akzeptanzkriterien
- **Given** das Backend ist nicht erreichbar,  
  **When** ich die Anwendung öffne oder eine Aufgabe speichere bzw. lösche,  
  **Then** wird eine verständliche Fehlermeldung angezeigt.

- **Given** eine Serveranfrage schlägt fehl,  
  **When** der Fehler auftritt,  
  **Then** bleibt die Anwendung bedienbar.