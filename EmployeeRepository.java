package com.example.todo.repository;

import com.example.todo.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByActiveTrue();
    List<Employee> getEmployeeByNameContainsIgnoreCase(String name);
}

