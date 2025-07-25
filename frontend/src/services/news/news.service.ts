import api from "../../config/apiConfig";
import type { News } from "../../interfaces/news";


export const getNews = async (skip: number = 0, limit: number = 10): Promise<News[]> => {
    try {
        const response = await api.get<News[]>(`/api/news/?skip=${skip}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
};

export const getNewsById = async (id: number): Promise<News> => {
    try {
        const response = await api.get<News>(`/api/news/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching news with id ${id}:`, error);
        throw error;
    }
};

export const createNews = async (formData: FormData): Promise<News> => {
    try {
        const response = await api.post<News>('/api/news/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating news:', error);
        throw error;
    }
};

export const updateNews = async (id: number, formData: FormData): Promise<News> => {
    try {
        const response = await api.put<News>(`/api/news/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating news with id ${id}:`, error);
        throw error;
    }
};

export const deleteNews = async (id: number): Promise<void> => {
    try {
        await api.delete(`/api/news/${id}`);
    } catch (error) {
        console.error(`Error deleting news with id ${id}:`, error);
        throw error;
    }
};