package com.example.ems.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @Min(value = 1, message = "Priority must be between 1 and 5")
    @Max(value = 5, message = "Priority must be between 1 and 5")
    private int priority;

    @Future(message = "Due date must be in future")
    private LocalDate dueDate;

    @ManyToOne
    @JoinColumn(name = "project_id")
    @JsonIgnoreProperties({"tasks","employees"})
    private Project project;

    public Task(){}

    public Long getId(){return id;}
    public void setId(Long id){this.id=id;}

    public String getTitle(){return title;}
    public void setTitle(String title){this.title=title;}

    public int getPriority(){return priority;}
    public void setPriority(int priority){this.priority=priority;}

    public LocalDate getDueDate(){return dueDate;}
    public void setDueDate(LocalDate dueDate){this.dueDate=dueDate;}

    public Project getProject(){return project;}
    public void setProject(Project project){this.project=project;}
}