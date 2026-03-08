package com.example.ems.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @Future
    private LocalDate deadline;

    @ManyToMany(mappedBy="projects")
    @JsonIgnoreProperties("projects")
    private Set<Employee> employees = new HashSet<>();

    @OneToMany(mappedBy="project", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("project")
    private List<Task> tasks;

    public Project(){}

    public Long getId(){return id;}
    public void setId(Long id){this.id=id;}
    public String getTitle(){return title;}
    public void setTitle(String title){this.title=title;}
    public LocalDate getDeadline(){return deadline;}
    public void setDeadline(LocalDate deadline){this.deadline=deadline;}
    public Set<Employee> getEmployees(){return employees;}
    public void setEmployees(Set<Employee> employees){this.employees=employees;}
    public List<Task> getTasks(){
        return tasks;
    }

    public void setTasks(List<Task> tasks){
        this.tasks = tasks;
    }
}