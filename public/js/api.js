// Semua request lewat backend sendiri (session cookie), bukan langsung ke
// GitHub, supaya token OAuth tidak pernah ada di sisi browser.

async function request(path, opts = {}) {
  const res = await fetch(path, {
    credentials: "include",
    ...opts,
    headers: {
      ...(opts.body ? { "Content-Type": "application/json" } : {}),
      ...(opts.headers || {}),
    },
  });

  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message = (data && data.message) || `${res.status} ${res.statusText}`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  authStatus: () => request("/auth/status"),
  logout: () => request("/auth/logout", { method: "POST" }),

  me: () => request("/api/me"),
  repos: () => request("/api/repos"),
  createRepo: (payload) => request("/api/repos", { method: "POST", body: JSON.stringify(payload) }),
  getRepo: (owner, repo) => request(`/api/repos/${owner}/${repo}`),

  getContents: (owner, repo, path, ref) =>
    request(`/api/repos/${owner}/${repo}/contents/${path}${ref ? `?ref=${encodeURIComponent(ref)}` : ""}`),

  putContents: (owner, repo, path, payload) =>
    request(`/api/repos/${owner}/${repo}/contents/${path}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteContents: (owner, repo, path, payload) =>
    request(`/api/repos/${owner}/${repo}/contents/${path}`, {
      method: "DELETE",
      body: JSON.stringify(payload),
    }),
};
