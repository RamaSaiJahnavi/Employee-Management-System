package com.example.ems.service;

import com.example.ems.entity.Project;
import com.example.ems.entity.Employee;
import com.example.ems.entity.Department;
import com.example.ems.repository.EmployeeRepository;
import com.example.ems.repository.DepartmentRepository;
import com.example.ems.repository.ProjectRepository;
import com.example.ems.exception.*;

import org.springframework.stereotype.Service;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class EmployeeService {

    private final EmployeeRepository repo;
    private final DepartmentRepository departmentRepo;
    private final ProjectRepository projectRepo;

    public EmployeeService(EmployeeRepository repo,
                           DepartmentRepository departmentRepo,
                           ProjectRepository projectRepo){
        this.repo = repo;
        this.departmentRepo = departmentRepo;
        this.projectRepo = projectRepo;
    }

    // CREATE WITH DEPARTMENT + PROJECT SYNC
    public Employee create(Employee e){

        // ---------- Validation ----------
        if(e.getName() == null || e.getName().isEmpty()){
            throw new InvalidDataException("Employee name cannot be null or empty");
        }

        if(e.getEmail() == null || e.getEmail().isEmpty()){
            throw new InvalidDataException("Employee email cannot be null or empty");
        }

        if(e.getSalary() < 0){
            throw new InvalidDataException("Salary cannot be negative");
        }

        // ---------- Duplicate Email Check ----------
        List<Employee> existingEmail = repo.findByEmail(e.getEmail());
        if(!existingEmail.isEmpty()){
            throw new DuplicateResourceException("Employee with this email already exists");
        }

        // ---------- Department Sync ----------
        if(e.getDepartment() != null && e.getDepartment().getId() != null){
            Department dept = departmentRepo.findById(e.getDepartment().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

            e.setDepartment(dept);
            dept.getEmployees().add(e);
        }

        // ---------- Project Sync ----------
        if(e.getProjects() != null){
            Set<Project> managedProjects = new HashSet<>();
            for(Project p : e.getProjects()){
                Project project = projectRepo.findById(p.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
                managedProjects.add(project);
                project.getEmployees().add(e); // bidirectional sync
            }
            e.setProjects(managedProjects);
        }

        return repo.save(e);
    }

    // GET ALL
    public List<Employee> getAll(){
        return repo.findAll();
    }

    // GET BY ID
    public Employee getById(Long id){
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));
    }

    // SEARCH BY NAME
    public List<Employee> searchByName(String name){
        if(name == null || name.isEmpty()){
            throw new InvalidDataException("Search name cannot be null or empty");
        }
        return repo.findByNameContainingIgnoreCase(name);
    }

    // UPDATE
    public Employee update(Long id, Employee newData){

        Employee e = getById(id);

        // ---------- Validation ----------
        if(newData.getName() == null || newData.getName().isEmpty()){
            throw new InvalidDataException("Employee name cannot be null or empty");
        }

        if(newData.getEmail() == null || newData.getEmail().isEmpty()){
            throw new InvalidDataException("Employee email cannot be null or empty");
        }

        if(newData.getSalary() < 0){
            throw new InvalidDataException("Salary cannot be negative");
        }

        // ---------- Duplicate Email Check ----------
        List<Employee> existingEmail = repo.findByEmail(newData.getEmail());
        for(Employee emp : existingEmail){
            if(!emp.getId().equals(id)){
                throw new DuplicateResourceException("Another employee with this email already exists");
            }
        }

        // ---------- Update Fields ----------
        e.setName(newData.getName());
        e.setEmail(newData.getEmail());
        e.setSalary(newData.getSalary());

        // ---------- Department Sync ----------
        if(newData.getDepartment() != null && newData.getDepartment().getId() != null){
            Department dept = departmentRepo.findById(newData.getDepartment().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

            e.setDepartment(dept);

            if(!dept.getEmployees().contains(e)){
                dept.getEmployees().add(e);
            }
        }

        return repo.save(e);
    }

    // PATCH SALARY
    public Employee patchSalary(Long id, double salary){
        if(salary < 0){
            throw new InvalidDataException("Salary cannot be negative");
        }

        Employee e = getById(id);
        e.setSalary(salary);

        return repo.save(e);
    }

    // DELETE
    public void delete(Long id){
        Employee e = getById(id);

        if(e.getDepartment() != null){
            e.getDepartment().getEmployees().remove(e); // remove relation
        }

        repo.delete(e);
    }
}