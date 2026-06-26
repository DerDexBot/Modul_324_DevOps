package com.example.demo.controller;

import com.example.demo.entity.Task;
import com.example.demo.repository.TaskRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integrationstests für {@link TaskController}.
 *
 * <p>Lädt den vollständigen Spring-Kontext mit einer H2-Inmemory-Datenbank
 * (konfiguriert in {@code src/test/resources/application.properties}).
 * Jeder Test startet mit einer leeren Datenbank – sichergestellt durch
 * {@code @BeforeEach}. Requests werden über {@link MockMvc} gesendet,
 * ohne einen echten HTTP-Server zu starten.</p>
 */
@SpringBootTest
@AutoConfigureMockMvc
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    /** Direkter Zugriff auf die H2-DB zum Vorbereiten und Aufräumen der Testdaten. */
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Vor jedem Test: alle Datenbankeinträge löschen.
     * Dadurch laufen Tests unabhängig voneinander und beeinflussen sich nicht.
     */
    @BeforeEach
    void setUp() {
        taskRepository.deleteAll();
    }

    // ─── GET /tasks ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("GET /tasks – leere Liste, wenn keine Tasks vorhanden")
    void getAllTasks_shouldReturnEmptyList() throws Exception {
        mockMvc.perform(get("/v1/tasks"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DisplayName("GET /tasks – alle vorhandenen Tasks werden zurückgegeben")
    void getAllTasks_shouldReturnAllTasks() throws Exception {
        taskRepository.save(new Task("Erste Aufgabe"));
        taskRepository.save(new Task("Zweite Aufgabe"));

        mockMvc.perform(get("/v1/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].taskdescription", is("Erste Aufgabe")))
                .andExpect(jsonPath("$[1].taskdescription", is("Zweite Aufgabe")));
    }

    // ─── POST /tasks ──────────────────────────────────────────────────────────

    @Test
    @DisplayName("POST /tasks – neue Task wird erstellt, Status 201")
    void createTask_shouldReturn201WithCreatedTask() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of("taskdescription", "Neue Aufgabe"));

        mockMvc.perform(post("/v1/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.taskdescription", is("Neue Aufgabe")))
                .andExpect(jsonPath("$.done", is(false)));
    }

    @Test
    @DisplayName("POST /tasks – leere Beschreibung liefert 400 Bad Request")
    void createTask_withBlankDescription_shouldReturn400() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of("taskdescription", ""));

        mockMvc.perform(post("/v1/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /tasks – führende und nachgestellte Leerzeichen werden getrimmt")
    void createTask_shouldTrimWhitespace() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of("taskdescription", "  Aufgabe mit Leerzeichen  "));

        mockMvc.perform(post("/v1/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.taskdescription", is("Aufgabe mit Leerzeichen")));
    }

    // ─── PUT /tasks/{id} ──────────────────────────────────────────────────────

    @Test
    @DisplayName("PUT /tasks/{id} – bestehende Task wird erfolgreich aktualisiert")
    void updateTask_shouldReturnUpdatedTask() throws Exception {
        Task saved = taskRepository.save(new Task("Alte Beschreibung"));
        String body = objectMapper.writeValueAsString(Map.of("taskdescription", "Neue Beschreibung"));

        mockMvc.perform(put("/v1/tasks/" + saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(saved.getId().intValue())))
                .andExpect(jsonPath("$.taskdescription", is("Neue Beschreibung")));
    }

    @Test
    @DisplayName("PUT /tasks/{id} – 404 wenn Task-ID nicht existiert")
    void updateTask_withUnknownId_shouldReturn404() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of("taskdescription", "Aktualisierung"));

        mockMvc.perform(put("/v1/tasks/9999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isNotFound());
    }

    // ─── PUT /tasks/{id}/done ─────────────────────────────────────────────────

    @Test
    @DisplayName("PUT /tasks/{id}/done – Task wird als erledigt markiert")
    void markTaskDone_shouldSetDoneToTrue() throws Exception {
        Task saved = taskRepository.save(new Task("Noch nicht erledigt"));

        mockMvc.perform(put("/v1/tasks/" + saved.getId() + "/done"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.done", is(true)));
    }

    @Test
    @DisplayName("PUT /tasks/{id}/done – 404 wenn Task-ID nicht existiert")
    void markTaskDone_withUnknownId_shouldReturn404() throws Exception {
        mockMvc.perform(put("/v1/tasks/9999/done"))
                .andExpect(status().isNotFound());
    }

    // ─── DELETE /tasks/{id} ───────────────────────────────────────────────────

    @Test
    @DisplayName("DELETE /tasks/{id} – Task wird gelöscht, Status 204")
    void deleteTask_shouldReturn204() throws Exception {
        Task saved = taskRepository.save(new Task("Zu löschende Aufgabe"));

        mockMvc.perform(delete("/v1/tasks/" + saved.getId()))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("DELETE /tasks/{id} – 404 wenn Task-ID nicht existiert")
    void deleteTask_withUnknownId_shouldReturn404() throws Exception {
        mockMvc.perform(delete("/v1/tasks/9999"))
                .andExpect(status().isNotFound());
    }
}