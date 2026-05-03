const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

export const fetchData = async (endpoint: string, options: FetchOptions = {}) => {
    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        // Attach token if exists
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('styles-token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || errorData.message || 'Something went wrong');
        }

        // Handle 204 No Content
        if (response.status === 204) return null;

        return await response.json();
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
};

export interface ProductsQueryOptions {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
}

export const api = {
    products: {
        getAll: (params?: ProductsQueryOptions) => {
            let queryString = '';
            if (params) {
                const searchParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined) {
                        searchParams.append(key, String(value));
                    }
                });
                const qs = searchParams.toString();
                if (qs) {
                    queryString = `?${qs}`;
                }
            }
            return fetchData(`/products${queryString}`);
        },
        getById: (id: string) => fetchData(`/products/${id}`),
    },
    categories: {
        getAll: () => fetchData('/categories'),
        getById: (id: string) => fetchData(`/categories/${id}`),
    },
    orders: {
        create: (data: { customerName: string; customerEmail: string; items: { productId: string; quantity: number }[] }) =>
            fetchData('/orders', { method: 'POST', body: JSON.stringify(data) }),
        getAll: () => fetchData('/orders'),
        getById: (id: string) => fetchData(`/orders/${id}`),
    },
    auth: {
        register: (data: Record<string, unknown>) => fetchData('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
        login: (data: Record<string, unknown>) => fetchData('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
        getMe: () => fetchData('/auth/me'),
        updateProfile: (data: Record<string, unknown>) => fetchData('/auth/me', { method: 'PUT', body: JSON.stringify(data) }),
    },
    wishlist: {
        get: () => fetchData('/wishlist'),
        add: (productId: string) => fetchData('/wishlist', { method: 'POST', body: JSON.stringify({ productId }) }),
        remove: (productId: string) => fetchData(`/wishlist/${productId}`, { method: 'DELETE' }),
    }
};
