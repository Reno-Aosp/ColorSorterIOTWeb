const API = import.meta.env.VITE_API_URL || 'http://localhost:1000';
console.log('API URL:', API); // Add this line to debug
export const apiGet = (path) => fetch(`${API}${path}`).then(r => r.json());
export const sseUrl = `${API}/api/events/stream`;