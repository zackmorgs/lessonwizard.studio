const BASE = "/api/songs";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => null);

  if (!res.ok) throw new Error(data?.message ?? "Request failed");
  return data;
}

export async function getSongs() {
  return request("/");
}

export async function getSongById(id) {
  return request(`/${id}`);
}

export async function createSong(song) {
  return request("/", {
    method: "POST",
    body: JSON.stringify(song),
  });
}

export async function updateSong(id, song) {
  return request(`/${id}`, {
    method: "PUT",
    body: JSON.stringify(song),
  });
}

export async function deleteSong(id) {
  return request(`/${id}`, { method: "DELETE" });
}

export async function getSongsByTag(tag) {
  return request(`/tag/${tag}/songs/`);
}


export async function getSongsByStudent(studentId) {
  return request(`/student/${studentId}`);
}