const BASE = "/api/spotify";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => null);

  if (!res.ok) throw new Error(data?.message ?? "Request failed");
  return data;
}

export async function searchTracks(q) {
  return request(`/search?q=${encodeURIComponent(q)}`);
}

export async function getTrackAlbumArt(id) {
  return request(`/track/${id}/album-art/`);
}