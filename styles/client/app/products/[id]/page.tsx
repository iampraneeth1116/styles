'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { ChevronLeft, Minus, Plus, Check, Heart } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    stock: number;
    category: { name: string };
}

export default function ProductDetailPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const { user } = useAuth();
    const router = useRouter();
    const { addItem } = useCart();
    const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlist();

    useEffect(() => {
        if (params.id) {
            api.products
                .getById(params.id as string)
                .then((data) => setProduct(data))
                .catch(() => setProduct(null))
                .finally(() => setLoading(false));
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-[var(--muted)] text-sm animate-pulse">Loading product...</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <p className="text-[var(--muted)]">Product not found.</p>
                <Link href="/products">
                    <Button variant="outline">Browse All Products</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Back link */}
            <Link href="/products" className="inline-flex items-center text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors mb-8">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Products
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Product Image */}
                <div className="relative aspect-[3/4] bg-[var(--accent)] overflow-hidden">
                    {product.images?.[0] ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[var(--muted)]">
                            No image available
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="flex flex-col justify-center">
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--muted)] mb-3">
                        {product.category?.name}
                    </p>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-[var(--primary)] mb-4">
                        {product.name}
                    </h1>
                    <p className="text-2xl font-semibold text-[var(--primary)] mb-8">
                        ${product.price.toFixed(2)}
                    </p>
                    <p className="text-[var(--muted)] leading-relaxed mb-10">
                        {product.description}
                    </p>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-sm font-medium text-[var(--primary)]">Quantity</span>
                        <div className="flex items-center border border-[var(--border)]">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-3 hover:bg-[var(--accent)] transition-colors"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-5 text-sm font-medium">{quantity}</span>
                            <button
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                className="p-3 hover:bg-[var(--accent)] transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                        <span className="text-xs text-[var(--muted)]">
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            size="lg"
                            className="flex-1"
                            disabled={product.stock === 0}
                            onClick={() => {
                                if (!user) {
                                    router.push('/login');
                                    return;
                                }
                                addItem({
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    imageUrl: product.images?.[0] || '',
                                    category: product.category?.name || '',
                                }, quantity);
                                setAdded(true);
                                setTimeout(() => setAdded(false), 2000);
                            }}
                        >
                            {added ? (<><Check className="h-4 w-4 mr-2" /> Added to Cart</>) : 'Add to Cart'}
                        </Button>
                        <Button
                            variant={product && isInWishlist(product.id) ? "primary" : "outline"}
                            size="lg"
                            className="flex-1 flex gap-2"
                            onClick={() => {
                                if (!product) return;
                                if (isInWishlist(product.id)) {
                                    removeWishlistItem(product.id);
                                } else {
                                    addWishlistItem({
                                        id: product.id,
                                        name: product.name,
                                        price: product.price,
                                        imageUrl: product.images?.[0] || '',
                                        category: product.category?.name || '',
                                    });
                                }
                            }}
                        >
                            <Heart className={`h-4 w-4 ${product && isInWishlist(product.id) ? "fill-white" : ""}`} />
                            {product && isInWishlist(product.id) ? "Saved to Wishlist" : "Add to Wishlist"}
                        </Button>
                    </div>

                    {/* Extra Info */}
                    <div className="mt-12 pt-8 border-t border-[var(--border)] space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--muted)]">Free shipping</span>
                            <span className="text-[var(--primary)] font-medium">On orders over $100</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--muted)]">Returns</span>
                            <span className="text-[var(--primary)] font-medium">30-day free returns</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
