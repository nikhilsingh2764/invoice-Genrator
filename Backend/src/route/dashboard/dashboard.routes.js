import express from "express";

import authMiddleware from "../../middleware/auth.middleware.js";

import { getDashboard } from "../../controller/dashboard/dashboard.controller.js";

const router = express.Router();

// ============================================================
// Dashboard
//
// GET /api/v1/dashboard
//
// Returns:
// - Dashboard Summary
// - Invoice List
// - Revenue Chart
// - Invoice Status Chart
// - Top Customers
// - Top Products
// - Recent Invoices
// ============================================================
router.get(
    "/",
    authMiddleware,
    getDashboard
);

export default router;