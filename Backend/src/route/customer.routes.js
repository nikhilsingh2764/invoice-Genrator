import authMiddleware from '../middleware/auth.middleware.js';
import express from "express";

import { createCustomerValidator, updateCustomerValidator } from '../validators/customer.validator.js';
import validate from '../middleware/validate.js';

import { CustomerLimiter } from '../middleware/rateLimiter.middleware.js';
import {
    createCustomer, getAllCustomers, getCustomerById,
    updateCustomer, deleteCustomer
} from '../controller/customer.controller.js';


const router = express.Router();


router.post(
    '/customer',
    CustomerLimiter,
    authMiddleware,
    createCustomerValidator,
    validate,
    createCustomer
);

router.get(
    '/customer',
    authMiddleware,
    getAllCustomers
);

router.get(
    '/customer/:id',
    authMiddleware,
    getCustomerById
);

router.patch(
    '/customer/:id',
    CustomerLimiter,
    authMiddleware,
    updateCustomerValidator,
    validate,
    updateCustomer
);

router.delete(
    '/customer/:id',
    CustomerLimiter,
    authMiddleware,
    deleteCustomer
);

export default router;


