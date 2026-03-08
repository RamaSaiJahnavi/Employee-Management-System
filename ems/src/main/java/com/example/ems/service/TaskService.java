package com.example.ems.service;

import com.example.ems.exception.InvalidDataException;
import org.springframework.stereotype.Service;
import java.util.List;

import com.example.ems.entity.Task;
import com.example.ems.entity.Project;
import com.example.ems.repository.TaskRepository;
import com.example.ems.repository.ProjectRepository;
import com.example.ems.exception.ResourceNotFoundException;

@Service
public class TaskService {

    private final TaskRepository repo;
    private final ProjectRepository projectRepo;

    public TaskService(TaskRepository repo,
                       ProjectRepository projectRepo){
        this.repo = repo;
        this.projectRepo = projectRepo;
    }

    // CREATE
    public Task create(Task t){

        if(t.getTitle() == null || t.getTitle().isEmpty()){
            throw new InvalidDataException("Task title cannot be null or empty");
        }

        if(t.getPriority() < 0){
            throw new InvalidDataException("Priority cannot be negative");
        }

        if(t.getProject()!=null && t.getProject().getId()!=null){

            Project project = projectRepo
                    .findById(t.getProject().getId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Project not found"));

            t.setProject(project);

            project.getTasks().add(t);   // bidirectional sync
        }

        return repo.save(t);
    }

    // GET ALL
    public List<Task> getAll(){
        return repo.findAll();
    }

    // GET BY ID
    public Task getById(Long id){
        return repo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Task not found"));
    }

    // SEARCH
    public List<Task> searchByTitle(String title){
        if(title == null || title.isEmpty()){
            throw new InvalidDataException("Search title cannot be null or empty");
        }
        return repo.findByTitleContainingIgnoreCase(title);
    }

    // UPDATE
    public Task update(Long id,Task data){

        Task t = getById(id);

        if(data.getTitle() == null || data.getTitle().isEmpty()){
            throw new InvalidDataException("Task title cannot be null or empty");
        }

        t.setTitle(data.getTitle());
        t.setPriority(data.getPriority());
        t.setDueDate(data.getDueDate());

        if(data.getProject()!=null && data.getProject().getId()!=null){

            Project project = projectRepo
                    .findById(data.getProject().getId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Project not found"));

            t.setProject(project);

            if(!project.getTasks().contains(t)){
                project.getTasks().add(t); //  sync update
            }
        }

        return repo.save(t);
    }

    // PATCH PRIORITY
    public Task patchPriority(Long id,int priority){
        if(priority < 0){
            throw new InvalidDataException("Priority cannot be negative");
        }

        Task t = getById(id);
        t.setPriority(priority);

        return repo.save(t);
    }

    // DELETE
    public void delete(Long id){

        Task t = getById(id);

        if(t.getProject()!=null){
            t.getProject().getTasks().remove(t); // remove relation
        }

        repo.delete(t);
    }
}