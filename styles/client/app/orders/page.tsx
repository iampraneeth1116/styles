'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';
import { CheckCircle2, Package, Clock, Truck } from 'lucide-react';

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: {
        id: string;
        name: string;
        images: string[];
    };
}

interface Order {
    id: string;
    total: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
    customerEmail: string;
}

function OrdersContent() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isSuccess = searchParams?.get('success') === 'true';

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;

            try {
                setLoading(true);
                const allOrders: Order[] = await api.orders.getAll();
                const userOrders = allOrders.filter(o => o.customerEmail === user.email);
                setOrders(userOrders);
            } catch (err) {
                setError('Failed to load your order history.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    if (authLoading || loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) return null;

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return <Clock className="h-5 w-5 text-amber-500" />;
            case 'processing': return <Package className="h-5 w-5 text-blue-500" />;
            case 'shipped': return <Truck className="h-5 w-5 text-indigo-500" />;
            case 'delivered': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            default: return <Package className="h-5 w-5 text-[var(--muted)]" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[70vh]">
            {isSuccess && (
                <div className="mb-12 bg-green-50 border border-green-200 p-8 text-center flex flex-col items-center justify-center shadow-sm">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold text-green-800 mb-2">Order Placed Successfully!</h2>
                    <p className="text-green-700">Thank you for your purchase. We&apos;ve received your order and are processing it now.</p>
                </div>
            )}

            <div className="mb-12 flex justify-between items-end border-b border-[var(--border)] pb-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter text-[var(--primary)] mb-2">ORDER HISTORY</h1>
                    <p className="text-[var(--muted)]">View and track your previous purchases.</p>
                </div>
            </div>

            {error ? (
                <div className="text-center text-red-500 my-12 bg-red-50 p-6 border border-red-100">{error}</div>
            ) : orders.length === 0 ? (
                <div className="text-center py-24 bg-[var(--accent)] border border-[var(--border)]">
                    <Package className="h-12 w-12 text-[var(--muted)] mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-[var(--primary)] mb-2">No orders found</h3>
                    <p className="text-[var(--muted)] mb-8 max-w-sm mx-auto">Looks like you haven&apos;t placed any orders yet. Start exploring our collections.</p>
                    <Link href="/products">
                        <Button>Start Shopping</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white border border-[var(--border)] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
                            {/* Order Header */}
                            <div className="bg-[var(--accent)] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)]">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                                    <div>
                                        <p className="text-[var(--muted)] text-xs uppercase tracking-wider mb-1">Order Placed</p>
                                        <p className="font-medium text-[var(--primary)]">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[var(--muted)] text-xs uppercase tracking-wider mb-1">Total</p>
                                        <p className="font-medium text-[var(--primary)]">${order.total.toFixed(2)}</p>
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <p className="text-[var(--muted)] text-xs uppercase tracking-wider mb-1">Order #</p>
                                        <p className="font-mono text-[var(--primary)] truncate" title={order.id}>{order.id.split('-')[0]}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-[var(--border)] shadow-sm rounded-full self-start sm:self-auto">
                                    {getStatusIcon(order.status)}
                                    <span className="text-sm font-medium capitalize">{order.status}</span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6 divide-y divide-[var(--border)]">
                                {order.items.map((item) => (
                                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-6">
                                        <div className="w-20 h-28 bg-[var(--accent)] flex-shrink-0 relative border border-[var(--border)]">
                                            {item.product.images?.[0] ? (
                                                <Image
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-xs text-[var(--muted)]">Image</div>
                                            )}
                                        </div>

                                        <div className="flex-1 flex flex-col justify-center">
                                            <Link href={`/products/${item.product.id}`} className="inline-block group">
                                                <h4 className="font-medium text-[var(--primary)] group-hover:text-[var(--muted)] transition-colors mb-1 line-clamp-1">
                                                    {item.product.name}
                                                </h4>
                                            </Link>
                                            <div className="text-sm text-[var(--muted)] mb-2">
                                                Qty: {item.quantity} • ${item.price.toFixed(2)}
                                            </div>
                                            <div className="text-sm font-medium text-[var(--primary)]">
                                                ${(item.quantity * item.price).toFixed(2)}
                                            </div>
                                        </div>

                                        <div className="hidden sm:flex flex-col justify-center border-l border-[var(--border)] pl-6 ml-6">
                                            <Link href={`/products/${item.product.id}`}>
                                                <Button variant="outline" size="sm" className="w-full mb-2">Buy Again</Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function OrdersPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
            </div>
        }>
            <OrdersContent />
        </Suspense>
    );
}
