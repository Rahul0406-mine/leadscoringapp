const API_BASE = import.meta.env.VITE_API_BASE;

async function apiFetch(path: string, opts = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(body?.message ?? res.statusText);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

export default apiFetch;
