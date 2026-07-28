import Invoice from "../../model/invoice/invoice.model.js";
import Customer from "../../model/invoice/customer.model.js"
import Product from "../../model/invoice/product.model.js";

class DashboardRepository {

    /// Dashboard Summary Cards
    // Returns: Total Customers
    //          Total Products
    //          Total Invoices
    //          Paid Invoices
    //          Pending Invoices
    //          Overdue Invoices
    //          Total Revenue
    //          Total Due Amount

    async getDashboardStats(userId) {

    }


    // Invoice Table
    // Supports: Search,  Filter, Sort, Pagination


    // Example: ?page=1
    //          &limit=10
    //          &search=john
    //          &status=PAID
    //          &sortBy=createdAt
    //          &sortOrder=desc
    async getInvoiceList(userId, options) {

    }


    // Revenue Chart

    // Monthly Revenue
    // Jan   ₹20,000
    // Feb   ₹15,000
    // Mar   ₹45,000
    // ============================================
    async getRevenueChart(userId) {

    }


    // Top Customers
    // Returns customers having  highest total invoice amount.
    // Limit: Top 5
    async getTopCustomers(userId) {

    }

    // Top Products
    // Returns most sold products/items.
    // Limit:  Top 5
    async getTopProducts(userId) {

    }

}

export default new DashboardRepository();