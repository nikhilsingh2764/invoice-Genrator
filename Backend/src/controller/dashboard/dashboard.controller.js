import TryCatch from "../../middleware/TryCatch.js";
import ApiResponse from "../../utils/ApiResponse.js";

import { getDashboardService } from "../../service/dashboard/dashboard.service.js";

export const getDashboard = TryCatch(async (req, res) => {

    const userId = req.user._id;

    // Query parameters
    const options = {

        page: req.query.page,

        limit: req.query.limit,

        search: req.query.search,

        paymentStatus: req.query.paymentStatus,

        customerId: req.query.customerId,

        startDate: req.query.startDate,

        endDate: req.query.endDate,

        sortBy: req.query.sortBy,

        sortOrder: req.query.sortOrder

    };

    // Get dashboard data
    const dashboard = await getDashboardService(
        userId,
        options
    );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Dashboard fetched successfully",

            dashboard

        )

    );

});