package com.example.ems.service;

import com.example.ems.exception.InvalidDataException;
import org.springframework.stereotype.Service;
import java.util.*;

import com.example.ems.entity.Project;
import com.example.ems.entity.Employee;
import com.example.ems.repository.ProjectRepository;
import com.example.ems.repository.EmployeeRepository;
import com.example.ems.exception.ResourceNotFoundException;

@Service
public class ProjectService {

    private final ProjectRepository repo;
    private final EmployeeRepository employeeRepo;

    public ProjectService(ProjectRepository repo,
                          EmployeeRepository employeeRepo){
        this.repo = repo;
        this.employeeRepo = employeeRepo;
    }

    //  CREATE PROJECT WITH EMPLOYEE SYNC
    public Project create(Project p){
        if(p.getTitle() == null || p.getTitle().isEmpty()){
            throw new InvalidDataException("Project title cannot be null or empty");
        }

        if(p.getEmployees()!=null){

            Set<Employee> managedEmployees = new HashSet<>();

            for(Employee e : p.getEmployees()){

                Employee emp = employeeRepo.findById(e.getId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Employee not found"));

                managedEmployees.add(emp);

                emp.getProjects().add(p); // 🔥 bidirectional sync
            }

            p.setEmployees(managedEmployees);
        }

        return repo.save(p);
    }

    // GET ALL
    public List<Project> getAll(){
        return repo.findAll();
    }

    // GET BY ID
    public Project getById(Long id){
        return repo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Project not found"));
    }

    // SEARCH
    public List<Project> searchByTitle(String title){
        return repo.findByTitleContainingIgnoreCase(title);
    }

    //  UPDATE WITH EMPLOYEE SYNC
    public Project update(Long id, Project data){

        Project p = getById(id);
        if(data.getTitle() == null || data.getTitle().isEmpty()){
            throw new InvalidDataException("Project title cannot be null or empty");
        }

        p.setTitle(data.getTitle());
        p.setDeadline(data.getDeadline());

        if(data.getEmployees()!=null){

            p.getEmployees().clear();

            for(Employee e : data.getEmployees()){

                Employee emp = employeeRepo.findById(e.getId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Employee not found"));

                p.getEmployees().add(emp);
                emp.getProjects().add(p); // sync reverse side
            }
        }

        return repo.save(p);
    }

    // DELETE
    public void delete(Long id){

        Project p = getById(id);

        for(Employee e : p.getEmployees()){
            e.getProjects().remove(p); // remove relation
        }

        repo.delete(p);
    }
}