const BASE = "/api/students";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => null);

  if (!res.ok) throw new Error(data?.message ?? "Request failed");
  return data;
}

export async function getStudents() {
  return request("/");
}

export async function getStudentById(id) {
  return request(`/${id}`);
}

export async function getStudentLessons(id) {
  return request(`/${id}/lessons`);
}

export async function createStudent(student) {
  return request("/", {
    method: "POST",
    body: JSON.stringify(student),
  });
}

export async function updateStudent(id, student) {
  return request(`/${id}`, {
    method: "PUT",
    body: JSON.stringify(student),
  });
}

export async function deleteStudent(id) {
  return request(`/${id}`, { method: "DELETE" });
}

export async function getStudentDocuments(id) {
  return request(`/${id}/documents`);
}

export async function addDocumentToStudent(studentId, docId) {
  return request(`/${studentId}/documents/${docId}`, { method: "POST" });
}

export async function removeDocumentFromStudent(studentId, docId) {
  return request(`/${studentId}/documents/${docId}`, { method: "DELETE" });
}
