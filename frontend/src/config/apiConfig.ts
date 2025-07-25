import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import type { TokenResponse } from '../interfaces/user';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
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
        if (error.response?.status === 401) {
            const { logout } = useAuth();
            logout();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export const apiLogin = (data: FormData) => {
    return api.post<TokenResponse>('/auth/login', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export default api;