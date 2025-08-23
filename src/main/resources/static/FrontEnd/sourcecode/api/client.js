const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const apiGet = (path) => fetch(`${API}${path}`).then(r => r.json());
export const sseUrl = `${API}/api/events/stream`;