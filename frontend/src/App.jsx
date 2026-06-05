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
    const [filter, setFilter] = useState('all')

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

    const doneCount = todos.filter(t => t.done).length
    const totalCount = todos.length
    const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0

    const filteredTodos = todos.filter(todo => {
        if (filter === 'open') return !todo.done
        if (filter === 'done') return todo.done
        return true
    })

    const renderTasks = todos => {
        return (
            <ul className="todo-list">
                {todos.map((todo, index) => (
                    <li key={todo.id} className={`todo-item${todo.done ? ' done' : ''}`}>
                        <div className="todo-content">
                            {editingId === todo.id ? (
                                <input
                                    className="edit-input"
                                    type="text"
                                    value={editText}
                                    onChange={event => setEditText(event.target.value)}
                                />
                            ) : (
                                <span style={todo.done ? { textDecoration: 'line-through', color: '#6b7280' } : {}}>
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

                    {totalCount > 0 && (
                        <div className="progress-section">
                            <div className="progress-label">
                                {doneCount === totalCount
                                    ? '🎉 Alle Aufgaben erledigt!'
                                    : `${doneCount} von ${totalCount} Aufgaben erledigt`}
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    )}

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

                    {todos.length > 0 && (
                        <div className="filter-bar">
                            <button
                                className={`filter-btn${filter === 'all' ? ' active' : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                Alle ({todos.length})
                            </button>
                            <button
                                className={`filter-btn${filter === 'open' ? ' active' : ''}`}
                                onClick={() => setFilter('open')}
                            >
                                Offen ({todos.filter(t => !t.done).length})
                            </button>
                            <button
                                className={`filter-btn${filter === 'done' ? ' active' : ''}`}
                                onClick={() => setFilter('done')}
                            >
                                Erledigt ({todos.filter(t => t.done).length})
                            </button>
                        </div>
                    )}

                    {todos.length === 0 ? (
                        <p className="empty-message">Noch keine Aufgaben vorhanden.</p>
                    ) : filteredTodos.length === 0 ? (
                        <p className="empty-message">Keine Aufgaben in dieser Kategorie.</p>
                    ) : (
                        renderTasks(filteredTodos)
                    )}
                </div>
            </header>
        </div>
    )
}

export default App
