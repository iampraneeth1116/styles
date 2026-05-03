/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { useWishlist } from '../../context/WishlistContext';
import { Button } from '../../components/ui/Button';
import { HeartOff, X } from 'lucide-react';

export default function WishlistPage() {
    const { items, removeItem, totalItems } = useWishlist();

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
                <HeartOff className="h-16 w-16 text-[var(--border)]" />
                <h1 className="text-2xl font-bold tracking-tighter text-[var(--primary)]">YOUR WISHLIST IS EMPTY</h1>
                <p className="text-[var(--muted)] text-sm text-center max-w-md">
                    Keep track of your favorite items by adding them to your wishlist.
                </p>
                <Link href="/products">
                    <Button size="lg">Discover Products</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-12">
                <h1 className="text-4xl font-bold tracking-tighter text-[var(--primary)] mb-2">WISHLIST</h1>
                <p className="text-[var(--muted)]">{totalItems} {totalItems === 1 ? 'item' : 'items'} saved</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {items.map((item) => (
                    <div key={item.id} className="group flex flex-col relative">
                        <button
                            onClick={() => removeItem(item.id)}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-[var(--primary)] hover:text-red-500 transition-colors shadow-sm"
                            title="Remove from wishlist"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <Link href={`/products/${item.id}`} className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--accent)] mb-4">
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-[var(--muted)] text-sm">Image</div>
                            )}
                        </Link>

                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs text-[var(--muted)] mb-1 uppercase tracking-wider">{item.category}</p>
                                <Link href={`/products/${item.id}`}>
                                    <h3 className="text-sm font-medium text-[var(--primary)] group-hover:text-[var(--muted)] transition-colors">
                                        {item.name}
                                    </h3>
                                </Link>
                            </div>
                            <p className="text-sm font-medium text-[var(--primary)]">${item.price.toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
