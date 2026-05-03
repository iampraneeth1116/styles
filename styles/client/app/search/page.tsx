'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search as SearchIcon } from 'lucide-react';
import { api } from '../../lib/api';

interface Product {
    id: string;
    name: string;
    price: number;
    images: string[];
    category: { name: string };
}

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Debounced search
    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setProducts([]);
                return;
            }

            setLoading(true);
            setError('');
            try {
                // Fetching all products and filtering locally since simple backend doesn't have a search endpoint yet
                const allProducts: Product[] = await api.products.getAll() || [];
                const lowerQuery = query.toLowerCase();

                const filtered = allProducts.filter(p =>
                    p.name.toLowerCase().includes(lowerQuery) ||
                    p.category?.name.toLowerCase().includes(lowerQuery)
                );
                setProducts(filtered);
            } catch (err) {
                setError('Failed to fetch search results.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchResults, 400);
        return () => clearTimeout(debounceTimer);
    }, [query]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[70vh]">
            <div className="max-w-2xl mx-auto mb-16">
                <h1 className="text-3xl font-bold tracking-tighter text-[var(--primary)] text-center mb-8">SEARCH</h1>
                <div className="relative">
                    <input
                        type="text"
                        className="w-full text-lg py-4 pl-12 pr-4 border-b-2 border-[var(--border)] focus:border-[var(--primary)] outline-none transition-colors bg-transparent placeholder-[var(--muted)]"
                        placeholder="Search for products, categories..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--muted)] w-6 h-6" />
                </div>
            </div>

            {loading && (
                <div className="flex justify-center my-12">
                    <div className="w-8 h-8 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin"></div>
                </div>
            )}

            {error && (
                <div className="text-center text-red-500 my-12">
                    {error}
                </div>
            )}

            {!loading && query && products.length === 0 && !error && (
                <div className="text-center text-[var(--muted)] my-12">
                    No results found for &quot;{query}&quot;. Try checking your spelling or using different keywords.
                </div>
            )}

            {!loading && products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div key={product.id} className="group cursor-pointer">
                            <Link href={`/products/${product.id}`}>
                                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--accent)] mb-4 shadow-sm">
                                    {product.images && product.images[0] ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-[var(--muted)] text-sm">Image</div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-[var(--muted)] mb-1 uppercase tracking-wider">{product.category?.name}</span>
                                    <h3 className="text-sm font-medium text-[var(--primary)] group-hover:text-[var(--muted)] transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm mt-1 font-medium text-[var(--primary)]">
                                        ${product.price ? product.price.toFixed(2) : '0.00'}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
