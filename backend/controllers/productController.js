import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';

// Function for adding a product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        // Accessing uploaded files (they may not all be present)
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        // Upload images to Cloudinary
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path || `data:${item.mimetype};base64,${item.buffer.toString('base64')}`, {
                    resource_type: 'image'
                });
                return result.secure_url;
            })
        );

        const productData = {
            name,
            description,
            category,
            subCategory,
            price: Number(price),
            bestseller: bestseller === 'true' ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        };

        const product = new productModel(productData);
        await product.save();

        res.status(201).json({ success: true, message: "Product Added Successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Adding Product Failed, Please try again later" });
    }
};

// Function for listing all products
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to fetch products" });
    }
};

// Function for removing a product
const removeProduct = async (req, res) => {
    try {
        const { id } = req.body;
        await productModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Product Removed Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to remove product" });
    }
};

// Function for getting single product info
const singleproduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to fetch product" });
    }
};

// Function for updating a product
const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price, category, subCategory, sizes, bestseller } = req.body;

        // Check if product exists
        const existingProduct = await productModel.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Handle new images if uploaded
        let imagesUrl = existingProduct.image; // Keep existing images by default

        if (req.files && Object.keys(req.files).length > 0) {
            const image1 = req.files.image1 && req.files.image1[0];
            const image2 = req.files.image2 && req.files.image2[0];
            const image3 = req.files.image3 && req.files.image3[0];
            const image4 = req.files.image4 && req.files.image4[0];

            const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

            if (images.length > 0) {
                imagesUrl = await Promise.all(
                    images.map(async (item) => {
                        let result = await cloudinary.uploader.upload(item.path || `data:${item.mimetype};base64,${item.buffer.toString('base64')}`, {
                            resource_type: 'image'
                        });
                        return result.secure_url;
                    })
                );
            }
        }

        // Update product data
        const updateData = {
            name: name || existingProduct.name,
            description: description || existingProduct.description,
            price: price ? Number(price) : existingProduct.price,
            category: category || existingProduct.category,
            subCategory: subCategory || existingProduct.subCategory,
            sizes: sizes ? JSON.parse(sizes) : existingProduct.sizes,
            bestseller: bestseller !== undefined ? bestseller === 'true' : existingProduct.bestseller,
            image: imagesUrl
        };

        await productModel.findByIdAndUpdate(id, updateData);

        res.status(200).json({ success: true, message: "Product Updated Successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to update product" });
    }
};

// Function for searching and filtering products
const searchProducts = async (req, res) => {
    try {
        const {
            search,      // Text search in name/description
            category,    // Filter by category (Men, Women, Kids)
            subCategory, // Filter by subCategory (Topwear, Bottomwear, etc)
            minPrice,    // Minimum price filter
            maxPrice,    // Maximum price filter
            bestseller,  // Filter bestsellers only
            sortBy,      // Sort field (price, date, name)
            sortOrder,   // Sort order (asc, desc)
            page = 1,    // Page number for pagination
            limit = 12   // Items per page
        } = req.body;

        // Build query object
        let query = {};

        // Text search in name and description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Category filter
        if (category) {
            query.category = category;
        }

        // SubCategory filter
        if (subCategory) {
            query.subCategory = subCategory;
        }

        // Price range filter
        if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};
            if (minPrice !== undefined) query.price.$gte = Number(minPrice);
            if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
        }

        // Bestseller filter
        if (bestseller === 'true' || bestseller === true) {
            query.bestseller = true;
        }

        // Build sort object
        let sort = {};
        if (sortBy) {
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        } else {
            sort.date = -1; // Default: newest first
        }

        // Calculate skip for pagination
        const skip = (Number(page) - 1) * Number(limit);

        // Execute query with pagination
        const products = await productModel
            .find(query)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        // Get total count for pagination info
        const total = await productModel.countDocuments(query);

        res.status(200).json({
            success: true,
            products,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                totalProducts: total,
                hasMore: skip + products.length < total
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to search products" });
    }
};

export { addProduct, listProducts, removeProduct, singleproduct, updateProduct, searchProducts };