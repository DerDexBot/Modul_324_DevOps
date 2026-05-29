package com.example.demo.service;

import com.example.demo.dto.TaskRequest;
import com.example.demo.entity.Task;
import com.example.demo.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit-Tests für {@link TaskService}.
 *
 * <p>Das {@link TaskRepository} wird mit Mockito gemockt – es findet kein
 * echter Datenbankzugriff statt. Dadurch werden ausschliesslich die
 * Geschäftslogik und die Fehlerbehandlung im Service getestet.</p>
 *
 * <p>{@code @ExtendWith(MockitoExtension.class)} initialisiert die Mocks
 * automatisch vor jedem Test und setzt sie danach zurück.</p>
 */
@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    /** Wiederverwendbarer Test-Task, der vor jedem Test neu erstellt wird. */
    private Task sampleTask;

    /**
     * Vor jedem Test: frische Testdaten vorbereiten.
     * Mockito-Mocks werden von der Extension automatisch zurückgesetzt.
     */
    @BeforeEach
    void setUp() {
        sampleTask = new Task("Beispielaufgabe");
    }

    // ─── findAll ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("findAll – gibt alle Tasks aus dem Repository zurück")
    void findAll_shouldReturnAllTasks() {
        when(taskRepository.findAll()).thenReturn(List.of(sampleTask, new Task("Zweite Aufgabe")));

        List<Task> result = taskService.findAll();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getTaskdescription()).isEqualTo("Beispielaufgabe");
        verify(taskRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("findAll – gibt leere Liste zurück wenn keine Tasks vorhanden")
    void findAll_shouldReturnEmptyListWhenNoTasks() {
        when(taskRepository.findAll()).thenReturn(List.of());

        List<Task> result = taskService.findAll();

        assertThat(result).isEmpty();
        verify(taskRepository, times(1)).findAll();
    }

    // ─── create ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("create – Task wird gespeichert und zurückgegeben")
    void create_shouldSaveAndReturnTask() {
        TaskRequest request = buildRequest("Neue Aufgabe");
        when(taskRepository.save(any(Task.class))).thenReturn(new Task("Neue Aufgabe"));

        Task result = taskService.create(request);

        assertThat(result.getTaskdescription()).isEqualTo("Neue Aufgabe");
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    @DisplayName("create – Leerzeichen am Rand der Beschreibung werden getrimmt")
    void create_shouldTrimWhitespaceFromDescription() {
        TaskRequest request = buildRequest("  Aufgabe mit Rand-Leerzeichen  ");
        // Gibt das übergebene Argument unverändert zurück, um den trim-Effekt zu prüfen
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        Task result = taskService.create(request);

        assertThat(result.getTaskdescription()).isEqualTo("Aufgabe mit Rand-Leerzeichen");
    }

    // ─── update ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("update – bestehende Task wird mit neuer Beschreibung gespeichert")
    void update_shouldUpdateAndReturnTask() {
        TaskRequest request = buildRequest("Geänderte Beschreibung");
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        Task result = taskService.update(1L, request);

        assertThat(result.getTaskdescription()).isEqualTo("Geänderte Beschreibung");
        verify(taskRepository).save(sampleTask);
    }

    @Test
    @DisplayName("update – 404 ResponseStatusException wenn Task-ID nicht existiert")
    void update_withUnknownId_shouldThrow404() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.update(99L, buildRequest("Egal")))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode())
                        .isEqualTo(HttpStatus.NOT_FOUND));
    }

    // ─── markDone ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("markDone – done-Flag wird auf true gesetzt")
    void markDone_shouldSetDoneFlagToTrue() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        Task result = taskService.markDone(1L);

        assertThat(result.isDone()).isTrue();
        verify(taskRepository).save(sampleTask);
    }

    @Test
    @DisplayName("markDone – 404 ResponseStatusException wenn Task-ID nicht existiert")
    void markDone_withUnknownId_shouldThrow404() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.markDone(99L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode())
                        .isEqualTo(HttpStatus.NOT_FOUND));
    }

    // ─── deleteById ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("deleteById – deleteById des Repository wird genau einmal aufgerufen")
    void deleteById_shouldCallRepositoryDelete() {
        when(taskRepository.existsById(1L)).thenReturn(true);
        doNothing().when(taskRepository).deleteById(1L);

        taskService.deleteById(1L);

        verify(taskRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("deleteById – 404 ResponseStatusException wenn Task-ID nicht existiert")
    void deleteById_withUnknownId_shouldThrow404() {
        when(taskRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> taskService.deleteById(99L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode())
                        .isEqualTo(HttpStatus.NOT_FOUND));
    }

    // ─── Hilfsmethode ─────────────────────────────────────────────────────────

    /** Erstellt ein {@link TaskRequest}-Objekt mit der angegebenen Beschreibung. */
    private TaskRequest buildRequest(String description) {
        TaskRequest request = new TaskRequest();
        request.setTaskdescription(description);
        return request;
    }
}