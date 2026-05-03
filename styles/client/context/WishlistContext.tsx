'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

interface WishlistItem {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
}

interface WishlistContextType {
    items: WishlistItem[];
    addItem: (item: WishlistItem) => void;
    removeItem: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const { user } = useAuth();

    // Load from backend or local storage
    useEffect(() => {
        if (user) {
            api.wishlist.get()
                .then(data => setItems(data))
                .catch(err => console.error('Failed to load wishlist:', err));
        } else {
            const stored = localStorage.getItem('styles-wishlist');
            if (stored) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                try { setItems(JSON.parse(stored)); } catch { /* ignore */ }
            } else {
                setItems([]);
            }
        }
    }, [user]);

    // Save to local storage for guests
    useEffect(() => {
        if (!user) {
            localStorage.setItem('styles-wishlist', JSON.stringify(items));
        }
    }, [items, user]);

    const addItem = async (item: WishlistItem) => {
        if (!items.find((i) => i.id === item.id)) {
            setItems((prev) => [...prev, item]);

            if (user) {
                try {
                    await api.wishlist.add(item.id);
                } catch (error) {
                    console.error('Failed to save wishlist item to DB:', error);
                }
            }
        }
    };

    const removeItem = async (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));

        if (user) {
            try {
                await api.wishlist.remove(id);
            } catch (error) {
                console.error('Failed to remove wishlist item from DB:', error);
            }
        }
    };

    const isInWishlist = (id: string) => {
        return items.some((i) => i.id === id);
    };

    const totalItems = items.length;

    return (
        <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, totalItems }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
    return context;
}
