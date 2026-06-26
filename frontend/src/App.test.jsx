import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

const API_URL = '/api/v1'

function mockJsonResponse(data, ok = true) {
    return Promise.resolve({
        ok,
        json: () => Promise.resolve(data)
    })
}

describe('App', () => {
    beforeEach(() => {
        globalThis.fetch = jest.fn()
        jest.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    test('lädt Aufgaben vom Backend und zeigt sie in der Liste an', async () => {
        globalThis.fetch.mockResolvedValueOnce(
            await mockJsonResponse([
                { id: 1, taskdescription: 'Jest Tests schreiben', done: false },
                { id: 2, taskdescription: 'Dokumentation ergänzen', done: true }
            ])
        )

        render(<App />)

        expect(await screen.findByText('Task 1: Jest Tests schreiben')).toBeInTheDocument()
        expect(screen.getByText(/Task 2: Dokumentation ergänzen/)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Erledigt ✓' })).toBeDisabled()
        expect(globalThis.fetch).toHaveBeenCalledWith(`${API_URL}/tasks`)
    })

    test('legt eine neue Aufgabe per POST an und lädt die Liste danach neu', async () => {
        globalThis.fetch
            .mockResolvedValueOnce(await mockJsonResponse([]))
            .mockResolvedValueOnce(await mockJsonResponse({ id: 3, taskdescription: 'Neue Aufgabe', done: false }))
            .mockResolvedValueOnce(await mockJsonResponse([{ id: 3, taskdescription: 'Neue Aufgabe', done: false }]))

        const user = userEvent.setup()
        render(<App />)

        expect(await screen.findByText('Noch keine Aufgaben vorhanden.')).toBeInTheDocument()

        await user.type(screen.getByLabelText('Neue Aufgabe anlegen:'), 'Neue Aufgabe')
        await user.click(screen.getByRole('button', { name: 'Absenden' }))

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenNthCalledWith(
                2,
                `${API_URL}/tasks`,
                expect.objectContaining({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ taskdescription: 'Neue Aufgabe' })
                })
            )
        })

        expect(await screen.findByText('Task 1: Neue Aufgabe')).toBeInTheDocument()
        expect(screen.getByLabelText('Neue Aufgabe anlegen:')).toHaveValue('')
    })

    test('zeigt eine Fehlermeldung, wenn eine leere Aufgabe abgesendet wird', async () => {
        globalThis.fetch.mockResolvedValueOnce(await mockJsonResponse([]))

        const user = userEvent.setup()
        render(<App />)

        await screen.findByText('Noch keine Aufgaben vorhanden.')
        await user.click(screen.getByRole('button', { name: 'Absenden' }))

        expect(screen.getByText('Bitte eine Aufgabe eingeben.')).toBeInTheDocument()
        expect(globalThis.fetch).toHaveBeenCalledTimes(1)
    })

    // ─── US-20: Filter-Tests ──────────────────────────────────────────────────

    test('US-20: zeigt Filter-Buttons wenn Tasks vorhanden sind', async () => {
        globalThis.fetch.mockResolvedValueOnce(
            await mockJsonResponse([
                { id: 1, taskdescription: 'Offene Aufgabe', done: false },
                { id: 2, taskdescription: 'Erledigte Aufgabe', done: true }
            ])
        )

        render(<App />)

        expect(await screen.findByRole('button', { name: /Alle/ })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Offen/ })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Erledigt \(/ })).toBeInTheDocument()
    })

    test('US-20: filtert nur offene Aufgaben wenn Offen-Filter aktiv', async () => {
        globalThis.fetch.mockResolvedValueOnce(
            await mockJsonResponse([
                { id: 1, taskdescription: 'Offene Aufgabe', done: false },
                { id: 2, taskdescription: 'Erledigte Aufgabe', done: true }
            ])
        )

        const user = userEvent.setup()
        render(<App />)

        await screen.findByText('Task 1: Offene Aufgabe')
        await user.click(screen.getByRole('button', { name: /Offen/ }))

        expect(screen.getByText('Task 1: Offene Aufgabe')).toBeInTheDocument()
        expect(screen.queryByText(/Erledigte Aufgabe/)).not.toBeInTheDocument()
    })

    // ─── US-21: Fortschrittsanzeige ───────────────────────────────────────────

    test('US-21: zeigt Fortschrittstext mit korrekter Anzahl', async () => {
        globalThis.fetch.mockResolvedValueOnce(
            await mockJsonResponse([
                { id: 1, taskdescription: 'Aufgabe 1', done: true },
                { id: 2, taskdescription: 'Aufgabe 2', done: false }
            ])
        )

        render(<App />)

        expect(await screen.findByText('1 von 2 Aufgaben erledigt')).toBeInTheDocument()
    })

    test('US-21: zeigt Glückwunsch-Meldung wenn alle Aufgaben erledigt sind', async () => {
        globalThis.fetch.mockResolvedValueOnce(
            await mockJsonResponse([
                { id: 1, taskdescription: 'Aufgabe 1', done: true },
                { id: 2, taskdescription: 'Aufgabe 2', done: true }
            ])
        )

        render(<App />)

        expect(await screen.findByText('🎉 Alle Aufgaben erledigt!')).toBeInTheDocument()
    })

    test('US-21: zeigt keinen Fortschrittsbalken wenn keine Tasks vorhanden', async () => {
        globalThis.fetch.mockResolvedValueOnce(await mockJsonResponse([]))

        render(<App />)

        await screen.findByText('Noch keine Aufgaben vorhanden.')
        expect(screen.queryByText(/von \d+ Aufgaben erledigt/)).not.toBeInTheDocument()
    })

    test('US-20: filtert nur erledigte Aufgaben wenn Erledigt-Filter aktiv', async () => {
        globalThis.fetch.mockResolvedValueOnce(
            await mockJsonResponse([
                { id: 1, taskdescription: 'Offene Aufgabe', done: false },
                { id: 2, taskdescription: 'Erledigte Aufgabe', done: true }
            ])
        )

        const user = userEvent.setup()
        render(<App />)

        await screen.findByText('Task 1: Offene Aufgabe')
        await user.click(screen.getByRole('button', { name: /Erledigt \(/ }))

        expect(screen.getByText(/Erledigte Aufgabe/)).toBeInTheDocument()
        expect(screen.queryByText(/Offene Aufgabe/)).not.toBeInTheDocument()
    })

    test('bearbeitet eine bestehende Aufgabe per PUT und lädt die aktualisierte Liste neu', async () => {
        globalThis.fetch
            .mockResolvedValueOnce(await mockJsonResponse([{ id: 1, taskdescription: 'Alte Aufgabe', done: false }]))
            .mockResolvedValueOnce(await mockJsonResponse({ id: 1, taskdescription: 'Aktualisierte Aufgabe', done: false }))
            .mockResolvedValueOnce(await mockJsonResponse([{ id: 1, taskdescription: 'Aktualisierte Aufgabe', done: false }]))

        const user = userEvent.setup()
        render(<App />)

        await screen.findByText('Task 1: Alte Aufgabe')
        await user.click(screen.getByRole('button', { name: 'Bearbeiten' }))
        const editInput = screen.getByDisplayValue('Alte Aufgabe')
        await user.clear(editInput)
        await user.type(editInput, 'Aktualisierte Aufgabe')
        await user.click(screen.getByRole('button', { name: 'Speichern' }))

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenNthCalledWith(
                2,
                `${API_URL}/tasks/1`,
                expect.objectContaining({
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ taskdescription: 'Aktualisierte Aufgabe' })
                })
            )
        })

        expect(await screen.findByText('Task 1: Aktualisierte Aufgabe')).toBeInTheDocument()
        expect(screen.queryByDisplayValue('Aktualisierte Aufgabe')).not.toBeInTheDocument()
    })

    test('löscht eine Aufgabe per DELETE und entfernt sie nach dem Neuladen aus der Liste', async () => {
        globalThis.fetch
            .mockResolvedValueOnce(
                await mockJsonResponse([
                    { id: 1, taskdescription: 'Zu löschende Aufgabe', done: false },
                    { id: 2, taskdescription: 'Bleibende Aufgabe', done: false }
                ])
            )
            .mockResolvedValueOnce(await mockJsonResponse(null))
            .mockResolvedValueOnce(await mockJsonResponse([{ id: 2, taskdescription: 'Bleibende Aufgabe', done: false }]))

        const user = userEvent.setup()
        render(<App />)

        await screen.findByText('Task 1: Zu löschende Aufgabe')
        await user.click(screen.getAllByRole('button', { name: 'Löschen' })[0])

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenNthCalledWith(
                2,
                `${API_URL}/tasks/1`,
                expect.objectContaining({ method: 'DELETE' })
            )
        })

        expect(await screen.findByText('Task 1: Bleibende Aufgabe')).toBeInTheDocument()
        expect(screen.queryByText(/Zu löschende Aufgabe/)).not.toBeInTheDocument()
    })

})
