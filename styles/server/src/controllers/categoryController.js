import prisma from '../config/db.js';

// Create Category
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await prisma.category.create({
            data: { name, description },
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create category', message: error.message });
    }
};

// Get All Categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: { products: true },
        });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories', message: error.message });
    }
};

// Get Category By ID
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await prisma.category.findUnique({
            where: { id },
            include: { products: true },
        });
        if (!category) return res.status(404).json({ error: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch category', message: error.message });
    }
};

// Update Category
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const category = await prisma.category.update({
            where: { id },
            data: { name, description },
        });
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update category', message: error.message });
    }
};

// Delete Category
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.category.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete category', message: error.message });
    }
};

