import TryCatch from "../../middleware/TryCatch.js";
import ApiResponse from "../../utils/ApiResponse.js";

import { createBusinessService, getBusinessProfileService, updateBusinessProfileService, deleteBusinessProfileService } from "../../service/invoice/business.service.js";



export const createBusiness = TryCatch(async (req, res) => {

    const userId = req.user._id;

    const business = await createBusinessService({ userId, businessData: req.body });

    return res.status(200).json(
        new ApiResponse(200, "Business profile created successfully", business)
    )


});


export const getBusinessProfile = TryCatch(async (req, res) => {

    const userId = req.user._id;

    console.log("User ID:", userId);

    const business = await getBusinessProfileService(userId);


    return res.status(200).json(
        new ApiResponse(200, "Business profile fetch successfully", business)
    )


});



export const updateBusiness = TryCatch(async (req, res) => {
    
    const userId = req.user._id;

    const newBusinessData = req.body;

    const updatedBusiness = await updateBusinessProfileService({newBusinessData, userId});

    return res.status(200).json(
        new ApiResponse(200, "Business profile update successfully", updatedBusiness)
    )

});



export const deleteBusiness = TryCatch(async (req, res) => {

    const userId = req.user._id;

    await deleteBusinessProfileService(userId);

    return res.status(200).json(
        new ApiResponse(200, "Business profile deleted successfully", null)
    )


});

