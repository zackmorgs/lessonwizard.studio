const BASE = "/api/auth";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => null);

  if (!res.ok) throw new Error(data?.message ?? "Request failed");
  return data;
}

export async function getMe() {
  return request("/me");
}

export function loginWithGoogle(returnUrl = "/") {
  window.location.href = `${BASE}/google?returnUrl=${encodeURIComponent(returnUrl)}`;
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}
