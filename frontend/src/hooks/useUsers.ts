// src/hooks/useUsers.ts
import { useState, useEffect, useCallback } from 'react';
import type { User } from '../interfaces/user';
import { createUser, deleteUser, getUsers, updateUser } from '../services/users/users.service';

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }, []);

    const addUser = useCallback(async (userData: Omit<User, 'id'>) => {
        setLoading(true);
        try {
            const newUser = await createUser(userData);
            setUsers(prev => [...prev, newUser]);
            return newUser;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create user');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const editUser = useCallback(async (id: number, userData: Partial<User>) => {
        setLoading(true);
        try {
            const updatedUser = await updateUser(id, userData);
            setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
            return updatedUser;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update user');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const removeUser = useCallback(async (id: number) => {
        setLoading(true);
        try {
            await deleteUser(id);
            setUsers(prev => prev.filter(user => user.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete user');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        users,
        loading,
        error,
        fetchUsers,
        addUser,
        editUser,
        removeUser,
    };
};