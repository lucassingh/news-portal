import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../interfaces/user';
import api, { apiLogin } from '../config/apiConfig';
import { useNavigate } from 'react-router-dom';

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

    const navigate = useNavigate();

    const verifyToken = async (): Promise<boolean> => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAuthenticated(false);
            setUser(null);
            return false;
        }

        try {
            const response = await api.get<{ user: User }>('/auth/verify');
            setUser(response.data.user);
            setIsAuthenticated(true);
            return true;
        } catch (error) {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
            return false;
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            try {
                await verifyToken();
            } catch (error) {
                console.error('Auth check error:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();

        const interval = setInterval(verifyToken, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        try {
            setLoading(true);
            const { access_token, user } = await apiLogin(email, password);

            localStorage.setItem('token', access_token);
            localStorage.setItem('userRole', user.role);
            setUser(user);
            setIsAuthenticated(true);

            // Redirigir después de actualizar el estado
            navigate('/news');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        try {
            setLoading(true);
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            setUser(null);
            setIsAuthenticated(false);
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const value: AuthContextType = {
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