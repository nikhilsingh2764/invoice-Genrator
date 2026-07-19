import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

import businessRepository from "../repository/business.repository.js";



export const createBusinessService = async ({ businessData, userId }) => {


    const existedBusiness = await businessRepository.existsByUserId(userId);

    if (existedBusiness) {
        throw new ApiError(409, "Business profile already exists.")
    }

    businessData.userId = userId; //add userId to the businessData

    const BusinessProfile = await businessRepository.create(businessData);


    if (!BusinessProfile) {
        throw new ApiError(500, "Failed to create business profile.")
    }

    return BusinessProfile;


};



export const getBusinessProfileService = async (userId) => {

    console.log("User ID:", userId);
    console.log("Controller reached");

    const existedBusiness = await businessRepository.existsByUserId(userId);

    if (!existedBusiness) {
        throw new ApiError(409, "Business profile not exists.")
    }

    const businessProfile = await businessRepository.findByUserId(userId);


    console.log("businessProfile :", businessProfile);


    if (!businessProfile) {
        throw new ApiError(409, "Business profile not fetch.")
    }


    return businessProfile;

}

//if want {newBusinessData, userId} {} in service first wrap contoller, service call in controller like this updateBusinessProfileService({newBusinessData, userId});

export const updateBusinessProfileService = async ({newBusinessData, userId}) => {

        console.log("userId:", userId);
    console.log("newBusinessData:", newBusinessData);
    const accountExist = await businessRepository.existsByUserId(userId);

    if (!accountExist) {
        throw new ApiError(409, "Account not exist")
    }

    const updatedData = await businessRepository.updateByUserId(userId, newBusinessData);

    if (!updatedData) {
        throw new ApiError(409, "Account not update successfully")
    }


    return updatedData;

}


export const deleteBusinessProfileService = async (userId) => {

    const accountExist = await businessRepository.existsByUserId(userId);

    if (!accountExist) {
        throw new ApiError(409, "Account not exist")
    }

    await businessRepository.deleteByUserId(userId);

    return null;

}