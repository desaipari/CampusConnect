package com.campusconnect.dto;

import java.util.List;

public record StudentImportResult(
        int imported,
        int skipped,
        List<String> errors
) {}