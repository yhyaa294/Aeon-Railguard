'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Define types based on Backend Go Structs
type Station = {
    id: string;
    name: string;
    head_officer: string;
};

type Post = {
    id: string;
    name: string;
    geo_location: string;
};

type Region = {
    id: string;
    name: string;
    code: string;
};

type User = {
    token: string;
    role: string;
    name: string;
    station?: Station;
    post?: Post;
    region?: Region;
};

type AuthContextType = {
    user: User | null;
    login: (id: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('aeon_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user session", e);
                localStorage.removeItem('aeon_user');
            }
        }
        setIsLoading(false);
    }, []);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    const login = async (id: string, password: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, password }),
            });

            if (!res.ok) {
                console.error("Login failed", await res.text());
                return false;
            }

            const data: User = await res.json();
            setUser(data);
            localStorage.setItem('aeon_user', JSON.stringify(data));
            return true;
        } catch (err) {
            console.error("Login error", err);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('aeon_user');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
