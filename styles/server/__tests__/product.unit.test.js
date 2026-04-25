import { jest } from '@jest/globals';

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

const mockProduct = {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

jest.unstable_mockModule('../src/config/db.js', () => ({
    default: { product: mockProduct }
}));

const { getAllProducts, getProductById } = await import('../src/controllers/productController.js');

describe('Product Controller (Unit)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return all products via getAllProducts', async () => {
        const req = {};
        const res = mockRes();

        const mockProductsData = [
            { id: '1', name: 'Product 1', price: 99 },
            { id: '2', name: 'Product 2', price: 199 }
        ];
        mockProduct.findMany.mockResolvedValueOnce(mockProductsData);

        await getAllProducts(req, res);

        expect(mockProduct.findMany).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockProductsData);
    });

    it('should return 404 if product not found by ID', async () => {
        const req = { params: { id: '999' } };
        const res = mockRes();

        mockProduct.findUnique.mockResolvedValueOnce(null);

        await getProductById(req, res);

        expect(mockProduct.findUnique).toHaveBeenCalledWith({
            where: { id: '999' },
            include: { category: true }
        });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });
});
