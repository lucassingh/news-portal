import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_KEY
);

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;

        // Añade el email del usuario como header si está disponible
        if (session.user?.email) {
            config.headers['X-User-Email'] = session.user.email;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            supabase.auth.signOut();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const apiLogin = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('Error de Supabase:', {
                message: error.message,
                status: error.status,
                name: error.name
            });
            throw error;
        }

        // Verificar que realmente tenemos una sesión
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            throw new Error('No session after login');
        }

        return data;
    } catch (error) {
        console.error('Error completo en apiLogin:', error);
        throw error;
    }
};

export { supabase };
export default api;