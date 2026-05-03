'use client';

import Link from 'next/link';
import { ShoppingBag, Search, User, LogOut, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar() {
    const { totalItems } = useCart();
    const { user, logout } = useAuth();
    const { totalItems: wishlistTotal } = useWishlist();

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[var(--border)] shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold tracking-tighter text-[var(--primary)]">
                            STYLES
                        </Link>
                    </div>

                    {/* Center Navigation */}
                    <div className="hidden md:flex space-x-10">
                        <Link href="/products" className="group text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors relative py-2">
                            <span>New Arrivals</span>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--primary)] transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/products?category=men" className="group text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors relative py-2">
                            <span>Men</span>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--primary)] transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/products?category=women" className="group text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors relative py-2">
                            <span>Women</span>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--primary)] transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/products?category=accessories" className="group text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors relative py-2">
                            <span>Accessories</span>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--primary)] transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-6">
                        <Link href="/search" className="text-[var(--primary)] hover:text-[var(--muted)] transition-colors" title="Search">
                            <Search className="h-5 w-5" />
                            <span className="sr-only">Search</span>
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-5">
                                <Link href="/orders" className="text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors">
                                    Orders
                                </Link>
                                <Link href="/profile" className="text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors">
                                    Hi, {user.name}
                                </Link>
                                <button
                                    onClick={logout}
                                    className="text-[var(--primary)] hover:text-[var(--muted)] transition-colors flex items-center"
                                    title="Logout"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span className="sr-only">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="text-[var(--primary)] hover:text-[var(--muted)] transition-colors flex items-center" title="Login">
                                <User className="h-5 w-5" />
                                <span className="sr-only">Login</span>
                            </Link>
                        )}

                        <Link href="/wishlist" className="text-[var(--primary)] hover:text-[var(--muted)] transition-colors relative" title="Wishlist">
                            <Heart className="h-5 w-5" />
                            <span className="sr-only">Wishlist</span>
                            {wishlistTotal > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--primary)] text-[0.6rem] font-medium text-white ring-2 ring-white">
                                    {wishlistTotal}
                                </span>
                            )}
                        </Link>

                        <Link href="/cart" className="text-[var(--primary)] hover:text-[var(--muted)] transition-colors relative">
                            <ShoppingBag className="h-5 w-5" />
                            <span className="sr-only">Cart</span>
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--primary)] text-[0.6rem] font-medium text-white ring-2 ring-white">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
