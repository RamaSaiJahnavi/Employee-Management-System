package com.example.ems.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.ems.entity.Employee;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee,Long>{
    List<Employee> findByNameContainingIgnoreCase(String name);
    List<Employee> findByEmail (String email);
}