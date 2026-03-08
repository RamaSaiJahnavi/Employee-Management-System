package com.example.ems.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @Email
    private String email;

    @Min(1)
    private double salary;

    @ManyToOne
    @JoinColumn(name="department_id")
    @JsonIgnoreProperties("employees")
    private Department department;

    @ManyToMany
    @JoinTable(name="employee_project")
    @JsonIgnoreProperties("employees")
    private Set<Project> projects = new HashSet<>();

    public Employee(){}

    public Long getId(){return id;}
    public void setId(Long id){this.id=id;}

    public String getName(){return name;}
    public void setName(String name){this.name=name;}

    public String getEmail(){return email;}
    public void setEmail(String email){this.email=email;}

    public double getSalary(){return salary;}
    public void setSalary(double salary){this.salary=salary;}

    public Department getDepartment(){return department;}
    public void setDepartment(Department department){this.department=department;}

    public Set<Project> getProjects(){return projects;}
    public void setProjects(Set<Project> projects){this.projects=projects;}
}