package com.example.demo.dto;

import com.example.demo.entity.Task;

import java.util.List;

public class TaskListResponse {

    private final String apiVersion = "2.0";
    private final int total;
    private final List<Task> data;

    public TaskListResponse(List<Task> data) {
        this.data = data;
        this.total = data.size();
    }

    public String getApiVersion() {
        return apiVersion;
    }

    public int getTotal() {
        return total;
    }

    public List<Task> getData() {
        return data;
    }
}
