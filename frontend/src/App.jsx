import { useEffect, useState } from 'react'
import logo from './assets/react.svg'
import './App.css'

// Basis-URL vom Backend
const API_BASE_URL = 'http://localhost:8080'

function App() {
  // State für alle Todos, die vom Backend geladen werden
  const [todos, setTodos] = useState([])

  // State für das Eingabefeld zum Erstellen eines neuen Todos
  const [taskdescription, setTaskdescription] = useState('')

  // State, um anzuzeigen, ob die Todos gerade geladen werden
  const [isLoading, setIsLoading] = useState(true)

  // State für mögliche Fehlermeldungen
  const [errorMessage, setErrorMessage] = useState('')

  /**
   * User Story:
   * Als Benutzer möchte ich alle vorhandenen ToDos beim Öffnen der Anwendung sehen,
   * damit ich einen Überblick über meine offenen Aufgaben habe.
   *
   * Diese Funktion lädt alle vorhandenen Aufgaben vom Backend.
   */
  const loadTodos = async () => {
    try {
      setIsLoading(true)
      setErrorMessage('')

      // Given die Anwendung wird geöffnet,
      // When die Startseite geladen wird,
      // Then werden die vorhandenen Aufgaben vom Backend geladen.
      const response = await fetch(`${API_BASE_URL}/`)

      if (!response.ok) {
        throw new Error('Aufgaben konnten nicht geladen werden')
      }

      const data = await response.json()

      // Given das Backend liefert eine Liste von Aufgaben,
      // When die Daten erfolgreich empfangen werden,
      // Then werden alle Aufgaben in der Oberfläche als Liste angezeigt.
      if (Array.isArray(data)) {
        setTodos(data)
      } else {
        // Falls das Backend keine Liste zurückgibt, wird sicherheitshalber eine leere Liste gesetzt.
        setTodos([])
      }
    } catch (error) {
      console.error(error)

      // Bei einem Fehler wird ebenfalls eine leere Liste angezeigt.
      setTodos([])
      setErrorMessage('Aufgaben konnten nicht vom Backend geladen werden.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * useEffect wird automatisch beim ersten Laden der Komponente ausgeführt.
   * Dadurch werden die Todos direkt beim Öffnen der Anwendung vom Backend geladen.
   */
  useEffect(() => {
    loadTodos()
  }, [])

  /**
   * Erstellt ein neues Todo und lädt danach die Liste erneut,
   * damit die Oberfläche wieder den aktuellen Stand vom Backend zeigt.
   */
  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmedTaskdescription = taskdescription.trim()

    if (!trimmedTaskdescription) {
      return
    }

    try {
      setErrorMessage('')

      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskdescription: trimmedTaskdescription }),
      })

      if (!response.ok) {
        throw new Error('Speichern fehlgeschlagen')
      }

      setTaskdescription('')

      // Nach dem Speichern werden alle Todos neu vom Backend geladen.
      await loadTodos()
    } catch (error) {
      console.error(error)
      setErrorMessage('Aufgabe konnte nicht gespeichert werden.')
    }
  }

  /**
   * Aktualisiert den State, wenn der Benutzer etwas in das Eingabefeld schreibt.
   */
  const handleChange = (event) => {
    setTaskdescription(event.target.value)
  }

  /**
   * Löscht bzw. erledigt ein Todo und lädt danach die Liste erneut.
   */
  const handleDelete = async (taskdescription) => {
    try {
      setErrorMessage('')

      const response = await fetch(`${API_BASE_URL}/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskdescription }),
      })

      if (!response.ok) {
        throw new Error('Löschen fehlgeschlagen')
      }

      // Nach dem Löschen wird die aktuelle Todo-Liste erneut vom Backend geladen.
      await loadTodos()
    } catch (error) {
      console.error(error)
      setErrorMessage('Aufgabe konnte nicht gelöscht werden.')
    }
  }

  /**
   * Rendert die Todo-Liste.
   *
   * Akzeptanzkriterien:
   * - Given mehrere Aufgaben sind vorhanden,
   *   When die Liste dargestellt wird,
   *   Then wird jede Aufgabe einzeln mit ihrer Beschreibung angezeigt.
   *
   * - Given keine Aufgabe ist vorhanden,
   *   When die Anwendung geladen wird,
   *   Then wird eine leere Liste angezeigt.
   */
  const renderTasks = () => {
    return (
      <ul className="todo-list" aria-label="Aufgabenliste">
        {todos.map((todo, index) => (
          <li key={`${todo.taskdescription}-${index}`}>
            <span>{todo.taskdescription}</span>

            <button
              type="button"
              onClick={() => handleDelete(todo.taskdescription)}
              aria-label={`${todo.taskdescription} als erledigt markieren`}
            >
              &#10004;
            </button>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <h1>ToDo Liste</h1>

        <form onSubmit={handleSubmit} className="todo-form">
          <label htmlFor="taskdescription">Neues Todo anlegen:</label>

          <input
            id="taskdescription"
            type="text"
            value={taskdescription}
            onChange={handleChange}
          />

          <button type="submit">Absenden</button>
        </form>

        {errorMessage && <p>{errorMessage}</p>}

        {/* Während dem Laden wird ein Ladehinweis angezeigt.
            Sobald die Daten geladen wurden, wird die Todo-Liste angezeigt.
            Wenn keine Todos vorhanden sind, wird eine leere Liste gerendert. */}
        {isLoading ? <p>Aufgaben werden geladen...</p> : renderTasks()}
      </header>
    </div>
  )
}

export default App