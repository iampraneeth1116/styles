import prisma from '../config/db.js';

// Create Order
export const createOrder = async (req, res) => {
    try {
        const { customerName, customerEmail, items } = req.body;

        if (!customerName || !customerEmail || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Missing required order details or empty items' });
        }

        // items = [{ productId, quantity }]
        // Look up each product to get the current price
        const productIds = items.map((i) => i.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
        });

        const orderItems = items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) throw new Error(`Product ${item.productId} not found`);
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
            };
        });

        const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

        const order = await prisma.order.create({
            data: {
                customerName,
                customerEmail,
                total,
                items: { create: orderItems },
            },
            include: { items: { include: { product: true } } },
        });

        // Decrement stock for each product
        for (const item of orderItems) {
            await prisma.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
            });
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create order', message: error.message });
    }
};

// Get All Orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders', message: error.message });
    }
};

// Get Order By ID
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await prisma.order.findUnique({
            where: { id },
            include: { items: { include: { product: true } } },
        });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order', message: error.message });
    }
};

// Update Order Status
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await prisma.order.update({
            where: { id },
            data: { status },
            include: { items: { include: { product: true } } },
        });
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update order', message: error.message });
    }
};

// Delete Order
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        // Delete order items first, then the order
        await prisma.orderItem.deleteMany({ where: { orderId: id } });
        await prisma.order.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete order', message: error.message });
    }
};
