
package com.campusconnect.service;

import com.campusconnect.dto.StudentImportResult;
import com.campusconnect.entity.Student;
import com.campusconnect.repository.StudentRepository;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class StudentImportService {

    private final StudentRepository students;

    public StudentImportService(StudentRepository students) {
        this.students = students;
    }

    @Transactional
    public StudentImportResult importStudents(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please upload a non-empty CSV file.");
        }

        List<Student> validStudents = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        Set<String> knownEmails = new HashSet<>();

        students.findAll().forEach(student ->
                knownEmails.add(student.getEmail().toLowerCase(Locale.ROOT))
        );

        int skipped = 0;

        CSVFormat format = CSVFormat.DEFAULT.builder()
                .setHeader()
                .setSkipHeaderRecord(true)
                .setIgnoreHeaderCase(true)
                .setTrim(true)
                .build();

        try (
            Reader reader = new InputStreamReader(
                    file.getInputStream(),
                    StandardCharsets.UTF_8
            );

            CSVParser parser = format.parse(reader)
        ) {

            Set<String> headers = new HashSet<>();

            parser.getHeaderMap().keySet().forEach(header ->
                    headers.add(header.toLowerCase(Locale.ROOT))
            );

            Set<String> requiredHeaders = Set.of(
                    "name",
                    "email",
                    "department",
                    "yearofstudy"
            );

            if (!headers.containsAll(requiredHeaders)) {
                throw new IllegalArgumentException(
                        "CSV must contain these columns: name, email, department, yearOfStudy"
                );
            }

            for (CSVRecord row : parser) {

                try {

                    String name = row.get("name").trim();
                    String email = row.get("email").trim().toLowerCase(Locale.ROOT);
                    String department = row.get("department").trim();
                    String yearText = row.get("yearOfStudy").trim();

                    if (name.isBlank() || email.isBlank() || department.isBlank()) {
                        throw new IllegalArgumentException(
                                "Name, email and department are required."
                        );
                    }

                    if (name.length() > 100 ||
                        email.length() > 150 ||
                        department.length() > 100) {

                        throw new IllegalArgumentException(
                                "One or more fields exceed their allowed length."
                        );
                    }

                    if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
                        throw new IllegalArgumentException("Invalid email address.");
                    }

                    int year;

                    try {
                        year = Integer.parseInt(yearText);
                    } catch (NumberFormatException ex) {
                        throw new IllegalArgumentException(
                                "Year of study must be a number."
                        );
                    }

                    if (year < 1 || year > 6) {
                        throw new IllegalArgumentException(
                                "Year of study must be between 1 and 6."
                        );
                    }

                    if (!knownEmails.add(email)) {
                        throw new IllegalArgumentException(
                                "Duplicate email address."
                        );
                    }

                    validStudents.add(
                            new Student(name, email, department, year)
                    );

                } catch (RuntimeException ex) {

                    skipped++;

                    if (errors.size() < 50) {
                        errors.add(
                                "Row " + row.getRecordNumber()
                                + ": " + ex.getMessage()
                        );
                    }
                }
            }

            students.saveAll(validStudents);

            return new StudentImportResult(
                    validStudents.size(),
                    skipped,
                    errors
            );

        } catch (IOException ex) {

            throw new IllegalArgumentException(
                    "Unable to read the CSV file: " + ex.getMessage()
            );
        }
    }
}
