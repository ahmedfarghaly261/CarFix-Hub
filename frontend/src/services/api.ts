import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const API: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor to handle errors
API.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // let components handle 401
    // This prevents reload loops
    return Promise.reject(error);
  }
);

export default API;
