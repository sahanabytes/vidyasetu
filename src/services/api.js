const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed (${res.status})`);
  }

  return res.json();
}

export const vidyaBackend = {
  getStudents: () => request('/teacher/students'),
  getParentReport: (childId) => request(`/parent/children/${childId}/report`),
  getAssignments: () => request('/teacher/assignments'),
  createAssignment: (payload) =>
    request('/teacher/assignments', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  updateProgress: (studentId, payload) =>
    request(`/students/${studentId}/progress`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    })
};