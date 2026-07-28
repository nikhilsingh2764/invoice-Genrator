import authMiddleware from '../../middleware/auth.middleware.js';
import express from "express";


import validate from '../../middleware/validate.js';
import { updateInvoiceValidator, createInvoiceValidator } from '../../validators/invoice.validator.js';

import {
    createInvoice, getInvoiceById, updateInvoice,
    deleteInvoice, downloadInvoicePDF, sendInvoiceEmail, duplicateInvoice
} from '../../controller/invoice/invoice.controller.js';

import {
    invoiceCreateLimiter, invoiceUpdateLimiter, invoiceDeleteLimiter,
    invoiceEmailLimiter, invoiceWhatsappLimiter, invoiceDuplicateLimiter, invoiceReadLimiter
} from '../../middleware/rateLimiter.middleware.js';



const router = express.Router();

router.post(
    "/invoice",
    invoiceCreateLimiter,
    authMiddleware,
    createInvoiceValidator,
    validate,
    createInvoice
)


router.get(
    "/invoice/:id",
    invoiceReadLimiter,
    authMiddleware,
    getInvoiceById
)

router.patch(
    "/invoice/:id",
    invoiceUpdateLimiter,
    authMiddleware,
    updateInvoiceValidator,
    validate,
    updateInvoice
)

router.delete(
    "/invoice/:id",
    invoiceDeleteLimiter,
    authMiddleware,
    deleteInvoice
)

router.get(
    "/invoice/:id/pdf",
    authMiddleware,
    downloadInvoicePDF
)


router.post(
    "/invoice/:id/email",
    invoiceEmailLimiter,
    authMiddleware,
    sendInvoiceEmail
)



router.post(
    "/invoice/:id/duplicate",
    invoiceDuplicateLimiter,
    authMiddleware,
    duplicateInvoice
)


export default router;