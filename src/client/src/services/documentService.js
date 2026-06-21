const BASE = "/api/documents";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Only set Content-Type for JSON — let the browser set it for FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => null);

  if (!res.ok) throw new Error(data?.message ?? "Request failed");
  return data;
}

export async function getDocuments() {
  return request("/");
}

export async function getDocumentById(id) {
  return request(`/${id}`);
}

/**
 * Create a document from one or more image files.
 * @param {{ title?: string, description?: string, tagIds?: string[], images: File[] }} payload
 */
export async function createDocumentFromImages({ title, description, tagIds = [], images }) {
  const form = new FormData();
  if (title) form.append("title", title);
  if (description) form.append("description", description);
  tagIds.forEach((id) => form.append("tagIds", id));
  images.forEach((file) => form.append("images", file));

  return request("/from-images", { method: "POST", body: form });
}

export async function deleteDocument(id) {
  return request(`/${id}`, { method: "DELETE" });
}
