import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';

// Mock contexts
jest.mock('../context/CartContext', () => ({
    useCart: () => ({ totalItems: 2 })
}));
jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({ user: null, logout: jest.fn() })
}));
jest.mock('../context/WishlistContext', () => ({
    useWishlist: () => ({ totalItems: 1 })
}));

describe('Navbar Component', () => {
    it('renders logo and navigation links', () => {
        render(<Navbar />);

        // Check logo
        expect(screen.getByText('STYLES')).toBeInTheDocument();

        // Check links
        expect(screen.getByText('Men')).toBeInTheDocument();
        expect(screen.getByText('Women')).toBeInTheDocument();

        // Check cart items
        expect(screen.getByText('2')).toBeInTheDocument();

        // Check wishlist items
        expect(screen.getByText('1')).toBeInTheDocument();
    });
});
