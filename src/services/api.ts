import axios from 'axios';

const api = axios.create({
  baseURL: 'https://skyvisa-api.onrender.com/api/v1',
});

// Kurye (Axios) her istekten önce buraya uğrar
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;