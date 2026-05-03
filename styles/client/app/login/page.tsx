'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            router.push('/');
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            setError(err.message || 'An error occurred during login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 bg-[var(--accent)]">
            <div className="w-full max-w-md space-y-8 bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl border border-[var(--border)]">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tighter text-[var(--primary)]">WELCOME BACK</h1>
                    <p className="mt-2 text-sm text-[var(--muted)]">Sign in to your Styles account</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 text-sm text-center border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-[var(--border)] placeholder-[var(--muted)] text-[var(--primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent sm:text-sm transition-all duration-200 bg-[var(--accent)] hover:bg-white"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-[var(--border)] placeholder-[var(--muted)] text-[var(--primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent sm:text-sm transition-all duration-200 bg-[var(--accent)] hover:bg-white"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)] border-[var(--border)] rounded-none"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-[var(--muted)]">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-[var(--primary)] hover:text-[var(--muted)] transition-colors">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full flex justify-center py-3 rounded-md shadow-md hover:shadow-lg transition-all"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-[var(--muted)]">Don&apos;t have an account? </span>
                    <Link href="/register" className="font-medium text-[var(--primary)] hover:underline">
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
}
