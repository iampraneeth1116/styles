/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';

export default function CartPage() {
    const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCart();
    const { user, isLoading } = useAuth();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-[var(--muted)] text-sm animate-pulse">Loading cart...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
                <ShoppingBag className="h-16 w-16 text-[var(--border)]" />
                <h1 className="text-2xl font-bold tracking-tighter text-[var(--primary)]">LOG IN TO VIEW CART</h1>
                <p className="text-[var(--muted)] text-sm text-center max-w-md">
                    You need to be logged in to access your cart and complete purchases.
                </p>
                <div className="flex gap-4 mt-4">
                    <Link href="/login">
                        <Button size="lg" variant="primary">Log In</Button>
                    </Link>
                    <Link href="/register">
                        <Button size="lg" variant="outline">Create Account</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
                <ShoppingBag className="h-16 w-16 text-[var(--border)]" />
                <h1 className="text-2xl font-bold tracking-tighter text-[var(--primary)]">YOUR CART IS EMPTY</h1>
                <p className="text-[var(--muted)] text-sm text-center max-w-md">
                    Looks like you haven&apos;t added anything yet. Explore our collection and find something you love.
                </p>
                <Link href="/products">
                    <Button size="lg">Continue Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter text-[var(--primary)] mb-2">YOUR CART</h1>
                    <p className="text-[var(--muted)]">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
                </div>
                <button onClick={clearCart} className="text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors underline underline-offset-4">
                    Clear Cart
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-0 divide-y divide-[var(--border)]">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-6 py-8 first:pt-0">
                            {/* Image placeholder */}
                            <div className="w-28 h-36 bg-[var(--accent)] flex-shrink-0 overflow-hidden flex items-center justify-center text-xs text-[var(--muted)]">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    'Image'
                                )}
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">{item.category}</p>
                                        <Link href={`/products/${item.id}`}>
                                            <h3 className="text-sm font-medium text-[var(--primary)] hover:text-[var(--muted)] transition-colors">
                                                {item.name}
                                            </h3>
                                        </Link>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors self-start"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="flex justify-between items-end">
                                    {/* Quantity */}
                                    <div className="flex items-center border border-[var(--border)]">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="p-2 hover:bg-[var(--accent)] transition-colors"
                                        >
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="px-4 text-xs font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="p-2 hover:bg-[var(--accent)] transition-colors"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                    <p className="text-sm font-semibold text-[var(--primary)]">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-[var(--accent)] p-8 sticky top-24">
                        <h2 className="text-lg font-bold tracking-tighter text-[var(--primary)] mb-6">ORDER SUMMARY</h2>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--muted)]">Subtotal</span>
                                <span className="text-[var(--primary)] font-medium">${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--muted)]">Shipping</span>
                                <span className="text-[var(--primary)] font-medium">{totalPrice >= 100 ? 'Free' : '$9.99'}</span>
                            </div>
                            <div className="border-t border-[var(--border)] pt-4 flex justify-between">
                                <span className="font-semibold text-[var(--primary)]">Total</span>
                                <span className="font-bold text-lg text-[var(--primary)]">
                                    ${(totalPrice >= 100 ? totalPrice : totalPrice + 9.99).toFixed(2)}
                                </span>
                            </div>
                        </div>
                        <Button
                            size="lg"
                            className="w-full mb-3"
                            onClick={() => {
                                if (!user) {
                                    router.push('/login');
                                } else {
                                    router.push('/checkout');
                                }
                            }}
                        >
                            Proceed to Checkout
                        </Button>
                        <Link href="/products" className="block text-center text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors mt-4">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
