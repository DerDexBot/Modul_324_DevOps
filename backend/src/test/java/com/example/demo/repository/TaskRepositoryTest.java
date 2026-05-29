package com.example.demo.repository;

import com.example.demo.entity.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

/**
 * Tests für {@link TaskRepository} mit {@code @DataJpaTest}.
 *
 * <p>{@code @DataJpaTest} lädt ausschliesslich den JPA-Layer (Entities,
 * Repositories, Hibernate) und verwendet automatisch die H2-Inmemory-Datenbank.
 * Service- und Controller-Beans werden nicht geladen.</p>
 *
 * <p>Standardmässig läuft jeder Test in einer Transaktion, die nach dem
 * Test zurückgerollt wird. Das {@code @BeforeEach} sorgt zusätzlich dafür,
 * dass keine Altdaten zwischen Tests bestehen bleiben.</p>
 */
@DataJpaTest
class TaskRepositoryTest {

    @Autowired
    private TaskRepository taskRepository;

    /**
     * Vor jedem Test: alle Einträge löschen.
     * Stellt eine saubere Ausgangslage sicher, unabhängig vom Rollback-Verhalten.
     */
    @BeforeEach
    void setUp() {
        taskRepository.deleteAll();
    }

    // ─── save ─────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("save – neue Task wird persistiert und erhält eine ID")
    void save_shouldPersistTaskWithGeneratedId() {
        Task task = new Task("Persistente Aufgabe");

        Task saved = taskRepository.save(task);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getTaskdescription()).isEqualTo("Persistente Aufgabe");
        assertThat(saved.isDone()).isFalse();
    }

    @Test
    @DisplayName("save – done-Flag kann explizit auf true gesetzt werden")
    void save_shouldPersistDoneFlag() {
        Task task = new Task("Erledigte Aufgabe");
        task.setDone(true);

        Task saved = taskRepository.save(task);

        assertThat(saved.isDone()).isTrue();
    }

    // ─── findById ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("findById – gibt gespeicherte Task zurück")
    void findById_shouldReturnPersistedTask() {
        Task saved = taskRepository.save(new Task("Suchbare Aufgabe"));

        Optional<Task> found = taskRepository.findById(saved.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getTaskdescription()).isEqualTo("Suchbare Aufgabe");
    }

    @Test
    @DisplayName("findById – gibt Optional.empty() zurück wenn ID nicht existiert")
    void findById_withUnknownId_shouldReturnEmpty() {
        Optional<Task> found = taskRepository.findById(9999L);

        assertThat(found).isEmpty();
    }

    // ─── findAll ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("findAll – alle gespeicherten Tasks werden zurückgegeben")
    void findAll_shouldReturnAllPersistedTasks() {
        taskRepository.save(new Task("Aufgabe 1"));
        taskRepository.save(new Task("Aufgabe 2"));
        taskRepository.save(new Task("Aufgabe 3"));

        List<Task> all = taskRepository.findAll();

        assertThat(all).hasSize(3);
    }

    @Test
    @DisplayName("findAll – leere Liste wenn keine Tasks vorhanden")
    void findAll_shouldReturnEmptyListWhenNoTasksExist() {
        List<Task> all = taskRepository.findAll();

        assertThat(all).isEmpty();
    }

    // ─── deleteById ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("deleteById – Task wird dauerhaft aus der Datenbank entfernt")
    void deleteById_shouldRemoveTask() {
        Task saved = taskRepository.save(new Task("Löschbare Aufgabe"));
        Long id = saved.getId();

        taskRepository.deleteById(id);

        assertThat(taskRepository.findById(id)).isEmpty();
    }

    // ─── existsById ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("existsById – gibt true zurück für vorhandene Task")
    void existsById_shouldReturnTrueForExistingTask() {
        Task saved = taskRepository.save(new Task("Existierende Aufgabe"));

        assertThat(taskRepository.existsById(saved.getId())).isTrue();
    }

    @Test
    @DisplayName("existsById – gibt false zurück wenn ID nicht existiert")
    void existsById_withUnknownId_shouldReturnFalse() {
        assertThat(taskRepository.existsById(9999L)).isFalse();
    }
}