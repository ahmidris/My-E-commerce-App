import mongoose from 'mongoose';
import 'dotenv/config';
import productModel from './models/productModel.js';

// Restore original Unsplash images
const restoreImages = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);
        console.log('MongoDB Connected');

        const products = await productModel.find({});

        const originalImages = {
            "Classic Cotton T-Shirt": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
            "Elegant Summer Dress": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500",
            "Kids Denim Jacket": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500",
            "Men's Slim Fit Jeans": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
            "Women's Yoga Pants": "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500",
            "Kids Sneakers": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500",
            "Men's Winter Jacket": "https://images.unsplash.com/photo-1544923246-77307dd628b8?w=500",
            "Women's Cardigan Sweater": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500",
            "Premium Polo Shirt": "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500",
            "Floral Blouse": "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500",
            "Kids Hoodie": "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=500",
            "Casual Chinos": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500"
        };

        for (const product of products) {
            if (originalImages[product.name]) {
                await productModel.findByIdAndUpdate(product._id, {
                    image: [originalImages[product.name]]
                });
                console.log(`Restored: ${product.name}`);
            }
        }

        console.log('Original images restored!');
        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

restoreImages();
