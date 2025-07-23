import { Routes, Route } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { NewsCreateEditPage } from '../pages/auth/NewsCreateEditPage';
import { NewsDeletePage } from '../pages/auth/NewsDeletePage';
import { NewsListPage } from '../pages/auth/NewsListPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { AuthGuard } from './AuthGuard';
import { RegisterPage } from '../pages/RegsiterPage';
import { LayoutComponent } from '../components/LayoutComponent';
import { AuthProvider } from '../context/AuthContext';

const AuthenticatedLayout = () => (
    <LayoutComponent>
        <Routes>
            <Route path="/news" element={<NewsListPage />} />
            <Route path="/news/create" element={<NewsCreateEditPage />} />
            <Route path="/news/edit/:id" element={<NewsCreateEditPage />} />
            <Route path="/news/delete/:id" element={<NewsDeletePage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </LayoutComponent>
);

export const AppRouter = () => {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
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