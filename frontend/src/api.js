
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

async function request(path, options = {}) {

  const isFormData = options.body instanceof FormData;

  const headers = isFormData
    ? { ...options.headers }
    : {
        'Content-Type': 'application/json',
        ...options.headers
      };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
}

export const api = {

  dashboard: () => request('/dashboard'),

  students: () => request('/students'),

  createStudent: (body) =>
    request('/students', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  updateStudent: (id, body) =>
    request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    }),

  deleteStudent: (id) =>
    request(`/students/${id}`, {
      method: 'DELETE'
    }),

  importStudents: (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return request('/students/import', {
      method: 'POST',
      body: formData
    });
  },

  courses: () => request('/courses'),

  createCourse: (body) =>
    request('/courses', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  updateCourse: (id, body) =>
    request(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    }),

  deleteCourse: (id) =>
    request(`/courses/${id}`, {
      method: 'DELETE'
    }),

  enrollments: () => request('/enrollments'),

  createEnrollment: (body) =>
    request('/enrollments', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  updateGrade: (id, grade) =>
    request(`/enrollments/${id}/grade`, {
      method: 'PATCH',
      body: JSON.stringify({ grade })
    }),

  deleteEnrollment: (id) =>
    request(`/enrollments/${id}`, {
      method: 'DELETE'
    })
};
