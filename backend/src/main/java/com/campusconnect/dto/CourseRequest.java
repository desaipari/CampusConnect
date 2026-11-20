package com.campusconnect.dto;

import jakarta.validation.constraints.*;

public record CourseRequest(
        @NotBlank @Size(max = 20) String code,
        @NotBlank @Size(max = 120) String title,
        @NotBlank @Size(max = 100) String department,
        @NotNull @Min(1) @Max(10) Integer credits,
        @NotBlank @Size(max = 100) String facultyName
) {}
