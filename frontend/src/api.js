import axios from 'axios';

const baseURL = `http://${window.location.hostname}:8000`;
console.log('API BaseURL initialized as:', baseURL);

const api = axios.create({
    baseURL: baseURL,
});

export default api;
