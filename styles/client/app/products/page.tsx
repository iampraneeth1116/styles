'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '../../components/ProductCard';
import { api } from '../../lib/api';

interface Product {
    id: string;
    name: string;
    price: number;
    images: string[];
    category: { name: string };
    createdAt?: string;
}

function ProductsContent() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams?.get('category') || '';
    const typeParam = searchParams?.get('type') || '';

    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [genderFilter, setGenderFilter] = useState<string>('all');
    const [priceFilter, setPriceFilter] = useState<string>('all');

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            const minPrice = priceFilter === '50100' ? 50 : priceFilter === 'over100' ? 100 : undefined;
            const maxPrice = priceFilter === 'under50' ? 50 : priceFilter === '50100' ? 100 : undefined;
            
            try {
                const data = await api.products.getAll({
                    category: categoryParam || (genderFilter !== 'all' ? genderFilter : undefined),
                    minPrice,
                    maxPrice,
                    limit: (!categoryParam && typeParam !== 'all') ? 10 : undefined
                });
                setAllProducts(data);
                setError(null);
            } catch (err) {
                setError((err as Error).message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [categoryParam, typeParam, genderFilter, priceFilter]);

    // Backend already provides correctly filtered and sorted items
    const displayedProducts = allProducts;

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-[var(--muted)] text-sm animate-pulse">Loading products...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <p className="text-red-500 text-sm">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[70vh]">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter text-[var(--primary)] mb-2 uppercase">
                        {categoryParam ? `${categoryParam} PRODUCTS` : (typeParam === 'all' ? 'All Products' : 'New Arrivals')}
                    </h1>
                    <p className="text-[var(--muted)]">
                        {categoryParam
                            ? `Explore our collection of premium ${categoryParam.toLowerCase()}.`
                            : (typeParam === 'all' ? 'Browse our complete catalog of premium essentials.' : 'Browse the latest additions to our premium collection.')}
                    </p>
                </div>

                {!categoryParam && (
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="gender-filter" className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Category</label>
                            <select
                                id="gender-filter"
                                value={genderFilter}
                                onChange={(e) => setGenderFilter(e.target.value)}
                                className="px-4 py-2 border border-[var(--border)] rounded-md bg-[var(--accent)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--primary)]"
                            >
                                <option value="all">All</option>
                                <option value="men">Men</option>
                                <option value="women">Women</option>
                                <option value="accessories">Accessories</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="price-filter" className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Price Range</label>
                            <select
                                id="price-filter"
                                value={priceFilter}
                                onChange={(e) => setPriceFilter(e.target.value)}
                                className="px-4 py-2 border border-[var(--border)] rounded-md bg-[var(--accent)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--primary)]"
                            >
                                <option value="all">All Prices</option>
                                <option value="under50">Under $50</option>
                                <option value="50100">$50 - $100</option>
                                <option value="over100">Over $100</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {displayedProducts.length === 0 ? (
                <div className="bg-gray-50 py-16 rounded-xl border border-[var(--border)] flex flex-col items-center justify-center">
                    <p className="text-[var(--muted)] text-center text-lg">No products found matching your filters.</p>
                    <button
                        onClick={() => { setGenderFilter('all'); setPriceFilter('all'); }}
                        className="mt-4 text-[var(--primary)] underline font-medium hover:text-[var(--muted)] transition-colors"
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {displayedProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            category={product.category?.name || ''}
                            imageUrl={product.images?.[0] || ''}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin"></div>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
