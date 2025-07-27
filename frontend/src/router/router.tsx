import { Routes, Route } from 'react-router-dom';
import { NotFoundPage } from '../pages/NotFoundPage';
import { LayoutComponent } from '../components/LayoutComponent';
import { AuthProvider, useAuth } from '../context/AuthContext';
import AuthGuard from './AuthGuard';
import { LoginPage } from '../pages/LoginPage';
import { UsersEditPage } from '../pages/auth/users/UsersEditPage';
import UsersListPage from '../pages/auth/users/UsersListPage';
import { UsersViewPage } from '../pages/auth/users/UsersViewPage';
import NewsListPage from '../pages/auth/news/NewsListPage';
import { NewsCreatePage } from '../pages/auth/news/NewsCreatePage';
import { NewsViewPage } from '../pages/auth/news/NewsViewPage';
import { NewsEditPage } from '../pages/auth/news/NewsEditPage';

const AuthenticatedLayout = () => {

    const { loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <LayoutComponent>
            <Routes>
                <Route path="/news" element={<NewsListPage />} />
                <Route path="/news/create" element={<NewsCreatePage />} />
                <Route path="/news/view/:id" element={<NewsViewPage />} />
                <Route path="/news/edit/:id" element={<NewsEditPage />} />
                <Route path="/users" element={<UsersListPage />} />
                <Route path="/users/edit/:id" element={<UsersEditPage />} />
                <Route path="/users/view/:id" element={<UsersViewPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </LayoutComponent>
    );
};

export const AppRouter = () => {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route
                    path="/*"
                    element={
                        <AuthGuard>
                            <AuthenticatedLayout />
                        </AuthGuard>
                    }
                />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </AuthProvider>
    );
};