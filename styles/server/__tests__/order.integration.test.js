import { jest } from '@jest/globals';
import request from 'supertest';

// Mock DB
const mockOrder = {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn()
};
const mockProduct = {
    findMany: jest.fn(),
    update: jest.fn()
};

jest.unstable_mockModule('../src/config/db.js', () => ({
    default: { order: mockOrder, product: mockProduct }
}));

const app = (await import('../src/index.js')).default;

describe('Order API (Integration)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 for POST /api/orders missing fields', async () => {
        const res = await request(app)
            .post('/api/orders')
            .send({ items: [] }); // Empty items list

        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    it('should calculate total and create order correctly for POST /api/orders', async () => {
        mockProduct.findMany.mockResolvedValueOnce([
            { id: '1', price: 100 },
            { id: '2', price: 50 },
        ]);
        mockProduct.update.mockResolvedValue({});

        mockOrder.create.mockResolvedValueOnce({ id: 'order_1', total: 150 });

        const res = await request(app)
            .post('/api/orders')
            .send({
                customerName: 'Test',
                customerEmail: 'test@example.com',
                items: [{ productId: '1', quantity: 1 }, { productId: '2', quantity: 1 }]
            });

        expect(res.status).toBe(201);
        expect(mockOrder.create).toHaveBeenCalled();
        const createCall = mockOrder.create.mock.calls[0][0];
        expect(createCall.data.total).toBe(150); // Verification of server-side calculation
    });
});
