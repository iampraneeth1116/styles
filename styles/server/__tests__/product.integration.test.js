import { jest } from '@jest/globals';
import request from 'supertest';

// Mock DB
const mockProduct = {
    findMany: jest.fn()
};

jest.unstable_mockModule('../src/config/db.js', () => ({
    default: { product: mockProduct }
}));

const app = (await import('../src/index.js')).default;

describe('Product API (Integration)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 array on GET /api/products', async () => {
        mockProduct.findMany.mockResolvedValueOnce([]);

        const res = await request(app).get('/api/products');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return health OK on GET /api/health', async () => {
        const res = await request(app).get('/api/health');

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('OK');
    });
});
