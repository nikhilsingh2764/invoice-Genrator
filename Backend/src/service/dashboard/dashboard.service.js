import redis from "../../config/redis.js";
import dashboardRepository from "../../repository/dashboard/dashboard.repositroy.js"

export const getDashboardService = async (userId, options) => {

    // Redis cache key
    const cacheKey =`dashboard:${userId}:${JSON.stringify(options)}`;

    // Check Redis
    const cachedDashboard = await redis.get(cacheKey);

    if (cachedDashboard) {
        return JSON.parse(cachedDashboard);
    }

    // Fetch all dashboard data
    const [
        stats,
        invoices,
        revenueChart,
        invoiceStatusChart,
        topCustomers,
        topProducts,
        recentInvoices
    ] = await Promise.all([

        dashboardRepository.getDashboardStats(userId),

        dashboardRepository.getInvoiceList( userId,options),

        dashboardRepository.getRevenueChart(userId),

        dashboardRepository.getInvoiceStatusChart(userId),

        dashboardRepository.getTopCustomers(userId),

        dashboardRepository.getTopProducts(userId),

        dashboardRepository.getRecentInvoices(userId)

    ]);

    // Final response
    const dashboard = {

        stats,

        invoices,

        revenueChart,

        invoiceStatusChart,

        topCustomers,

        topProducts,

        recentInvoices

    };

    // Store in Redis
    await redis.set(
        cacheKey,
        JSON.stringify(dashboard),
        "EX",
        600
    );

    return dashboard;

};