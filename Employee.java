package com.example.todo.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    private String department;

    @Positive(message = "Salary must be positive")
    private double salary;

    private boolean active = true; // SOFT DELETE

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
  //  @JsonManagedReference
    private List<Task> tasks = new ArrayList<>();

}

