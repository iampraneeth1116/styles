import { jest } from '@jest/globals';
import request from 'supertest';

// Mock DB
const mockWishlistItem = {
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn()
};

jest.unstable_mockModule('../src/config/db.js', () => ({
    default: { wishlistItem: mockWishlistItem }
}));

// Mock auth middleware
jest.unstable_mockModule('../src/middleware/authMiddleware.js', () => ({
    protect: (req, res, next) => {
        req.user = { userId: 'user_1' };
        next();
    }
}));

const app = (await import('../src/index.js')).default;

describe('Wishlist API (Integration)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 array on GET /api/wishlist', async () => {
        mockWishlistItem.findMany.mockResolvedValueOnce([]);

        const res = await request(app).get('/api/wishlist');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should create wishlist item on POST /api/wishlist', async () => {
        mockWishlistItem.findUnique.mockResolvedValueOnce(null);
        mockWishlistItem.create.mockResolvedValueOnce({ id: 'item_1', productId: 'prod_1' });

        const res = await request(app)
            .post('/api/wishlist')
            .send({ productId: 'prod_1' });

        expect(res.status).toBe(201);
        expect(mockWishlistItem.create).toHaveBeenCalled();
    });
});
