package com.example.todo.controller;

import com.example.todo.entity.Task;
import com.example.todo.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:5173")
public class TaskController {

    @Autowired
    private TaskService service;

    @PostMapping("/employees/{id}/tasks")
    public Task add(@PathVariable Long id, @RequestBody Task t) {
        return service.addTask(id, t);
    }

    @GetMapping("/employees/{id}/tasks")
    public List<Task> all(@PathVariable Long id) {
        return service.getTasks(id);
    }

    @PutMapping("/tasks/{id}")
    public Task update(@PathVariable Long id, @RequestBody Task t) {
        return service.update(id, t);
    }

    @PatchMapping("/tasks/{id}/complete")
    public Task complete(@PathVariable Long id) {
        return service.complete(id);
    }

    @DeleteMapping("/tasks/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/employees/{id}/tasks/status/{status}")
    public List<Task> filterStatus(@PathVariable Long id, @PathVariable String status) {
        return service.filterByStatus(id, status);
    }

    @GetMapping("/employees/{id}/tasks/priority/{priority}")
    public List<Task> filterPriority(@PathVariable Long id, @PathVariable String priority) {
        return service.filterByPriority(id, priority);
    }
    @GetMapping("/tasks/{id}")
    public Task get(@PathVariable Long id){
        return service.getTaskById(id);
    }
}
