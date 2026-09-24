import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const responseData = error.response?.data;

    if (responseData?.error && !responseData.erro) {
      responseData.erro = responseData.error;
    }

    return Promise.reject(error);
  }
);

export default api;