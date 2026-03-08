package com.example.ems.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.ems.entity.Department;
import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department,Long>{
    List<Department> findByNameContainingIgnoreCase(String name);
}