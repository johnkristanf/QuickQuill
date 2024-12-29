import axios from 'axios';

const apiInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiInstance.get('/sanctum/csrf-cookie');

export default apiInstance;
