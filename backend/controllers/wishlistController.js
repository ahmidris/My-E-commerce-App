import wishlistModel from '../models/wishlistModel.js';
import productModel from '../models/productModel.js';

// Add product to wishlist
const addToWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Verify product exists
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Find or create wishlist for user
        let wishlist = await wishlistModel.findOne({ userId });

        if (!wishlist) {
            wishlist = new wishlistModel({ userId, products: [productId] });
        } else {
            // Check if product already in wishlist
            if (wishlist.products.includes(productId)) {
                return res.status(400).json({ success: false, message: "Product already in wishlist" });
            }
            wishlist.products.push(productId);
        }

        await wishlist.save();

        res.status(200).json({ success: true, message: "Added to wishlist" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to add to wishlist" });
    }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const wishlist = await wishlistModel.findOne({ userId });

        if (!wishlist) {
            return res.status(404).json({ success: false, message: "Wishlist not found" });
        }

        // Remove product from wishlist
        wishlist.products = wishlist.products.filter(id => id !== productId);
        await wishlist.save();

        res.status(200).json({ success: true, message: "Removed from wishlist" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to remove from wishlist" });
    }
};

// Get user wishlist with product details
const getWishlist = async (req, res) => {
    try {
        const { userId } = req.body;

        const wishlist = await wishlistModel.findOne({ userId });

        if (!wishlist || wishlist.products.length === 0) {
            return res.status(200).json({ success: true, products: [] });
        }

        // Get product details for all wishlist items
        const products = await productModel.find({ _id: { $in: wishlist.products } });

        res.status(200).json({ success: true, products });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to fetch wishlist" });
    }
};

export { addToWishlist, removeFromWishlist, getWishlist };
