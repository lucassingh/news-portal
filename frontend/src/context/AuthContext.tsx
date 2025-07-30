import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../interfaces/user';
import { supabase } from '../config/apiConfig';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import theme from '../config/Theme.config';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate()

    const fetchUserProfile = async (email: string) => {
        try {
            const { data: userData, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error) throw error;
            if (userData) {
                setUser(userData);
                // Guarda el rol en localStorage
                localStorage.setItem('userRole', userData.role);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            await supabase.auth.signOut();
            setUser(null);
            localStorage.removeItem('userRole');
        }
    };

    useEffect(() => {
        const checkSession = async () => {
            try {
                setLoading(true);
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user?.email) {
                    await fetchUserProfile(session.user.email);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Session check error:', error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_, session) => {
                if (session?.user?.email) {
                    await fetchUserProfile(session.user.email);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            // Elimina la declaración de data ya que no la usas
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                console.error('Detalles del error:', {
                    message: error.message,
                    status: error.status,
                    name: error.name
                });

                if (error.message.includes('Email not confirmed')) {
                    const { error: resendError } = await supabase.auth.resend({
                        type: 'signup',
                        email,
                        options: { emailRedirectTo: `${window.location.origin}/login` }
                    });

                    if (resendError) throw resendError;
                    throw new Error('Por favor verifica tu email. Te hemos enviado otro enlace de confirmación.');
                }
                throw error;
            }

            // Verificación de sesión
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error('No se pudo obtener la sesión después del login');
            }

            await fetchUserProfile(email);

            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Has iniciado sesión correctamente',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                navigate('/news');
            });
        } catch (error) {
            // Manejo de errores permanece igual
            console.error('Error completo:', error);
            let errorMessage = 'Credenciales inválidas. Por favor, inténtalo de nuevo.';

            if (error instanceof Error) {
                if (error.message.includes('email not confirmed')) {
                    errorMessage = 'Por favor verifica tu email antes de iniciar sesión.';
                } else if (error.message.includes('Invalid login credentials')) {
                    errorMessage = 'Email o contraseña incorrectos.';
                } else {
                    errorMessage = error.message;
                }
            }

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
                confirmButtonColor: theme.palette.primary.main
            });
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await supabase.auth.signOut();
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        isAuthenticated,
        user,
        login,
        logout,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};