import express from 'express';
import { addProduct, listProducts, removeProduct, singleproduct, updateProduct, searchProducts } from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

// Admin routes (protected)
productRouter.post('/add', adminAuth, upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), addProduct);
productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/update', adminAuth, upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), updateProduct);

// Public routes
productRouter.get('/list', listProducts);
productRouter.post('/single', singleproduct);
productRouter.post('/search', searchProducts);

export default productRouter;
