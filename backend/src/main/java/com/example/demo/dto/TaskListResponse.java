package com.example.demo.dto;

import com.example.demo.entity.Task;

import java.util.List;

public class TaskListResponse {

    private final String apiVersion = "2.0";
    private final String filter;
    private final int total;
    private final List<Task> data;

    public TaskListResponse(List<Task> data, String filter) {
        this.data = data;
        this.total = data.size();
        this.filter = filter;
    }

    public String getApiVersion() {
        return apiVersion;
    }

    public String getFilter() {
        return filter;
    }

    public int getTotal() {
        return total;
    }

    public List<Task> getData() {
        return data;
    }
}
