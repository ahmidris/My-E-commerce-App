import mongoose from 'mongoose';
import 'dotenv/config';
import productModel from './models/productModel.js';

// Use reliable placeholder images
const updateImages = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);
        console.log('MongoDB Connected');

        // Update all products with working placeholder images
        const products = await productModel.find({});

        for (const product of products) {
            let imageUrl;

            // Assign images based on category and product name
            if (product.name.includes('T-Shirt') || product.name.includes('Polo')) {
                imageUrl = 'https://picsum.photos/seed/tshirt/400/500';
            } else if (product.name.includes('Dress')) {
                imageUrl = 'https://picsum.photos/seed/dress/400/500';
            } else if (product.name.includes('Jacket')) {
                imageUrl = 'https://picsum.photos/seed/jacket/400/500';
            } else if (product.name.includes('Jeans') || product.name.includes('Chinos')) {
                imageUrl = 'https://picsum.photos/seed/jeans/400/500';
            } else if (product.name.includes('Yoga') || product.name.includes('Pants')) {
                imageUrl = 'https://picsum.photos/seed/pants/400/500';
            } else if (product.name.includes('Sneakers')) {
                imageUrl = 'https://picsum.photos/seed/shoes/400/500';
            } else if (product.name.includes('Cardigan') || product.name.includes('Sweater')) {
                imageUrl = 'https://picsum.photos/seed/sweater/400/500';
            } else if (product.name.includes('Blouse')) {
                imageUrl = 'https://picsum.photos/seed/blouse/400/500';
            } else if (product.name.includes('Hoodie')) {
                imageUrl = 'https://picsum.photos/seed/hoodie/400/500';
            } else {
                imageUrl = `https://picsum.photos/seed/${product._id}/400/500`;
            }

            await productModel.findByIdAndUpdate(product._id, {
                image: [imageUrl]
            });
            console.log(`Updated: ${product.name}`);
        }

        console.log('All product images updated!');
        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateImages();
