import axios from 'axios';

// Use production API URL from environment variable, or fallback to local
const baseURL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`;
console.log('API BaseURL initialized as:', baseURL);

const api = axios.create({
    baseURL: baseURL,
});

export default api;
