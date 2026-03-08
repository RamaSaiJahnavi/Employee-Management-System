package com.example.ems.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.ems.entity.Department;
import com.example.ems.service.DepartmentService;

@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/departments")
public class DepartmentController {

    private final DepartmentService service;

    public DepartmentController(DepartmentService service){
        this.service=service;
    }

    @PostMapping
    public Department create(@RequestBody @Valid Department d){
        return service.create(d);
    }

    @GetMapping
    public List<Department> getAll(){
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Department getById(@PathVariable Long id){
        return service.getById(id);
    }

    @GetMapping("/search/{name}")
    public List<Department> search(@PathVariable String name){
        return service.searchByName(name);
    }

    @PutMapping("/{id}")
    public Department update(@PathVariable Long id,@RequestBody Department d){
        return service.update(id,d);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        service.delete(id);
    }
}
