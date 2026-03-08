package com.example.ems.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.ems.entity.Task;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task,Long>{
    List<Task> findByTitleContainingIgnoreCase(String title);
}