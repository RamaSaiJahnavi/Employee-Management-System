package com.example.todo.services;

import com.example.todo.entity.Employee;
import com.example.todo.entity.Task;
import com.example.todo.exception.EmployeeNotFoundException;
import com.example.todo.exception.TaskNotFoundException;
import com.example.todo.repository.EmployeeRepository;
import com.example.todo.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository repo;


    public Employee add(Employee e) {
        return repo.save(e);
    }

    public List<Employee> getAll() {
        return repo.findByActiveTrue();
    }

    public Employee getById(Long id) {
        return repo.findById(id)
                .filter(Employee::isActive)
                .orElseThrow(() ->
                        new EmployeeNotFoundException("Employee not found: " + id));
    }

    public Employee update(Long id, Employee e) {
        Employee emp = getById(id);
        emp.setName(e.getName());
        emp.setDepartment(e.getDepartment());
        emp.setSalary(e.getSalary());
        return repo.save(emp);
    }

    public void deleteEmployee(Long id) {
        Employee emp = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        repo.delete(emp);
    }


    public List<Employee> getEmployeeByName(String name) {
        List<Employee> list = repo.getEmployeeByNameContainsIgnoreCase(name);

        if(list.isEmpty()) {
            throw new RuntimeException("Employee not found");
        }

        return list;
    }
}

