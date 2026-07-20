import authMiddleware from '../middleware/auth.middleware.js';
import express from "express";

import { createProductValidator, updateProductValidator } from '../validators/product.validator.js';
import validate from '../middleware/validate.js';

import { ProductLimiter } from '../middleware/rateLimiter.middleware.js';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../controller/product.controller.js";

const router = express.Router();


router.post('/product', ProductLimiter, authMiddleware, createProductValidator, validate, createProduct);

router.get('/product', authMiddleware, getAllProducts);

router.get('/product/:id', authMiddleware, getProductById);

router.patch('/product/:id', ProductLimiter, authMiddleware, createProductValidator, validate, updateProduct);

router.delete('/product/:id', ProductLimiter, authMiddleware, deleteProduct);




export default router;