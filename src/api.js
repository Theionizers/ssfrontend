import axios from 'axios';

// base URL can be overridden via environment variable (Vite prefix VITE_)
const baseURL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
    baseURL,
});

export default api;
