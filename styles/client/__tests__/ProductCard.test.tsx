import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../components/ProductCard';

const mockAddCartItem = jest.fn();
jest.mock('../context/CartContext', () => ({
    useCart: () => ({ addItem: mockAddCartItem })
}));

jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({ user: { id: '1', name: 'Test' } })
}));

jest.mock('../context/WishlistContext', () => ({
    useWishlist: () => ({
        items: [],
        addItem: jest.fn(),
        removeItem: jest.fn(),
        isInWishlist: jest.fn().mockReturnValue(false)
    })
}));

// Mock Next router
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() })
}));

describe('ProductCard Component', () => {
    const defaultProps = {
        id: 'p1',
        name: 'Test Product',
        price: 99.99,
        category: 'Men',
        imageUrl: ''
    };

    it('renders product details correctly', () => {
        render(<ProductCard {...defaultProps} />);

        expect(screen.getAllByText('Test Product')[0]).toBeInTheDocument();
        expect(screen.getByText('$99.99')).toBeInTheDocument();
        expect(screen.getAllByText('Men')[0]).toBeInTheDocument();
    });

    it('calls add to cart when Quick Add is clicked', () => {
        render(<ProductCard {...defaultProps} />);

        const addButton = screen.getByText('Quick Add');
        fireEvent.click(addButton);

        expect(mockAddCartItem).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'p1',
                name: 'Test Product',
                price: 99.99
            }),
            1
        );
    });
});
