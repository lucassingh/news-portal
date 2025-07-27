import { useState, useEffect } from 'react';

import type { News } from '../interfaces/news';
import { createNews, deleteNews, getNews, updateNews } from '../services/news/news.service';

export const useNews = () => {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const data = await getNews();
                setNews(data);
                setError(null);
            } catch (err) {
                setError('Error al cargar las noticias');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const editNews = async (id: number, formData: FormData): Promise<News> => {
        try {
            const updatedNews = await updateNews(id, formData);
            setNews(prevNews => prevNews.map(item =>
                item.id === id ? updatedNews : item
            ));
            return updatedNews;
        } catch (err) {
            console.error('Error updating news:', err);
            throw err;
        }
    };

    const addNews = async (formData: FormData): Promise<News> => {
        try {
            const newNews = await createNews(formData);
            setNews(prevNews => [newNews, ...prevNews]);
            return newNews;
        } catch (err) {
            console.error('Error creating news:', err);
            throw err;
        }
    };

    const removeNews = async (id: number) => {
        try {
            await deleteNews(id);
            setNews(news.filter(item => item.id !== id));
        } catch (err) {
            console.error('Error deleting news:', err);
            throw err;
        }
    };

    return { news, loading, error, addNews, editNews, removeNews };
};