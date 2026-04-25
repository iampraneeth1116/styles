import prisma from '../config/db.js';

// Create Product
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, images, stock, categoryId } = req.body;
        const product = await prisma.product.create({
            data: { name, description, price, images, stock, categoryId },
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create product', message: error.message });
    }
};

// Get All Products
export const getAllProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, limit } = req.query;

        const where = {};
        
        if (category) {
            where.category = {
                name: {
                    equals: category,
                    mode: 'insensitive',
                }
            };
        }
        
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(minPrice);
            if (maxPrice) where.price.lte = parseFloat(maxPrice);
        }

        const args = {
            where,
            include: { category: true },
            orderBy: { createdAt: 'desc' },
        };

        if (limit) {
            args.take = parseInt(limit, 10);
        }

        const products = await prisma.product.findMany(args);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products', message: error.message });
    }
};

// Get Product By ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product', message: error.message });
    }
};

// Update Product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, images, stock, categoryId } = req.body;
        const product = await prisma.product.update({
            where: { id },
            data: { name, description, price, images, stock, categoryId },
        });
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update product', message: error.message });
    }
};

// Delete Product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete product', message: error.message });
    }
};
