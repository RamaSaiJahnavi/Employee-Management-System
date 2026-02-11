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
public class TaskService {

    @Autowired
    private TaskRepository taskRepo;

    @Autowired
    private EmployeeRepository empRepo;

    public Task addTask(Long empId, Task task) {
        Employee emp = empRepo.findById(empId)
                .orElseThrow(() ->
                        new EmployeeNotFoundException("Employee not found: " + empId));
        task.setEmployee(emp);
        task.setStatus("PENDING");
        return taskRepo.save(task);
    }

    public List<Task> getTasks(Long empId) {
        return taskRepo.findByEmployeeId(empId);
    }

    public Task update(Long id, Task t) {
        Task task = taskRepo.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task not found: " + id));
        task.setTitle(t.getTitle());
        task.setPriority(t.getPriority());
        task.setDescription(t.getDescription());
        return taskRepo.save(task);
    }

    public Task complete(Long id) {
        Task task = taskRepo.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task not found: " + id));
        task.setStatus("COMPLETED");
        return taskRepo.save(task);
    }

    public void delete(Long id) {
        Task task = taskRepo.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task not found: " + id));
        taskRepo.delete(task);
    }

    public List<Task> filterByStatus(Long empId, String status) {
        return taskRepo.findByEmployeeIdAndStatusContainsIgnoreCase(empId, status);
    }

    public List<Task> filterByPriority(Long empId, String priority) {
        return taskRepo.findByEmployeeIdAndPriorityContainsIgnoreCase(empId, priority);
    }
    public Task getTaskById(Long id){
        return taskRepo.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task not found"));
    }
}

