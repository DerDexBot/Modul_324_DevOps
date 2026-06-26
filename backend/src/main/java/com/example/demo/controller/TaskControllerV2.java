package com.example.demo.controller;

import com.example.demo.dto.TaskListResponse;
import com.example.demo.dto.TaskRequest;
import com.example.demo.entity.Task;
import com.example.demo.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v2/tasks")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class TaskControllerV2 {

    private final TaskService taskService;

    public TaskControllerV2(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public TaskListResponse getAllTasks(@RequestParam(required = false) String status) {
        List<Task> tasks;
        String appliedFilter;

        if ("open".equalsIgnoreCase(status)) {
            tasks = taskService.findByDone(false);
            appliedFilter = "open";
        } else if ("done".equalsIgnoreCase(status)) {
            tasks = taskService.findByDone(true);
            appliedFilter = "done";
        } else {
            tasks = taskService.findAll();
            appliedFilter = "all";
        }

        return new TaskListResponse(tasks, appliedFilter);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Task createTask(@Valid @RequestBody TaskRequest request) {
        return taskService.create(request);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @Valid @RequestBody TaskRequest request) {
        return taskService.update(id, request);
    }

    @PutMapping("/{id}/done")
    public Task markTaskDone(@PathVariable Long id) {
        return taskService.markDone(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteById(id);
    }
}
