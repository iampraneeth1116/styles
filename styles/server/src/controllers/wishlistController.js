import prisma from '../config/db.js';

// Get user wishlist
export const getWishlist = async (req, res) => {
    try {
        const wishlistItems = await prisma.wishlistItem.findMany({
            where: { userId: req.user.userId },
            include: {
                product: {
                    include: { category: true }
                }
            }
        });

        const formattedWishlist = wishlistItems.map(item => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            imageUrl: item.product.images[0] || '',
            category: item.product.category?.name || 'Uncategorized'
        }));

        res.status(200).json(formattedWishlist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch wishlist', message: error.message });
    }
};

// Add product to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        const existingItem = await prisma.wishlistItem.findUnique({
            where: {
                userId_productId: {
                    userId: req.user.userId,
                    productId
                }
            }
        });

        if (existingItem) {
            return res.status(400).json({ error: 'Product is already in wishlist' });
        }

        await prisma.wishlistItem.create({
            data: {
                userId: req.user.userId,
                productId
            }
        });

        res.status(201).json({ message: 'Added to wishlist' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add to wishlist', message: error.message });
    }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        await prisma.wishlistItem.delete({
            where: {
                userId_productId: {
                    userId: req.user.userId,
                    productId
                }
            }
        });

        res.status(200).json({ message: 'Removed from wishlist' });
    } catch (error) {
        // Ignore if not found
        if (error.code === 'P2025') {
            return res.status(200).json({ message: 'Removed from wishlist' });
        }
        res.status(500).json({ error: 'Failed to remove from wishlist', message: error.message });
    }
};
