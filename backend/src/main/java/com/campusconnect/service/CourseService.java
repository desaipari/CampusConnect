package com.campusconnect.service;

import com.campusconnect.dto.CourseRequest;
import com.campusconnect.entity.Course;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.CourseRepository;
import com.campusconnect.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CourseService {
    private final CourseRepository courses;
    private final EnrollmentRepository enrollments;

    public CourseService(CourseRepository courses, EnrollmentRepository enrollments) {
        this.courses = courses;
        this.enrollments = enrollments;
    }

    public List<Course> findAll() { return courses.findAll(); }

    public Course findById(Long id) {
        return courses.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + id));
    }

    public Course create(CourseRequest request) {
        if (courses.existsByCodeIgnoreCase(request.code())) {
            throw new IllegalArgumentException("A course with this code already exists.");
        }
        return courses.save(new Course(request.code(), request.title(), request.department(),
                request.credits(), request.facultyName()));
    }

    public Course update(Long id, CourseRequest request) {
        Course course = findById(id);
        if (courses.existsByCodeIgnoreCaseAndIdNot(request.code(), id)) {
            throw new IllegalArgumentException("Another course already uses this code.");
        }
        course.setCode(request.code());
        course.setTitle(request.title());
        course.setDepartment(request.department());
        course.setCredits(request.credits());
        course.setFacultyName(request.facultyName());
        return courses.save(course);
    }

    @Transactional
    public void delete(Long id) {
        Course course = findById(id);
        if (enrollments.countByCourse_Id(id) > 0) {
            throw new IllegalArgumentException("Remove this course's enrollments before deleting the course.");
        }
        courses.delete(course);
    }
}
