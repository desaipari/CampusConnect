package com.campusconnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record GradeRequest(
        @NotBlank @Pattern(regexp = "A\\+?|B\\+?|C\\+?|D|F", message = "Grade must be A+, A, B+, B, C+, C, D or F")
        String grade
) {}
