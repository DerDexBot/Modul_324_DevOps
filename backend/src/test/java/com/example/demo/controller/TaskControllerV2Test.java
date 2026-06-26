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

@SpringBootTest
@AutoConfigureMockMvc
class TaskControllerV2Test {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        taskRepository.deleteAll();
    }

    // ─── GET /v2/tasks ────────────────────────────────────────────────────────

    @Test
    @DisplayName("GET /v2/tasks – Antwort enthält apiVersion, total und data")
    void getAllTasks_shouldReturnWrappedResponse() throws Exception {
        taskRepository.save(new Task("Erste Aufgabe"));
        taskRepository.save(new Task("Zweite Aufgabe"));

        mockMvc.perform(get("/v2/tasks"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.apiVersion", is("2.0")))
                .andExpect(jsonPath("$.total", is(2)))
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[0].taskdescription", is("Erste Aufgabe")));
    }

    @Test
    @DisplayName("GET /v2/tasks – leere Liste liefert total 0")
    void getAllTasks_emptyList_shouldReturnTotalZero() throws Exception {
        mockMvc.perform(get("/v2/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.apiVersion", is("2.0")))
                .andExpect(jsonPath("$.total", is(0)))
                .andExpect(jsonPath("$.data", hasSize(0)));
    }

    // ─── POST /v2/tasks ───────────────────────────────────────────────────────

    @Test
    @DisplayName("POST /v2/tasks – neue Task wird erstellt, Status 201")
    void createTask_shouldReturn201WithCreatedTask() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of("taskdescription", "Neue Aufgabe"));

        mockMvc.perform(post("/v2/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.taskdescription", is("Neue Aufgabe")))
                .andExpect(jsonPath("$.done", is(false)));
    }

    // ─── PUT /v2/tasks/{id}/done ──────────────────────────────────────────────

    @Test
    @DisplayName("PUT /v2/tasks/{id}/done – Task wird als erledigt markiert")
    void markTaskDone_shouldSetDoneToTrue() throws Exception {
        Task saved = taskRepository.save(new Task("Noch nicht erledigt"));

        mockMvc.perform(put("/v2/tasks/" + saved.getId() + "/done"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.done", is(true)));
    }

    // ─── DELETE /v2/tasks/{id} ────────────────────────────────────────────────

    @Test
    @DisplayName("DELETE /v2/tasks/{id} – Task wird gelöscht, Status 204")
    void deleteTask_shouldReturn204() throws Exception {
        Task saved = taskRepository.save(new Task("Zu löschende Aufgabe"));

        mockMvc.perform(delete("/v2/tasks/" + saved.getId()))
                .andExpect(status().isNoContent());
    }
}
