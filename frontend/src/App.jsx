import { useEffect, useMemo, useState } from 'react';
import { api } from './api';
import SearchableSelect from './SearchableSelect';

const PAGE_SIZE = 20;

const emptyStudent = { name: '', email: '', department: '', yearOfStudy: '1' };
const emptyCourse = { code: '', title: '', department: '', credits: '3', facultyName: '' };

function App() {
  const [active, setActive] = useState('Overview');
  const [stats, setStats] = useState({ students: 0, courses: 0, enrollments: 0 });
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [studentForm, setStudentForm] = useState(emptyStudent);
  const [courseForm, setCourseForm] = useState(emptyCourse);
  const [enrollForm, setEnrollForm] = useState({ studentId: '', courseId: '' });
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState({ type: '', text: '' });
  const [search, setSearch] = useState('');
  const [studentPage, setStudentPage] = useState(1);
const [coursePage, setCoursePage] = useState(1);

  async function loadAll() {
    const [dashboard, studentRows, courseRows, enrollmentRows] = await Promise.all([
      api.dashboard(), api.students(), api.courses(), api.enrollments()
    ]);
    setStats(dashboard);
    setStudents(studentRows);
    setCourses(courseRows);
    setEnrollments(enrollmentRows);
  }

  useEffect(() => {
    loadAll().catch((error) => setNotice({ type: 'error', text: error.message }));
  }, []);

  async function run(action, successMessage) {
  setBusy(true);
  setNotice({ type: '', text: '' });

  try {
    await action();
    await loadAll();
    setNotice({ type: 'success', text: successMessage });
    return true;
  } catch (error) {
    setNotice({ type: 'error', text: error.message });
    return false;
  } finally {
    setBusy(false);
  }
}
async function handleStudentImport(event) {

  const file = event.target.files?.[0];

  if (!file) return;

  if (!file.name.toLowerCase().endsWith('.csv')) {
    setNotice({
      type: 'error',
      text: 'Please select a CSV file.'
    });

    event.target.value = '';
    return;
  }

  setBusy(true);

  setNotice({ type: '', text: '' });

  try {

    const result = await api.importStudents(file);

    await loadAll();

    const errorDetails = result.errors?.length
      ? ` First errors: ${result.errors.slice(0, 3).join(' | ')}`
      : '';

    setNotice({
      type: 'success',
      text: `Import completed. ${result.imported} students imported and ${result.skipped} skipped.${errorDetails}`
    });

    setStudentPage(1);

  } catch (error) {

    setNotice({
      type: 'error',
      text: error.message
    });

  } finally {

    setBusy(false);
    event.target.value = '';

  }
}
  function submitStudent(event) {
    event.preventDefault();
    const body = { ...studentForm, yearOfStudy: Number(studentForm.yearOfStudy) };
    run(
      () => editingStudent
        ? api.updateStudent(editingStudent, body)
        : api.createStudent(body),
      editingStudent ? 'Student updated successfully.' : 'Student added successfully.'
    ).then((success) => {
  if (success) {
    setStudentForm(emptyStudent);
    setEditingStudent(null);
  }
});
  }

  function editStudent(student) {
    setStudentForm({
      name: student.name, email: student.email, department: student.department,
      yearOfStudy: String(student.yearOfStudy)
    });
    setEditingStudent(student.id);
    setActive('Students');
  }

  function submitCourse(event) {
    event.preventDefault();
    const body = { ...courseForm, credits: Number(courseForm.credits) };
    run(
      () => editingCourse
        ? api.updateCourse(editingCourse, body)
        : api.createCourse(body),
      editingCourse ? 'Course updated successfully.' : 'Course added successfully.'
   ).then((success) => {
  if (success) {
    setCourseForm(emptyCourse);
    setEditingCourse(null);
  }
});
  }
  function editCourse(course) {
    setCourseForm({
      code: course.code, title: course.title, department: course.department,
      credits: String(course.credits), facultyName: course.facultyName
    });
    setEditingCourse(course.id);
    setActive('Courses');
  }

 const filteredStudents = useMemo(() =>
  students.filter((student) =>
    `${student.id} ${student.name} ${student.email} ${student.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  ),
  [students, search]
);

const filteredCourses = useMemo(() =>
  courses.filter((course) =>
    `${course.code} ${course.title} ${course.department} ${course.facultyName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  ),
  [courses, search]
);

const totalStudentPages = Math.max(
  1,
  Math.ceil(filteredStudents.length / PAGE_SIZE)
);

const totalCoursePages = Math.max(
  1,
  Math.ceil(filteredCourses.length / PAGE_SIZE)
);

const visibleStudents = filteredStudents.slice(
  (studentPage - 1) * PAGE_SIZE,
  studentPage * PAGE_SIZE
);

const visibleCourses = filteredCourses.slice(
  (coursePage - 1) * PAGE_SIZE,
  coursePage * PAGE_SIZE
);
useEffect(() => {
  if (studentPage > totalStudentPages) {
    setStudentPage(totalStudentPages);
  }
}, [studentPage, totalStudentPages]);

useEffect(() => {
  if (coursePage > totalCoursePages) {
    setCoursePage(totalCoursePages);
  }
}, [coursePage, totalCoursePages]);
  const navItems = [
    ['Overview', '▦'], ['Students', '♙'], ['Courses', '▤'], ['Enrollments', '⇄']
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">C</div><div><strong>CampusConnect</strong><span>ACADEMIC PORTAL</span></div></div>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          {navItems.map(([name, icon]) => (
            <button key={name} className={`nav-item ${active === name ? 'active' : ''}`} onClick={() => { setActive(name); setSearch(''); }}>
              <span className="nav-icon">{icon}</span>{name}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom"><div className="avatar">AD</div><div><strong>Administrator</strong><span>Campus Admin</span></div></div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div><div className="eyebrow">UNIVERSITY MANAGEMENT</div><h1>{active}</h1></div>
          <div className="topbar-right"><span className="status-dot"></span><span>System online</span><div className="top-avatar">AD</div></div>
        </header>

        <section className="page-content">
          {notice.text && <div className={`notice ${notice.type}`}>{notice.text}<button onClick={() => setNotice({ type: '', text: '' })}>×</button></div>}

          {active === 'Overview' && (
            <>
              <div className="welcome-row"><div><h2>Welcome back, Administrator</h2><p>Here's what's happening across your campus today.</p></div><span className="date-chip">{new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
              <div className="stats-grid">
                <StatCard label="Total Students" value={stats.students} icon="♙" tone="blue" detail="Registered students" />
                <StatCard label="Active Courses" value={stats.courses} icon="▤" tone="purple" detail="Available courses" />
                <StatCard label="Enrollments" value={stats.enrollments} icon="⇄" tone="green" detail="Course registrations" />
              </div>
              <div className="overview-grid">
                <div className="panel"><div className="panel-heading"><div><h3>Recent students</h3><p>Latest student records</p></div><button className="text-button" onClick={() => {
  setSearch('');
  setStudentPage(1);
  setActive('Students');
}}>View all →</button></div>
                  {students.slice(-5).reverse().map((student) => <div className="mini-row" key={student.id}><div className="person-avatar">{student.name?.charAt(0).toUpperCase()}</div><div className="mini-main"><strong>{student.name}</strong><span>{student.department}</span></div><span className="year-pill">Year {student.yearOfStudy}</span></div>)}
                  {students.length === 0 && <Empty text="No students added yet." />}
                </div>
                <div className="panel"><div className="panel-heading"><div><h3>Course catalogue</h3><p>Recently added courses</p></div><button className="text-button" onClick={() => {
  setSearch('');
  setCoursePage(1);
  setActive('Courses');
}}>View all →</button></div>
                  {courses.slice(-5).reverse().map((course) => <div className="course-row" key={course.id}><div className="course-icon">▤</div><div className="mini-main"><strong>{course.title}</strong><span>{course.code} · {course.credits} credits</span></div></div>)}
                  {courses.length === 0 && <Empty text="No courses added yet." />}
                </div>
              </div>
            </>
          )}

          {active === 'Students' && (
            <div className="content-grid">
              <div className="panel form-panel"><div className="panel-heading"><div><h3>{editingStudent ? 'Edit student' : 'Add a student'}</h3><p>Enter student information below.</p></div></div>
                <form onSubmit={submitStudent}>
                  <Field label="Full name"><input required maxLength="100" value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} placeholder="e.g. Aisha Patel" /></Field>
                  <Field label="Email address"><input required type="email" maxLength="150" value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} placeholder="student@university.edu" /></Field>
                  <Field label="Department"><input required value={studentForm.department} onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })} placeholder="e.g. Information Technology" /></Field>
                  <Field label="Year of study"><select value={studentForm.yearOfStudy} onChange={(e) => setStudentForm({ ...studentForm, yearOfStudy: e.target.value })}>{[1,2,3,4,5,6].map((n) => <option key={n} value={n}>Year {n}</option>)}</select></Field>
                  <div className="form-actions"><button className="primary-button" disabled={busy}>{editingStudent ? 'Save changes' : 'Add student'}</button>{editingStudent && <button type="button" className="secondary-button" onClick={() => { setEditingStudent(null); setStudentForm(emptyStudent); }}>Cancel</button>}</div>
                </form>
              </div>
<div className="panel table-panel">

  <div className="panel-heading">

    <div>
      <h3>Student directory</h3>
      <p>{students.length} registered students</p>
    </div>

    <div className="import-actions">

      <a
        href="/student-import-template.csv"
        download
        className="text-button"
      >
        CSV template
      </a>

      <label className="secondary-button import-button">

        {busy ? 'Processing...' : 'Import CSV'}

        <input
          type="file"
          accept=".csv,text/csv"
          onChange={handleStudentImport}
          disabled={busy}
        />

      </label>

    </div>

  </div>                <Search
  value={search}
  onChange={(value) => {
    setSearch(value);
    setStudentPage(1);
  }}
/>
                <div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>DEPARTMENT</th><th>YEAR</th><th>ACTIONS</th></tr></thead><tbody>
                  {visibleStudents.map((student) =>  <tr key={student.id}><td><div className="table-person"><div className="person-avatar">{student.name.charAt(0).toUpperCase()}</div><div><strong>{student.name}</strong><span>{student.email}</span></div></div></td><td>{student.department}</td><td><span className="year-pill">Year {student.yearOfStudy}</span></td><td><div className="actions"><button onClick={() => editStudent(student)}>Edit</button><button className="danger-text" onClick={() => { if (confirm('Delete this student?')) run(() => api.deleteStudent(student.id), 'Student deleted.'); }}>Delete</button></div></td></tr>)}
                </tbody></table>{filteredStudents.length === 0 && <Empty text="No matching students." />}</div>
                <Pagination
  currentPage={studentPage}
  totalPages={totalStudentPages}
  total={filteredStudents.length}
  onPageChange={setStudentPage}
/>
              </div>
            </div>
          )}

          {active === 'Courses' && (
            <div className="content-grid">
              <div className="panel form-panel"><div className="panel-heading"><div><h3>{editingCourse ? 'Edit course' : 'Add a course'}</h3><p>Enter course information below.</p></div></div>
                <form onSubmit={submitCourse}>
                  <Field label="Course code"><input required maxLength="20" value={courseForm.code} onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })} placeholder="e.g. IT301" /></Field>
                  <Field label="Course title"><input required value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} placeholder="e.g. Database Systems" /></Field>
                  <Field label="Department"><input required value={courseForm.department} onChange={(e) => setCourseForm({ ...courseForm, department: e.target.value })} placeholder="e.g. Information Technology" /></Field>
                  <Field label="Credits"><input required type="number" min="1" max="10" value={courseForm.credits} onChange={(e) => setCourseForm({ ...courseForm, credits: e.target.value })} /></Field>
                  <Field label="Faculty name"><input required value={courseForm.facultyName} onChange={(e) => setCourseForm({ ...courseForm, facultyName: e.target.value })} placeholder="e.g. Dr. Mehta" /></Field>
                  <div className="form-actions"><button className="primary-button" disabled={busy}>{editingCourse ? 'Save changes' : 'Add course'}</button>{editingCourse && <button type="button" className="secondary-button" onClick={() => { setEditingCourse(null); setCourseForm(emptyCourse); }}>Cancel</button>}</div>
                </form>
              </div>
              <div className="panel table-panel"><div className="panel-heading"><div><h3>Course catalogue</h3><p>{courses.length} available courses</p></div></div>
