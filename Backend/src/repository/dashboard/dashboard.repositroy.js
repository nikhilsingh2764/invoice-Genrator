import mongoose from "mongoose";

import Invoice from "../../model/invoice/invoice.model.js";
import Customer from "../../model/invoice/customer.model.js";
import Product from "../../model/invoice/product.model.js";

class DashboardRepository {

    // ============================================================
    // Dashboard Summary
    //
    // Purpose:
    // Returns all summary cards displayed on the dashboard.
    //
    // Includes:
    // - Total Customers
    // - Total Products
    // - Total Invoices
    // - Paid Invoices
    // - Pending Invoices
    // - Overdue Invoices
    // - Total Revenue
    // - Total Due Amount
    //
    // Used By:
    // Dashboard Cards
    // ============================================================

    async getDashboardStats(userId) {

    // Count total customers of the logged-in user
    const totalCustomers = await Customer.countDocuments({
        userId
    });

    // Count total products of the logged-in user
    const totalProducts = await Product.countDocuments({
        userId
    });

    // Count total invoices
    const totalInvoices = await Invoice.countDocuments({
        userId
    });

    // Count paid invoices
    const paidInvoices = await Invoice.countDocuments({
        userId,
        paymentStatus: "PAID"
    });

    // Count pending invoices
    const pendingInvoices = await Invoice.countDocuments({
        userId,
        paymentStatus: "PENDING"
    });

    // Count overdue invoices
    // Pending invoices whose due date has already passed
    const overdueInvoices = await Invoice.countDocuments({
        userId,
        paymentStatus: "PENDING",
        dueDate: {
            $lt: new Date()
        }
    });

    // Calculate revenue and due amount
    const amount = await Invoice.aggregate([

        // Only invoices of the current user
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId)
            }
        },

        // Calculate totals
        {
            $group: {

                // Group all matching documents together
                _id: null,

                // Sum of all paid invoices
                totalRevenue: {
                    $sum: {
                        $cond: [
                            { $eq: ["$paymentStatus", "PAID"] },
                            "$grandTotal",
                            0
                        ]
                    }
                },

                // Sum of all pending invoices
                totalDueAmount: {
                    $sum: {
                        $cond: [
                            { $eq: ["$paymentStatus", "PENDING"] },
                            "$grandTotal",
                            0
                        ]
                    }
                }

            }
        }

    ]);

    // Return dashboard summary
    return {

        totalCustomers,

        totalProducts,

        totalInvoices,

        paidInvoices,

        pendingInvoices,

        overdueInvoices,

        totalRevenue: amount[0]?.totalRevenue || 0,

        totalDueAmount: amount[0]?.totalDueAmount || 0

    };

}


// ============================================================
// Invoice List
//
// Purpose:
// Returns invoice list with:
//
// - Search
// - Filter
// - Sort
// - Pagination
//
// Used By:
// Dashboard Invoice Table
// ============================================================
async getInvoiceList(userId, options) {

    // Destructure query parameters
    const {
        page = 1,
        limit = 10,
        search = "",
        paymentStatus,
        customerId,
        startDate,
        endDate,
        sortBy = "createdAt",
        sortOrder = "desc"
    } = options;

    // MongoDB filter object
    const filter = {

        // Only logged-in user's invoices
        userId: new mongoose.Types.ObjectId(userId)

    };



    // =====================================================
    // Search
    //
    // Search by:
    // - Invoice Number
    // - Customer Name
    // =====================================================
    if (search) {

        filter.$or = [

            {
                invoiceNumber: {
                    $regex: search,
                    $options: "i"
                }
            },

            {
                "customer.customerName": {
                    $regex: search,
                    $options: "i"
                }
            }

        ];

    }



    // =====================================================
    // Filter by Payment Status
    // Example:
    // PAID
    // PENDING
    // OVERDUE
    // =====================================================
    if (paymentStatus) {

        filter.paymentStatus = paymentStatus;

    }



    // =====================================================
    // Filter by Customer
    // =====================================================
    if (customerId) {

        filter.customerId =
            new mongoose.Types.ObjectId(customerId);

    }



    // =====================================================
    // Filter by Date Range
    // =====================================================
    if (startDate || endDate) {

        filter.createdAt = {};

        if (startDate) {

            filter.createdAt.$gte =
                new Date(startDate);

        }

        if (endDate) {

            filter.createdAt.$lte =
                new Date(endDate);

        }

    }



    // =====================================================
    // Sorting
    // =====================================================
    const sort = {

        [sortBy]:
            sortOrder === "asc" ? 1 : -1

    };



    // =====================================================
    // Pagination
    // =====================================================
    const skip =
        (Number(page) - 1) * Number(limit);



    // Fetch invoices
    const invoices = await Invoice
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit));



    // Count total matching invoices
    const totalInvoices =
        await Invoice.countDocuments(filter);



    // Return response
    return {

        invoices,

        pagination: {

            totalInvoices,

            currentPage: Number(page),

            totalPages: Math.ceil(
                totalInvoices / Number(limit)
            ),

            limit: Number(limit)

        }

    };

}


