import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "https://ssbackend-7xfx.onrender.com",
});

export default api;