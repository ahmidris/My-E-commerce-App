import mongoose from 'mongoose';
import 'dotenv/config';
import productModel from './models/productModel.js';

// Sample products data
const sampleProducts = [
    {
        name: "Classic Cotton T-Shirt",
        description: "Premium quality cotton t-shirt, comfortable and stylish for everyday wear. Made from 100% organic cotton with a relaxed fit.",
        price: 29,
        image: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"],
        category: "Men",
        subCategory: "Topwear",
        sizes: ["S", "M", "L", "XL"],
        bestseller: true,
        date: Date.now()
    },
    {
        name: "Elegant Summer Dress",
        description: "Beautiful floral summer dress, perfect for warm weather occasions. Lightweight and breathable fabric.",
        price: 59,
        image: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500"],
        category: "Women",
        subCategory: "Topwear",
        sizes: ["S", "M", "L"],
        bestseller: true,
        date: Date.now() - 1000
    },
    {
        name: "Kids Denim Jacket",
        description: "Trendy denim jacket for kids, durable and fashionable. Perfect for all seasons.",
        price: 45,
        image: ["https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500"],
        category: "Kids",
        subCategory: "Topwear",
        sizes: ["S", "M", "L"],
        bestseller: true,
        date: Date.now() - 2000
    },
    {
        name: "Men's Slim Fit Jeans",
        description: "Classic slim fit jeans with comfortable stretch. Perfect for casual and semi-formal occasions.",
        price: 65,
        image: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=500"],
        category: "Men",
        subCategory: "Bottomwear",
        sizes: ["S", "M", "L", "XL"],
        bestseller: false,
        date: Date.now() - 3000
    },
    {
        name: "Women's Yoga Pants",
        description: "High-waisted yoga pants with four-way stretch. Comfortable for workouts and everyday wear.",
        price: 42,
        image: ["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500"],
        category: "Women",
        subCategory: "Bottomwear",
        sizes: ["S", "M", "L", "XL"],
        bestseller: true,
        date: Date.now() - 4000
    },
    {
        name: "Kids Sneakers",
        description: "Comfortable and colorful sneakers for active kids. Durable sole with cushioned insole.",
        price: 38,
        image: ["https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500"],
        category: "Kids",
        subCategory: "Winterwear",
        sizes: ["S", "M", "L"],
        bestseller: false,
        date: Date.now() - 5000
    },
    {
        name: "Men's Winter Jacket",
        description: "Warm and stylish winter jacket with insulated lining. Water-resistant and windproof.",
        price: 120,
        image: ["https://images.unsplash.com/photo-1544923246-77307dd628b8?w=500"],
        category: "Men",
        subCategory: "Winterwear",
        sizes: ["M", "L", "XL"],
        bestseller: true,
        date: Date.now() - 6000
    },
    {
        name: "Women's Cardigan Sweater",
        description: "Soft knit cardigan perfect for layering. Available in multiple colors.",
        price: 55,
        image: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500"],
        category: "Women",
        subCategory: "Winterwear",
        sizes: ["S", "M", "L"],
        bestseller: false,
        date: Date.now() - 7000
    },
    {
        name: "Premium Polo Shirt",
        description: "Classic polo shirt with a modern fit. Perfect for casual Fridays or weekend outings.",
        price: 35,
        image: ["https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500"],
        category: "Men",
        subCategory: "Topwear",
        sizes: ["S", "M", "L", "XL"],
        bestseller: false,
        date: Date.now() - 8000
    },
    {
        name: "Floral Blouse",
        description: "Elegant floral blouse with delicate patterns. Perfect for office or casual wear.",
        price: 48,
        image: ["https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500"],
        category: "Women",
        subCategory: "Topwear",
        sizes: ["S", "M", "L"],
        bestseller: true,
        date: Date.now() - 9000
    },
    {
        name: "Kids Hoodie",
        description: "Cozy cotton hoodie for kids with fun prints. Perfect for school or play.",
        price: 32,
        image: ["https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=500"],
        category: "Kids",
        subCategory: "Topwear",
        sizes: ["S", "M", "L"],
        bestseller: false,
        date: Date.now() - 10000
    },
    {
        name: "Casual Chinos",
        description: "Versatile chino pants that work for any occasion. Comfortable fit with modern styling.",
        price: 52,
        image: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500"],
        category: "Men",
        subCategory: "Bottomwear",
        sizes: ["M", "L", "XL"],
        bestseller: false,
        date: Date.now() - 11000
    }
];

const seedProducts = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);
        console.log('MongoDB Connected');

        // Clear existing products (optional - comment out if you want to keep existing)
        // await productModel.deleteMany({});
        // console.log('Cleared existing products');

        // Insert sample products
        const result = await productModel.insertMany(sampleProducts);
        console.log(`Successfully added ${result.length} sample products!`);

        // Disconnect
        await mongoose.disconnect();
        console.log('MongoDB Disconnected');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