// ============================================================
// Revenue Chart
//
// Purpose:
// Returns monthly revenue.
//
// Used By:
// Line Chart
// Bar Chart
// ============================================================
async getRevenueChart(userId) {

    // Aggregate monthly revenue
    const revenue = await Invoice.aggregate([

        // Get invoices of logged-in user
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                paymentStatus: "PAID"
            }
        },

        // Group invoices by month
        {
            $group: {

                // Group by year and month
                _id: {
                    year: {
                        $year: "$createdAt"
                    },
                    month: {
                        $month: "$createdAt"
                    }
                },

                // Calculate monthly revenue
                totalRevenue: {
                    $sum: "$grandTotal"
                },

                // Count invoices in that month
                totalInvoices: {
                    $sum: 1
                }

            }
        },

        // Sort months in ascending order
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        }

    ]);

    return revenue;

}



// ============================================================
// Invoice Status Chart
//
// Purpose:
// Returns invoice count by payment status.
//
// Used By:
// Pie Chart
// Doughnut Chart
// ============================================================
async getInvoiceStatusChart(userId) {

    // Aggregate invoice status counts
    const invoiceStatus = await Invoice.aggregate([

        // Only logged-in user's invoices
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId)
            }
        },

        // Group invoices by payment status
        {
            $group: {

                // Group by payment status
                _id: "$paymentStatus",

                // Count invoices
                totalInvoices: {
                    $sum: 1
                }

            }
        },

        // Sort alphabetically (optional)
        {
            $sort: {
                _id: 1
            }
        }

    ]);

    return invoiceStatus;

}



 // ============================================================
// Top Customers
//
// Purpose:
// Returns customers who generated the highest revenue.
//
// Used By:
// Dashboard
// Top Customers Card
// ============================================================
async getTopCustomers(userId) {

    // Aggregate customer revenue
    const topCustomers = await Invoice.aggregate([

        // Get invoices of logged-in user
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                paymentStatus: "PAID"
            }
        },

        // Group invoices by customer
        {
            $group: {

                // Group by customer id
                _id: "$customerId",

                // Customer name
                customerName: {
                    $first: "$customer.customerName"
                },

                // Customer email
                customerEmail: {
                    $first: "$customer.email"
                },

                // Total invoices of customer
                totalInvoices: {
                    $sum: 1
                },

                // Total revenue generated by customer
                totalRevenue: {
                    $sum: "$grandTotal"
                }

            }
        },

        // Highest revenue first
        {
            $sort: {
                totalRevenue: -1
            }
        },

        // Return only top 5 customers
        {
            $limit: 5
        }

    ]);

    return topCustomers;

}


// ============================================================
// Top Products
//
// Purpose:
// Returns the most sold products.
//
// Used By:
// Dashboard
// Top Products Card
// ============================================================
async getTopProducts(userId) {

    // Aggregate top selling products
    const topProducts = await Invoice.aggregate([

        // Get invoices of logged-in user
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                paymentStatus: "PAID"
            }
        },

        // Convert items array into separate documents
        {
            $unwind: "$items"
        },

        // Group by product
        {
            $group: {

                // Group by product id
                _id: "$items.productId",

                // Product name
                productName: {
                    $first: "$items.productName"
                },

                // Total quantity sold
                totalQuantitySold: {
                    $sum: "$items.quantity"
                },

                // Total revenue generated
                totalRevenue: {
                    $sum: "$items.total"
                }

            }
        },

        // Highest revenue first
        {
            $sort: {
                totalRevenue: -1
            }
        },

        // Return only top 5 products
        {
            $limit: 5
        }

    ]);

    return topProducts;

}


 
// ============================================================
// Recent Invoices
//
// Purpose:
// Returns the latest invoices.
//
// Used By:
// Dashboard
// Recent Invoices Table
// ============================================================
async getRecentInvoices(userId) {

    // Fetch latest 5 invoices
    const recentInvoices = await Invoice.find({

        // Only logged-in user's invoices
        userId

    })

    // Latest first
    .sort({
        createdAt: -1
    })

    // Return only 5 invoices
    .limit(5)

    // Return required fields only
    .select(
        "invoiceNumber customer.customerName grandTotal paymentStatus dueDate createdAt"
    );

    return recentInvoices;

}




}

export default new DashboardRepository();