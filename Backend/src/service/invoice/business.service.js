import ApiError from "../../utils/ApiError.js";
import businessRepository from "../../repository/invoice/business.repository.js";

import redis from "../../config/redis.js";



export const createBusinessService = async ({ businessData, userId }) => {

    const cacheKey = `business:${userId}`;

    let business = await redis.get(cacheKey);

    if (business) {
        return JSON.parse(business);
    }

    //check business exist or not
    const existedBusiness = await businessRepository.existsByUserId(userId);

    if (existedBusiness) {
        throw new ApiError(409, "Business profile already exists.")
    }

    businessData.userId = userId; //add userId to the businessData

    //store businessData in db
    const BusinessProfile = await businessRepository.create(businessData);


    if (!BusinessProfile) {
        throw new ApiError(500, "Failed to create business profile.")
    }

    await redis.set(
        cacheKey,
        JSON.stringify(BusinessProfile),
        "EX",
        600
    );


    return BusinessProfile;


};



export const getBusinessProfileService = async (userId) => {

    const cacheKey = `business:${userId}`;


    //check redis
    const cachedBusiness = await redis.get(cacheKey);

    if (cachedBusiness) {
        console.log("Business from Redis");
        return JSON.parse(cachedBusiness);
    }


    const existedBusiness = await businessRepository.existsByUserId(userId);

    if (!existedBusiness) {
        throw new ApiError(409, "Business profile not exists.")
    }

    const businessProfile = await businessRepository.findByUserId(userId);


    console.log("businessProfile :", businessProfile);


    if (!businessProfile) {
        throw new ApiError(409, "Business profile not fetch.")
    }

    //set redis
    await redis.set(
        cacheKey,
        JSON.stringify(businessProfile),
        'EX',
        600
    )

    return businessProfile;

}




//if want {newBusinessData, userId} {} in service first wrap contoller, service call in controller like this updateBusinessProfileService({newBusinessData, userId});
export const updateBusinessProfileService = async ({ newBusinessData, userId }) => {

    //check exist or not
    const accountExist = await businessRepository.existsByUserId(userId);

    if (!accountExist) {
        throw new ApiError(409, "Account not exist")
    }

    const updatedData = await businessRepository.updateByUserId(userId, newBusinessData);

    if (!updatedData) {
        throw new ApiError(409, "Account not update successfully")
    }

    //remove old redis 

    await redis.del(`business:${userId}`);

    //store updated business profile

    await redis.set(
        `business:${userId}`,
        JSON.stringify(updatedData),
        "EX",
        600
    );

    return updatedData;

}




export const deleteBusinessProfileService = async (userId) => {

    const accountExist = await businessRepository.existsByUserId(userId);

    if (!accountExist) {
        throw new ApiError(409, "Account not exist")
    }

    await businessRepository.deleteByUserId(userId);

    await redis.del(`business:${userId}`);

    return null;

}