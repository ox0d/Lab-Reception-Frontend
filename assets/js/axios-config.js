import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Adjust the URL path to match your API endpoints
  timeout: 10000, // Set a timeout for requests
  headers: {
    'Content-Type': 'application/json',
    // Add any other headers you need
  },
});

export default axiosInstance;

// import axiosInstance from './assets/js/axios-config';