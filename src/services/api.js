import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to include the token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assuming the token is stored under the key 'token'
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;