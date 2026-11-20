
package com.campusconnect.controller;

import com.campusconnect.dto.StudentImportResult;
import com.campusconnect.service.StudentImportService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/students")
public class StudentImportController {

    private final StudentImportService importService;

    public StudentImportController(StudentImportService importService) {
        this.importService = importService;
    }

    @PostMapping(
        value = "/import",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public StudentImportResult importStudents(
        @RequestParam("file") MultipartFile file
    ) {
        return importService.importStudents(file);
    }
}
