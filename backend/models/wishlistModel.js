import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    products: { type: Array, default: [] }
}, { minimize: false });

const wishlistModel = mongoose.models.wishlist || mongoose.model('wishlist', wishlistSchema);

export default wishlistModel;
