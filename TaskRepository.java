package com.example.todo.repository;

import com.example.todo.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByEmployeeId(Long empId);

    List<Task> findByEmployeeIdAndStatusContainsIgnoreCase(Long empId, String status);

    List<Task> findByEmployeeIdAndPriorityContainsIgnoreCase(Long empId, String priority);
}

