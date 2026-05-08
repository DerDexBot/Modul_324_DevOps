package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

public class TaskRequest {

    @NotBlank(message = "Die Aufgabenbeschreibung darf nicht leer sein.")
    private String taskdescription;

    public TaskRequest() {
    }

    public String getTaskdescription() {
        return taskdescription;
    }

    public void setTaskdescription(String taskdescription) {
        this.taskdescription = taskdescription;
    }
}
