package com.campusconnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(nullable = false, length = 100)
    private String department;

    @Column(nullable = false)
    private Integer credits;

    @Column(nullable = false, length = 100)
    private String facultyName;

    public Course() {}

    public Course(String code, String title, String department, Integer credits, String facultyName) {
        this.code = code;
        this.title = title;
        this.department = department;
        this.credits = credits;
        this.facultyName = facultyName;
    }

    public Long getId() { return id; }
    public String getCode() { return code; }
    public String getTitle() { return title; }
    public String getDepartment() { return department; }
    public Integer getCredits() { return credits; }
    public String getFacultyName() { return facultyName; }

    public void setCode(String code) { this.code = code; }
    public void setTitle(String title) { this.title = title; }
    public void setDepartment(String department) { this.department = department; }
    public void setCredits(Integer credits) { this.credits = credits; }
    public void setFacultyName(String facultyName) { this.facultyName = facultyName; }
}
