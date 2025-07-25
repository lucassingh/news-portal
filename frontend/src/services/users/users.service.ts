import api from "../../config/apiConfig";
import type { User } from "../../interfaces/user";


export const getUsers = async (): Promise<User[]> => {
    const response = await api.get('/users/');
    return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
    const response = await api.post('/users/', userData);
    return response.data;
};

export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
};