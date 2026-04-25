import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await prisma.wishlistItem.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    // Create Categories
    const men = await prisma.category.create({
        data: { name: 'Men', description: 'Elevated essentials for the modern man.' },
    });
    const women = await prisma.category.create({
        data: { name: 'Women', description: 'Timeless pieces for the contemporary woman.' },
    });
    const accessories = await prisma.category.create({
        data: { name: 'Accessories', description: 'The finishing touches that define your look.' },
    });

    console.log('✅ Categories created.');

    // Create Products
    await prisma.product.createMany({
        data: [
            {
                name: 'Minimalist Linen Shirt',
                description: 'A breathable, relaxed-fit linen shirt in a soft ivory tone. Perfect for warm-weather layering.',
                price: 89.00,
                images: ['https://images.unsplash.com/photo-1596755094514-f87e32f85e23?q=80&w=800&auto=format&fit=crop'],
                stock: 50,
                categoryId: men.id,
            },
            {
                name: 'Tailored Wool Trousers',
                description: 'Slim-fit trousers crafted from Italian merino wool. A wardrobe staple.',
                price: 165.00,
                images: ['https://images.unsplash.com/photo-1624378439575-d1ead6bb17f8?q=80&w=800&auto=format&fit=crop'],
                stock: 35,
                categoryId: men.id,
            },
            {
                name: 'Cashmere Crewneck Sweater',
                description: 'Ultra-soft cashmere knit with a clean crewneck silhouette.',
                price: 245.00,
                images: ['https://images.unsplash.com/photo-1614252339475-5332f1ad9226?q=80&w=800&auto=format&fit=crop'],
                stock: 25,
                categoryId: men.id,
            },
            {
                name: 'Everyday Oxford Shirt',
                description: 'Classic button-down collar Oxford shirt in light blue.',
                price: 75.00,
                images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800&auto=format&fit=crop'],
                stock: 80,
                categoryId: men.id,
            },
            {
                name: 'Selvedge Denim Jeans',
                description: 'Straight-leg raw Japanese selvedge denim built to last.',
                price: 185.00,
                images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop'],
                stock: 45,
                categoryId: men.id,
            },
            {
                name: 'Heavyweight Cotton Tee',
                description: 'Boxy-fit premium combed cotton t-shirt in vintage wash.',
                price: 45.00,
                images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop'],
                stock: 120,
                categoryId: men.id,
            },
            {
                name: 'Water-Resistant Trench',
                description: 'Modern longline trench coat with weather-resistant finishing.',
                price: 320.00,
                images: ['https://images.unsplash.com/photo-1520975954732-57dd22299614?q=80&w=800&auto=format&fit=crop'],
                stock: 15,
                categoryId: men.id,
            },
            {
                name: 'Leather Chelsea Boots',
                description: 'Hand-welted suede Chelsea boots with a slim profile.',
                price: 240.00,
                images: ['https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=800&auto=format&fit=crop'],
                stock: 30,
                categoryId: men.id,
            },
            {
                name: 'Silk Slip Dress',
                description: 'Flowing midi-length slip dress in luxurious mulberry silk.',
                price: 145.00,
                images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop'],
                stock: 40,
                categoryId: women.id,
            },
            {
                name: 'Classic Tailored Blazer',
                description: 'A structured double-breasted blazer in soft beige wool blend.',
                price: 280.00,
                images: ['https://images.unsplash.com/photo-1548624313-0396c75e4b1a?q=80&w=800&auto=format&fit=crop'],
                stock: 20,
                categoryId: women.id,
            },
            {
                name: 'Organic Cotton Wrap Top',
                description: 'A flattering wrap silhouette in certified organic cotton.',
                price: 78.00,
                images: ['https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=800&auto=format&fit=crop'],
                stock: 60,
                categoryId: women.id,
            },
            {
                name: 'High-Rise Wide Leg Trousers',
                description: 'Flowy pleated trousers ideal for office to evening transition.',
                price: 135.00,
                images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop'],
                stock: 40,
                categoryId: women.id,
            },
            {
                name: 'Ribbed Knit Midi Dress',
                description: 'Form-fitting ribbed dress with a subtle side slit.',
                price: 115.00,
                images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop'],
                stock: 55,
                categoryId: women.id,
            },
            {
                name: 'Oversized Poplin Shirt',
                description: 'Borrowed-from-the-boys oversized fit in crisp white poplin.',
                price: 85.00,
                images: ['https://images.unsplash.com/photo-1604085449910-186e88ff25fc?q=80&w=800&auto=format&fit=crop'],
                stock: 75,
                categoryId: women.id,
            },
            {
                name: 'Belted Wool Coat',
                description: 'Dramatically long wool-blend wrap coat in camel.',
                price: 380.00,
                images: ['https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=800&auto=format&fit=crop'],
                stock: 10,
                categoryId: women.id,
            },
            {
                name: 'Satin Camisole',
                description: 'V-neck bias cut camisole top with adjustable spaghetti straps.',
                price: 65.00,
                images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop'],
                stock: 90,
                categoryId: women.id,
            },
            {
                name: 'Leather Crossbody Bag',
                description: 'Full-grain leather crossbody with adjustable strap and minimal hardware.',
                price: 195.00,
                images: ['https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop'],
                stock: 30,
                categoryId: accessories.id,
            },
            {
                name: 'Silk Scarf',
                description: 'Hand-rolled Italian silk scarf in a subtle geometric print.',
                price: 95.00,
                images: ['https://images.unsplash.com/photo-1584670659638-341a9eb482a1?q=80&w=800&auto=format&fit=crop'],
                stock: 45,
                categoryId: accessories.id,
            },
            {
                name: 'Classic Leather Belt',
                description: 'Minimalist full-grain leather belt with a matte black buckle.',
                price: 65.00,
                images: ['https://images.unsplash.com/photo-1553531384-cc64ac80f931?q=80&w=800&auto=format&fit=crop'],
                stock: 60,
                categoryId: accessories.id,
            },
            {
                name: 'Polarized Sunglasses',
                description: 'Vintage-inspired acetate frames with polarized lenses for everyday wear.',
                price: 125.00,
                images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop'],
                stock: 25,
                categoryId: accessories.id,
            },
            {
                name: 'Cashmere Beanie',
                description: 'Rib-knit cashmere beanie perfect for the colder months.',
                price: 85.00,
                images: ['https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=800&auto=format&fit=crop'],
                stock: 50,
                categoryId: accessories.id,
            },
            {
                name: 'Minimalist Cardholder',
                description: 'Slim leather card tight enough for 4 cards and folded cash.',
                price: 45.00,
                images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop'],
                stock: 80,
                categoryId: accessories.id,
            },
            {
                name: 'Woven Fedora Hat',
                description: 'A structured woven fedora ideal for sunny getaways.',
                price: 115.00,
                images: ['https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?q=80&w=800&auto=format&fit=crop'],
                stock: 15,
                categoryId: accessories.id,
            },
            {
                name: 'Canvas Tote Bag',
                description: 'Heavyweight organic cotton canvas tote for your daily essentials.',
                price: 55.00,
                images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop'],
                stock: 100,
                categoryId: accessories.id,
            },
            {
                name: 'Sterling Silver Cuff',
                description: 'Hand-polished solid 925 sterling silver minimal cuff bracelet.',
                price: 150.00,
                images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop'],
                stock: 20,
                categoryId: accessories.id,
            },
            {
                name: 'Vintage Wash Denim Jacket',
                description: 'Classic trucker jacket silhouette crafted from heavy vintage wash denim.',
                price: 110.00,
                images: ['https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?q=80&w=800&auto=format&fit=crop'],
                stock: 40,
                categoryId: men.id,
            },
            {
                name: 'Merino Wool Turtleneck',
                description: 'Fine-gauge merino wool turtleneck, perfect for layering during cooler months.',
                price: 125.00,
                images: ['https://images.unsplash.com/photo-1574252683059-679951bebbdc?q=80&w=800&auto=format&fit=crop'],
                stock: 35,
                categoryId: men.id,
            },
            {
                name: 'Structured Midi Skirt',
                description: 'A deeply tailored midi skirt with structured pleats and hidden pockets.',
                price: 95.00,
                images: ['https://images.unsplash.com/photo-1583496661160-c588a25c40c5?q=80&w=800&auto=format&fit=crop'],
                stock: 60,
                categoryId: women.id,
            },
            {
                name: 'Elegant Silk Blouse',
                description: 'Relaxed fit silk blouse featuring a minimalist pointed collar and hidden button placket.',
                price: 140.00,
                images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop'],
                stock: 25,
                categoryId: women.id,
            },
            {
                name: 'Canvas Weekender Bag',
                description: 'Durable heavyweight canvas weekender with premium full-grain leather accents.',
                price: 215.00,
                images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop'],
                stock: 15,
                categoryId: accessories.id,
            },
            {
                name: 'Classic White Sneakers',
                description: 'Minimalist low-top sneakers crafted from premium Italian leather.',
                price: 160.00,
                images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop'],
                stock: 80,
                categoryId: men.id,
            },
            {
                name: 'Ribbed Cashmere Scarf',
                description: 'An oversized, exceptionally soft cashmere scarf for absolute comfort.',
                price: 185.00,
                images: ['https://images.unsplash.com/photo-1604644401890-0bd678c83788?q=80&w=800&auto=format&fit=crop'],
                stock: 20,
                categoryId: accessories.id,
            },
            {
                name: 'High-Waisted Straight Leg Jeans',
                description: 'Vintage-inspired high-rise jeans with a flattering straight-leg fit.',
                price: 130.00,
                images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop'],
                stock: 55,
                categoryId: women.id,
            },
            {
                name: 'Leather Dopp Kit',
                description: 'Water-resistant leather toiletry bag with brass hardware.',
                price: 85.00,
                images: ['https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=800&auto=format&fit=crop'],
                stock: 45,
                categoryId: accessories.id,
            },
            {
                name: 'Chunky Knit Cardigan',
                description: 'Oversized drop-shoulder cardigan hand-knitted from a soft wool blend.',
                price: 195.00,
                images: ['https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=800&auto=format&fit=crop'],
                stock: 30,
                categoryId: women.id,
            }
        ],
    });

    console.log('✅ Products created.');
    console.log('🎉 Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
