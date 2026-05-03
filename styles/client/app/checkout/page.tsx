'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';

export default function CheckoutPage() {
    const { user, isLoading: authLoading } = useAuth();
    const { items, totalPrice, clearCart } = useCart();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    useEffect(() => {
        // Enforce login and ensure cart has items
        if (!authLoading) {
            if (!user) {
                router.push('/login');
            } else if (items.length === 0 && !loading) {
                router.push('/cart');
            }
        }
    }, [authLoading, user, items.length, router, loading]);

    if (authLoading || !user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-[var(--muted)] text-sm animate-pulse">Checking authentication...</div>
            </div>
        );
    }

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !address) {
            setError('Please fill out all required fields.');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                customerName: name,
                customerEmail: email,
                items: items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                }))
            };

            await api.orders.create(orderData);
            clearCart();
            router.push('/orders?success=true');
        } catch (err) {
            setError('Failed to process your order. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) return null; // Let the useEffect redirect kick in

    const shipping = totalPrice >= 100 ? 0 : 9.99;
    const finalTotal = totalPrice + shipping;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold tracking-tighter text-[var(--primary)] mb-12">CHECKOUT</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Checkout Form */}
                <div>
                    <h2 className="text-xl font-semibold mb-6">Shipping & Contact Details</h2>
                    <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-500 p-3 text-sm border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-[var(--primary)] mb-1">Full Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 border border-[var(--border)] bg-[var(--accent)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[var(--primary)] mb-1">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 border border-[var(--border)] bg-[var(--accent)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-[var(--primary)] mb-1">Shipping Address</label>
                                <textarea
                                    id="address"
                                    required
                                    rows={3}
                                    className="w-full px-4 py-3 border border-[var(--border)] bg-[var(--accent)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-[var(--border)]">
                            <p className="text-sm text-[var(--muted)] mb-4">
                                Note: This is a demo application. No real payment will be processed.
                            </p>
                            <Button type="submit" size="lg" className="w-full" disabled={loading}>
                                {loading ? 'Processing Order...' : `Pay $${finalTotal.toFixed(2)}`}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Order Summary */}
                <div>
                    <div className="bg-[var(--accent)] p-8 sticky top-24 border border-[var(--border)]">
                        <h2 className="text-lg font-bold tracking-tighter text-[var(--primary)] mb-6">ORDER SUMMARY</h2>

                        <div className="space-y-4 mb-6 border-b border-[var(--border)] pb-6 max-h-64 overflow-y-auto pr-2">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <div className="flex gap-4">
                                        <span className="text-[var(--muted)]">{item.quantity}x</span>
                                        <span className="font-medium text-[var(--primary)] line-clamp-1">{item.name}</span>
                                    </div>
                                    <span className="text-[var(--primary)]">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--muted)]">Subtotal</span>
                                <span className="text-[var(--primary)] font-medium">${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--muted)]">Shipping</span>
                                <span className="text-[var(--primary)] font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                            </div>
                            <div className="border-t border-[var(--border)] pt-4 flex justify-between">
                                <span className="font-semibold text-[var(--primary)]">Total</span>
                                <span className="font-bold text-xl text-[var(--primary)]">
                                    ${finalTotal.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
