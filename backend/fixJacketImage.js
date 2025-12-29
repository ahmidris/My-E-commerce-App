import mongoose from 'mongoose';
import 'dotenv/config';
import productModel from './models/productModel.js';

const fixJacketImage = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);
        console.log('MongoDB Connected');

        // Update Men's Winter Jacket with a different working image
        await productModel.findOneAndUpdate(
            { name: "Men's Winter Jacket" },
            { image: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500"] }
        );

        console.log("Men's Winter Jacket image updated!");
        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixJacketImage();
