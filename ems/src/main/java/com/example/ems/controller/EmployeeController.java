package com.example.ems.controller;

import com.example.ems.service.EmployeeService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import com.example.ems.entity.Employee;

@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    private final EmployeeService service;

    public EmployeeController(EmployeeService service){
        this.service=service;
    }

    @PostMapping
    public Employee create(@Valid @RequestBody Employee e){
        return service.create(e);
    }

    @GetMapping
    public List<Employee> getAll(){
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Employee getById(@PathVariable Long id){
        return service.getById(id);
    }

    @GetMapping("/search/{name}")
    public List<Employee> search(@PathVariable String name){
        return service.searchByName(name);
    }

    @PutMapping("/{id}")
    public Employee update(@PathVariable Long id,@RequestBody Employee e){
        return service.update(id,e);
    }

    @PatchMapping("/{id}/salary")
    public Employee patchSalary(@PathVariable Long id,@RequestParam double salary){
        return service.patchSalary(id,salary);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        service.delete(id);
    }
}
