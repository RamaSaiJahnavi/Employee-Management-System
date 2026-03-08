package com.example.ems.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.ems.entity.Project;
import com.example.ems.service.ProjectService;

@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService service;

    public ProjectController(ProjectService service){
        this.service=service;
    }

    @PostMapping
    public Project create(@RequestBody Project p){
        return service.create(p);
    }

    @GetMapping
    public List<Project> getAll(){
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Project getById(@PathVariable Long id){
        return service.getById(id);
    }

    @GetMapping("/search/{title}")
    public List<Project> search(@PathVariable String title){
        return service.searchByTitle(title);
    }

    @PutMapping("/{id}")
    public Project update(@PathVariable Long id,@RequestBody Project p){
        return service.update(id,p);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        service.delete(id);
    }
}
