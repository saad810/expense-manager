// axios.js
import Axios from 'axios';

export const axios = Axios.create({
  baseURL: "http://localhost:8000",
});

// Request interceptor to add token to headers
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Retrieve token from local storage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors (like 401 Unauthorized)
axios.interceptors.response.use(
  (response) => response.data, // Return response data directly
  async (error) => {
    // If the error is a 401 (unauthorized) response, redirect to login
    if (error.response && error.response.status === 401) {
      console.log('Token expired or invalid, redirecting to login...');
      // Handle token expiration (e.g., redirect to login or refresh token)
      window.location.href = "/login"; // Example of redirect to login
    }
    return Promise.reject(error);
  }
);