<Search
  value={search}
  onChange={(value) => {
    setSearch(value);
    setCoursePage(1);
  }}
/>                <div className="table-wrap"><table><thead><tr><th>COURSE</th><th>DEPARTMENT</th><th>CREDITS</th><th>ACTIONS</th></tr></thead><tbody>
                  {visibleCourses.map((course) => <tr key={course.id}><td><div className="table-person"><div className="course-icon small">▤</div><div><strong>{course.title}</strong><span>{course.code} · {course.facultyName}</span></div></div></td><td>{course.department}</td><td>{course.credits}</td><td><div className="actions"><button onClick={() => editCourse(course)}>Edit</button><button className="danger-text" onClick={() => { if (confirm('Delete this course?')) run(() => api.deleteCourse(course.id), 'Course deleted.'); }}>Delete</button></div></td></tr>)}
                </tbody></table>{filteredCourses.length === 0 && <Empty text="No matching courses." />}</div>
                <Pagination
  currentPage={coursePage}
  totalPages={totalCoursePages}
  total={filteredCourses.length}
  onPageChange={setCoursePage}
/>
              </div>
            </div>
          )}

          {active === 'Enrollments' && (
            <div className="panel">
              <div className="panel-heading"><div><h3>Course enrollments</h3><p>Register students for courses and manage grades.</p></div></div>
              <form className="enroll-form" onSubmit={(e) => { e.preventDefault(); run(() => api.createEnrollment({ studentId: Number(enrollForm.studentId), courseId: Number(enrollForm.courseId) }), 'Student enrolled successfully.').then(() => setEnrollForm({ studentId: '', courseId: '' })); }}>
<Field label="Search and select student">

  <SearchableSelect
    options={students}
    value={enrollForm.studentId}
    onChange={(value) =>
      setEnrollForm({
        ...enrollForm,
        studentId: value
      })
    }
    placeholder="Search name, email or student ID..."
    getLabel={(student) =>
      `${student.name} (${student.email})`
    }
    getSearchText={(student) =>
      `${student.id} ${student.name} ${student.email} ${student.department}`
    }
  />

</Field>
<Field label="Search and select course">

  <SearchableSelect
    options={courses}
    value={enrollForm.courseId}
    onChange={(value) =>
      setEnrollForm({
        ...enrollForm,
        courseId: value
      })
    }
    placeholder="Search course code or title..."
    getLabel={(course) =>
      `${course.code} - ${course.title}`
    }
    getSearchText={(course) =>
      `${course.id} ${course.code} ${course.title} ${course.department} ${course.facultyName}`
    }
  />

</Field>
                <button className="primary-button" disabled={busy || !students.length || !courses.length}>Create enrollment</button>
              </form>
              <div className="table-wrap enrollment-table"><table><thead><tr><th>STUDENT</th><th>COURSE</th><th>ENROLLED ON</th><th>GRADE</th><th>ACTIONS</th></tr></thead><tbody>
                {enrollments.map((item) => <tr key={item.id}><td><strong>{item.student.name}</strong><span className="cell-sub">{item.student.email}</span></td><td><strong>{item.course.code}</strong><span className="cell-sub">{item.course.title}</span></td><td>{item.enrolledOn}</td><td><select className="grade-select" value={item.grade || ''} onChange={(e) => e.target.value && run(() => api.updateGrade(item.id, e.target.value), 'Grade updated.')}><option value="">Not graded</option>{['A+','A','B+','B','C+','C','D','F'].map((g) => <option key={g}>{g}</option>)}</select></td><td><button className="danger-text" onClick={() => { if (confirm('Remove this enrollment?')) run(() => api.deleteEnrollment(item.id), 'Enrollment removed.'); }}>Remove</button></td></tr>)}
              </tbody></table>{enrollments.length === 0 && <Empty text="No enrollments yet. Add students and courses, then create an enrollment." />}</div>
            </div>
          )}
        </section>
        <footer>CampusConnect <span>·</span> University Management Platform</footer>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, tone, detail }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-detail">{detail}</div></div>;
}
function Field({ label, children }) { return <label className="field"><span>{label}</span>{children}</label>; }
function Search({ value, onChange }) { return <div className="search-box"><span>⌕</span><input placeholder="Search records..." value={value} onChange={(e) => onChange(e.target.value)} /></div>; }
function Empty({ text }) { return <div className="empty-state">{text}</div>; }
function Pagination({
  currentPage,
  totalPages,
  total,
  onPageChange
}) {

  if (total === 0) return null;

  const start = (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, total);

  return (

    <div className="pagination">

      <span>
        Showing {start}–{end} of {total} records
      </span>

      <div className="pagination-controls">

        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>

      </div>

    </div>

  );
}
export default App;
