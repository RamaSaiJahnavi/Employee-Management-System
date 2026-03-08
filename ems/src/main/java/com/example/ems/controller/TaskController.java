package com.example.ems.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.ems.entity.Task;
import com.example.ems.service.TaskService;

@CrossOrigin(origins = "http://localhost:5173")

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service){
        this.service=service;
    }

    @PostMapping
    public Task create(@RequestBody Task t){
        return service.create(t);
    }

    @GetMapping
    public List<Task> getAll(){
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Task getById(@PathVariable Long id){
        return service.getById(id);
    }

    @GetMapping("/search/{title}")
    public List<Task> search(@PathVariable String title){
        return service.searchByTitle(title);
    }

    @PutMapping("/{id}")
    public Task update(@PathVariable Long id,@RequestBody Task t){
        return service.update(id,t);
    }

    @PatchMapping("/{id}/priority")
    public Task patchPriority(@PathVariable Long id,@RequestParam int priority){
        return service.patchPriority(id,priority);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        service.delete(id);
    }
}