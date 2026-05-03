'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password?: string) => Promise<void>;
    register: (email: string, name: string, password?: string) => Promise<void>;
    updateProfile: (name: string, email: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { api } from '../lib/api';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Run verify session on mount
        const verifySession = async () => {
            const token = localStorage.getItem('styles-token');
            if (token) {
                try {
                    const data = await api.auth.getMe();
                    setUser(data.user);
                } catch (error) {
                    console.error('Session verification failed', error);
                    localStorage.removeItem('styles-token');
                    setUser(null);
                }
            }
            setIsLoading(false);
        };
        verifySession();
    }, []);

    const login = async (email: string, password?: string) => {
        try {
            const data = await api.auth.login({ email, password: password || 'demo123' });
            localStorage.setItem('styles-token', data.token);
            setUser(data.user);
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            throw new Error(error.message || 'Login failed');
        }
    };

    const register = async (email: string, name: string, password?: string) => {
        try {
            const data = await api.auth.register({ email, name, password: password || 'demo123' });
            localStorage.setItem('styles-token', data.token);
            setUser(data.user);
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            throw new Error(error.message || 'Registration failed');
        }
    };

    const updateProfile = async (name: string, email: string) => {
        if (!user) return;
        try {
            const data = await api.auth.updateProfile({ name, email });
            setUser(data.user);
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            throw new Error(error.message || 'Profile update failed');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('styles-token');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, updateProfile, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
