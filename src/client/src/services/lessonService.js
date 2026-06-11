const BASE = "/api/lessons";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => null);

  if (!res.ok) throw new Error(data?.message ?? "Request failed");
  return data;
}

export async function getLessons() {
  return request("/");
}

export async function getLessonById(id) {
  return request(`/${id}`);
}

export async function createLesson(lesson) {
  return request("/", {
    method: "POST",
    body: JSON.stringify(lesson),
  });
}

export async function updateLesson(id, lesson) {
  return request(`/${id}`, {
    method: "PUT",
    body: JSON.stringify(lesson),
  });
}

export async function deleteLesson(id) {
  return request(`/${id}`, { method: "DELETE" });
}
