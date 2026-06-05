import { useEffect, useState } from 'react'
import logo from './assets/react.svg'
import './App.css'

const API_URL = 'http://localhost:8080'

function App() {
    const [todos, setTodos] = useState([])
    const [taskdescription, setTaskdescription] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [editText, setEditText] = useState('')

    const loadTasks = () => {
        fetch(`${API_URL}/tasks`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Laden fehlgeschlagen')
                }
                return response.json()
            })
            .then(data => {
                setTodos(data)
            })
            .catch(error => {
                console.log(error)
                setErrorMessage('Die Aufgaben konnten nicht geladen werden.')
            })
    }

    useEffect(() => {
        loadTasks()
    }, [])

    const handleChange = event => {
        setTaskdescription(event.target.value)
    }

    const handleSubmit = event => {
        event.preventDefault()

        if (!taskdescription.trim()) {
            setErrorMessage('Bitte eine Aufgabe eingeben.')
            return
        }

        setErrorMessage('')

        fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ taskdescription: taskdescription })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Speichern fehlgeschlagen')
                }
                return response.json()
            })
            .then(() => {
                setTaskdescription('')
                loadTasks()
            })
            .catch(error => {
                console.log(error)
                setErrorMessage('Die Aufgabe konnte nicht gespeichert werden.')
            })
    }

    const handleDelete = id => {
        setErrorMessage('')

        fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Löschen fehlgeschlagen')
                }
                loadTasks()
            })
            .catch(error => {
                console.log(error)
                setErrorMessage('Die Aufgabe konnte nicht gelöscht werden.')
            })
    }

    const handleDone = id => {
        setErrorMessage('')

        fetch(`${API_URL}/tasks/${id}/done`, {
            method: 'PUT'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erledigen fehlgeschlagen')
                }
                return response.json()
            })
            .then(() => {
                loadTasks()
            })
            .catch(error => {
                console.log(error)
                setErrorMessage('Die Aufgabe konnte nicht als erledigt markiert werden.')
            })
    }

    const startEdit = todo => {
        setEditingId(todo.id)
        setEditText(todo.taskdescription)
        setErrorMessage('')
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditText('')
    }

    const saveEdit = id => {
        if (!editText.trim()) {
            setErrorMessage('Die bearbeitete Aufgabe darf nicht leer sein.')
            return
        }

        setErrorMessage('')

        fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ taskdescription: editText })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Bearbeiten fehlgeschlagen')
                }
                return response.json()
            })
            .then(() => {
                setEditingId(null)
                setEditText('')
                loadTasks()
            })
            .catch(error => {
                console.log(error)
                setErrorMessage('Die Aufgabe konnte nicht bearbeitet werden.')
            })
    }

    const renderTasks = todos => {
        return (
            <ul className="todo-list">
                {todos.map((todo, index) => (
                    <li key={todo.id} className="todo-item">
                        <div className="todo-content">
                            {editingId === todo.id ? (
                                <input
                                    className="edit-input"
                                    type="text"
                                    value={editText}
                                    onChange={event => setEditText(event.target.value)}
                                />
                            ) : (
                                <span style={todo.done ? { textDecoration: 'line-through', color: '#999' } : {}}>
                                    {`Task ${index + 1}: ${todo.taskdescription}`}
                                    {todo.done && ' ✓'}
                                </span>
                            )}
                        </div>

                        <div className="todo-actions">
                            {editingId === todo.id ? (
                                <>
                                    <button className="save-btn" onClick={() => saveEdit(todo.id)}>
                                        Speichern
                                    </button>
                                    <button className="cancel-btn" onClick={cancelEdit}>
                                        Abbrechen
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="edit-btn" onClick={() => startEdit(todo)} disabled={todo.done}>
                                        Bearbeiten
                                    </button>
                                    <button className="done-btn" onClick={() => handleDone(todo.id)} disabled={todo.done}>
                                        {todo.done ? 'Erledigt ✓' : 'Als erledigt markieren'}
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDelete(todo.id)}>
                                        Löschen
                                    </button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />

                <div className="todo-card">
                    <h1>ToDo Liste</h1>

                    <form onSubmit={handleSubmit} className="todo-form">
                        <label htmlFor="taskdescription">Neue Aufgabe anlegen:</label>
                        <div className="form-row">
                            <input
                                id="taskdescription"
                                type="text"
                                value={taskdescription}
                                onChange={handleChange}
                                placeholder="z. B. Modul 324 Aufgabe fertigstellen"
                            />
                            <button type="submit">Absenden</button>
                        </div>
                    </form>

                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    {todos.length === 0 ? (
                        <p className="empty-message">Noch keine Aufgaben vorhanden.</p>
                    ) : (
                        renderTasks(todos)
                    )}
                </div>
            </header>
        </div>
    )
}

export default App