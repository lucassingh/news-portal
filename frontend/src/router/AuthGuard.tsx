import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthGuard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {

    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default AuthGuard;