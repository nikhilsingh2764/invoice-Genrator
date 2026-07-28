import express from 'express';

import validate from '../../middleware/validate.js';
import authMiddleware from '../../middleware/auth.middleware.js';

import { createBusinessValidator, updateBusinessValidator } from '../../validators/business.validator.js';
import {
    createBusiness, getBusinessProfile, updateBusiness,
    deleteBusiness
} from '../../controller/invoice/business.controller.js';

import { businessLimiter } from '../../middleware/rateLimiter.middleware.js';


const router = express.Router();


router.post(
    "/business",
    businessLimiter,
    authMiddleware,
    createBusinessValidator,
    validate,
    createBusiness
)

router.get(
    "/business",
    authMiddleware,
    getBusinessProfile
)

router.delete(
    "/business",
    businessLimiter,
    authMiddleware,
    deleteBusiness
)

router.patch(
    "/business",
    businessLimiter,
    authMiddleware,
    updateBusinessValidator,
    validate,
    updateBusiness
)


export default router;
