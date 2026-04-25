import { jest } from '@jest/globals';
import request from 'supertest';

// Mock DB
const mockUser = {
    findUnique: jest.fn()
};

jest.unstable_mockModule('../src/config/db.js', () => ({
    default: { user: mockUser }
}));

const app = (await import('../src/index.js')).default;

describe('Auth API (Integration)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 for POST /api/auth/register missing fields', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({});

        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    it('should return 401 for POST /api/auth/login with wrong credentials', async () => {
        // Mock user not found
        mockUser.findUnique.mockResolvedValueOnce(null);

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@test.com', password: 'password' });

        expect(res.status).toBe(401);
        expect(res.body.error).toBeDefined();
    });
});
