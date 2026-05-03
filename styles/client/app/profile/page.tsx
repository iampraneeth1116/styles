'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

export default function ProfilePage() {
    const { user, updateProfile, isLoading } = useAuth();
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        } else if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user, isLoading, router]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!name || !email) {
            setError('Please fill out all fields.');
            return;
        }

        setSaving(true);
        try {
            await updateProfile(name, email);
            setSuccess('Profile updated successfully.');
            // clear success message after a few seconds
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setError('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (isLoading || !user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-12">
                <h1 className="text-4xl font-bold tracking-tighter text-[var(--primary)] mb-2">MY PROFILE</h1>
                <p className="text-[var(--muted)]">Manage your account details and preferences.</p>
            </div>

            <div className="bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl border border-[var(--border)] max-w-2xl">
                <h2 className="text-xl font-semibold mb-6">Personal Information</h2>

                <form onSubmit={handleUpdate} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 text-sm border border-red-100">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 text-green-600 p-3 text-sm border border-green-100 flex items-center">
                            <span className="mr-2">✓</span> {success}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-[var(--primary)] mb-1">Full Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-[var(--border)] placeholder-[var(--muted)] text-[var(--primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent sm:text-sm transition-all duration-200 bg-[var(--accent)] hover:bg-white"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[var(--primary)] mb-1">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-[var(--border)] placeholder-[var(--muted)] text-[var(--primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent sm:text-sm transition-all duration-200 bg-[var(--accent)] hover:bg-white"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--border)]">
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full sm:w-auto px-8 rounded-md shadow-sm hover:shadow-md transition-all"
                            disabled={saving || (name === user.name && email === user.email)}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
