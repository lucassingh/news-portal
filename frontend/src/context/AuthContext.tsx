import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../interfaces/user';
import api from '../config/apiConfig';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifySession = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                try {
                    await api.get('/auth/verify');

                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                    setIsAuthenticated(true);
                } catch (error) {
                    logout();
                }
            }
            setLoading(false);
        };

        verifySession();
    }, []);

    const login = (token: string, user: User) => {
        setIsAuthenticated(true);
        setToken(token);
        setUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const logout = () => {
        setIsAuthenticated(false);
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};