package com.campusconnect.service;

import com.campusconnect.dto.StudentRequest;
import com.campusconnect.entity.Student;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.EnrollmentRepository;
import com.campusconnect.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentService {
    private final StudentRepository students;
    private final EnrollmentRepository enrollments;

    public StudentService(StudentRepository students, EnrollmentRepository enrollments) {
        this.students = students;
        this.enrollments = enrollments;
    }

    public List<Student> findAll() { return students.findAll(); }

    public Student findById(Long id) {
        return students.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + id));
    }

    public Student create(StudentRequest request) {
        if (students.existsByEmailIgnoreCase(request.email())) {
            throw new IllegalArgumentException("A student with this email already exists.");
        }
        return students.save(new Student(request.name(), request.email(), request.department(), request.yearOfStudy()));
    }

    public Student update(Long id, StudentRequest request) {
        Student student = findById(id);
        if (students.existsByEmailIgnoreCaseAndIdNot(request.email(), id)) {
            throw new IllegalArgumentException("Another student already uses this email.");
        }
        student.setName(request.name());
        student.setEmail(request.email());
        student.setDepartment(request.department());
        student.setYearOfStudy(request.yearOfStudy());
        return students.save(student);
    }

    @Transactional
    public void delete(Long id) {
        Student student = findById(id);
        if (enrollments.countByStudent_Id(id) > 0) {
            throw new IllegalArgumentException("Remove this student's enrollments before deleting the student.");
        }
        students.delete(student);
    }
}
