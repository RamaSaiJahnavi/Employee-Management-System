package com.example.ems.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Department name is mandatory")
    @Size(max = 100, message = "Department name must be less than 100 characters")
    private String name;

    @Size(max = 200, message = "Location name must be less than 200 characters")
    private String location;

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
    private List<Employee> employees = new ArrayList<>();

    public Department() {}

    public Long getId(){return id;}
    public void setId(Long id){this.id=id;}
    public String getName(){return name;}
    public void setName(String name){this.name=name;}
    public String getLocation(){return location;}
    public void setLocation(String location){this.location=location;}

    public List<Employee> getEmployees(){return employees;}
    public void setEmployees(List<Employee> employees){this.employees=employees;}
}