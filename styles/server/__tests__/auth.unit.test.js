import { jest } from '@jest/globals';

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

// Mock dependencies
const mockUser = {
    findUnique: jest.fn(),
    create: jest.fn(),
};

jest.unstable_mockModule('../src/config/db.js', () => ({
    default: { user: mockUser }
}));

const { register } = await import('../src/controllers/authController.js');

describe('Auth Controller - register (Unit)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if required fields are missing', async () => {
        const req = { body: {} };
        const res = mockRes();

        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    });

    it('should return 400 if user already exists', async () => {
        const req = { body: { name: 'Test', email: 'test@test.com', password: 'password123' } };
        const res = mockRes();

        mockUser.findUnique.mockResolvedValueOnce({ id: '1', email: 'test@test.com' });

        await register(req, res);

        expect(mockUser.findUnique).toHaveBeenCalledWith({ where: { email: 'test@test.com' } });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'User with this email already exists' }));
    });
});
