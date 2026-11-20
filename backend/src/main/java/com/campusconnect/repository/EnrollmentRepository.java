package com.campusconnect.repository;

import com.campusconnect.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByStudent_IdAndCourse_Id(Long studentId, Long courseId);
    long countByStudent_Id(Long studentId);
    long countByCourse_Id(Long courseId);
}
