package com.campusconnect.dto;

import jakarta.validation.constraints.*;

public record StudentRequest(
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Email @Size(max = 150) String email,
        @NotBlank @Size(max = 100) String department,
        @NotNull @Min(1) @Max(6) Integer yearOfStudy
) {}
