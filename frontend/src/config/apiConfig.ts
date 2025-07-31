import axios from 'axios';
import type { TokenResponse } from '../interfaces/user';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para añadir el token JWT
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
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const apiLogin = async (email: string, password: string) => {
    try {
        const response = await api.post<TokenResponse>('/auth/login',
            new URLSearchParams({
                username: email,
                password: password
            }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (!response.data?.access_token) {
            throw new Error('Respuesta de login incompleta - falta access_token');
        }

        // Hacer más flexible el manejo del usuario
        const user = response.data.user || {
            id: 0,
            email: email,
            role: 'user' // valor por defecto
        };

        return {
            access_token: response.data.access_token,
            user: user
        };
    } catch (error) {
        console.error('Login error details:');
        throw new Error('Error al iniciar sesión');
    }
};

export default api;