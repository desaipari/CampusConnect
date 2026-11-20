package com.campusconnect.service;

import com.campusconnect.dto.EnrollmentRequest;
import com.campusconnect.entity.Course;
import com.campusconnect.entity.Enrollment;
import com.campusconnect.entity.Student;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.CourseRepository;
import com.campusconnect.repository.EnrollmentRepository;
import com.campusconnect.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
public class EnrollmentService {
    private final EnrollmentRepository enrollments;
    private final StudentRepository students;
    private final CourseRepository courses;

    public EnrollmentService(EnrollmentRepository enrollments, StudentRepository students, CourseRepository courses) {
        this.enrollments = enrollments;
        this.students = students;
        this.courses = courses;
    }

    public List<Enrollment> findAll() { return enrollments.findAll(); }

    public Enrollment create(EnrollmentRequest request) {
        Student student = students.findById(request.studentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + request.studentId()));
        Course course = courses.findById(request.courseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + request.courseId()));
        if (enrollments.existsByStudent_IdAndCourse_Id(student.getId(), course.getId())) {
            throw new IllegalArgumentException("This student is already enrolled in this course.");
        }
        return enrollments.save(new Enrollment(student, course));
    }

    public Enrollment updateGrade(Long id, String grade) {
        Enrollment enrollment = enrollments.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found: " + id));
        enrollment.setGrade(grade.trim().toUpperCase(Locale.ROOT));
        return enrollments.save(enrollment);
    }

    public void delete(Long id) {
        if (!enrollments.existsById(id)) {
            throw new ResourceNotFoundException("Enrollment not found: " + id);
        }
        enrollments.deleteById(id);
    }
}
