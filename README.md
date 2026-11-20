# CampusConnect

A full-stack university management application built with Java 17, Spring Boot, Spring Data JPA, MySQL, React, JavaScript, HTML and CSS.

## Features
- Dashboard counts for students, courses and enrollments
- Create, view, update and delete students
- Create, view, update and delete courses
- Enroll a student in a course
- View enrollments, assign/update grades and remove enrollments
- Request validation, duplicate checks and centralized API error handling

## Requirements
- Java 17+
- Maven 3.9+ (or use an IDE's Maven integration)
- Node.js 20+ and npm
- MySQL 8+

## 1. Create the database

Start MySQL and run:

```sql
CREATE DATABASE campusconnect;
```

The backend uses the local MySQL account `root` by default. Set your own credentials in `backend/src/main/resources/application.properties` or through environment variables:

- `DB_URL` (default `jdbc:mysql://localhost:3306/campusconnect?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`)
- `DB_USERNAME` (default `root`)
- `DB_PASSWORD` (default `password`)

Do not commit real database passwords to a public repository.

## 2. Run the backend

From the `backend` directory:

```bash
mvn spring-boot:run
```

Backend base URL: `http://localhost:8081/api`

The schema is created/updated automatically for this development project (`spring.jpa.hibernate.ddl-auto=update`).

## 3. Run the frontend

Open a second terminal, from the `frontend` directory:

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## API overview

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/dashboard` | Dashboard counts |
| GET, POST | `/api/students` | List/create students |
| GET, PUT, DELETE | `/api/students/{id}` | Read/update/delete a student |
| GET, POST | `/api/courses` | List/create courses |
| GET, PUT, DELETE | `/api/courses/{id}` | Read/update/delete a course |
| GET, POST | `/api/enrollments` | List/create enrollments |
| PATCH | `/api/enrollments/{id}/grade` | Assign/update a grade |
| DELETE | `/api/enrollments/{id}` | Delete an enrollment |

### Example requests

Create a student:

```json
{
  "name": "Aarav Mehta",
  "email": "aarav@example.com",
  "department": "Information Technology",
  "yearOfStudy": 3
}
```

Create a course:

```json
{
  "code": "IT301",
  "title": "Database Management Systems",
  "department": "Information Technology",
  "credits": 4,
  "facultyName": "Dr. Sharma"
}
```

Enroll a student:

```json
{
  "studentId": 1,
  "courseId": 1
}
```

Assign a grade:

```json
{
  "grade": "A"
}
```

## Project structure

```text
campusconnect/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/campusconnect/
│       ├── CampusConnectApplication.java
│       ├── config/
│       ├── controller/
│       ├── dto/
│       ├── entity/
│       ├── exception/
│       ├── repository/
│       └── service/
└── frontend/
    ├── package.json
    ├── index.html
    └── src/
        ├── api.js
        ├── App.jsx
        ├── main.jsx
        └── styles.css
```

## Notes
This is a compact learning/demo application, not a production student information system. Before production use, add authentication/authorization, database migrations, automated tests, audit logging, pagination and deployment configuration.
