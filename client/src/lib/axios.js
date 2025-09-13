import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,  // This ensures cookies are sent with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add any auth headers if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            console.error('Unauthorized access');
        }
        return Promise.reject(error);
    }
);

export default apiClient;
