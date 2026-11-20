package com.campusconnect.controller;

import com.campusconnect.dto.EnrollmentRequest;
import com.campusconnect.dto.GradeRequest;
import com.campusconnect.entity.Enrollment;
import com.campusconnect.service.EnrollmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {
    private final EnrollmentService service;

    public EnrollmentController(EnrollmentService service) { this.service = service; }

    @GetMapping
    public List<Enrollment> getAll() { return service.findAll(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Enrollment create(@Valid @RequestBody EnrollmentRequest request) {
        return service.create(request);
    }

    @PatchMapping("/{id}/grade")
    public Enrollment updateGrade(@PathVariable Long id, @Valid @RequestBody GradeRequest request) {
        return service.updateGrade(id, request.grade());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }
}
