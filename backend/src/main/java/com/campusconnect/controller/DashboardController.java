package com.campusconnect.controller;

import com.campusconnect.repository.CourseRepository;
import com.campusconnect.repository.EnrollmentRepository;
import com.campusconnect.repository.StudentRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final StudentRepository students;
    private final CourseRepository courses;
    private final EnrollmentRepository enrollments;

    public DashboardController(StudentRepository students, CourseRepository courses,
                               EnrollmentRepository enrollments) {
        this.students = students;
        this.courses = courses;
        this.enrollments = enrollments;
    }

    @GetMapping
    public Map<String, Long> getStats() {
        return Map.of(
                "students", students.count(),
                "courses", courses.count(),
                "enrollments", enrollments.count()
        );
    }
}
