package com.example.demo.service;

import com.example.demo.dto.TaskRequest;
import com.example.demo.entity.Task;
import com.example.demo.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> findAll() {
        return taskRepository.findAll();
    }

    public Task create(TaskRequest request) {
        String cleanedText = request.getTaskdescription().trim();
        Task task = new Task(cleanedText);
        return taskRepository.save(task);
    }

    public Task update(Long id, TaskRequest request) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Task wurde nicht gefunden."));

        existingTask.setTaskdescription(request.getTaskdescription().trim());
        return taskRepository.save(existingTask);
    }

    public void deleteById(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResponseStatusException(NOT_FOUND, "Task wurde nicht gefunden.");
        }
        taskRepository.deleteById(id);
    }
}