package com.example.ems.service;

import com.example.ems.exception.InvalidDataException;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.ems.entity.Department;
import com.example.ems.repository.DepartmentRepository;
import com.example.ems.exception.ResourceNotFoundException;

@Service
public class DepartmentService {

    private final DepartmentRepository repo;

    public DepartmentService(DepartmentRepository repo){
        this.repo=repo;
    }

    public Department create(Department d){ return repo.save(d); }

    public List<Department> getAll(){ return repo.findAll(); }

    public Department getById(Long id){
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
    }

    public List<Department> searchByName(String name){
        if(name == null || name.isEmpty()){
            throw new InvalidDataException("Search name cannot be null or empty");
        }
        return repo.findByNameContainingIgnoreCase(name);
    }

    public Department update(Long id,Department data){
        Department d=getById(id);
        if(data.getName() == null || data.getName().isEmpty()){
            throw new InvalidDataException("Department name cannot be null or empty");
        }
        d.setName(data.getName());
        d.setLocation(data.getLocation());
        return repo.save(d);
    }

    public void delete(Long id){
        repo.delete(getById(id));
    }
}