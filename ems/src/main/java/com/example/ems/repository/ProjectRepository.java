package com.example.ems.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.ems.entity.Project;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project,Long>{
    List<Project> findByTitleContainingIgnoreCase(String title);
}