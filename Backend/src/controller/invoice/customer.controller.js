
import {
    createCustomerService, getAllCustomersService, getCustomerByIdService,
    updateCustomerService, deleteCustomerService
} from "../../service/customer.service.js";

import ApiResponse from "../../utils/ApiResponse.js";
import TryCatch from "../../middleware/TryCatch.js";



export const createCustomer = TryCatch(async (req, res) => {

    const userId = req.user._id;
    const userData = req.body;

    userData.userId = userId;


    const customer = await createCustomerService(userData);

    console.log(customer)

    res.status(201).json(
        new ApiResponse(201, " customer created Successfully", customer)
    )

});

export const getAllCustomers = TryCatch(async (req, res) => {

    const userId = req.user._id;

    const customers = await getAllCustomersService(userId);

     console.log(customers)

    res.status(200).json(
        new ApiResponse(200, "all customer fetched successfully", customers)
    )



});

export const getCustomerById = TryCatch(async (req, res) => {

    const { id: customerId } = req.params;

    const customer = await getCustomerByIdService(customerId);

     console.log(customer)

    res.status(200).json(
        new ApiResponse(200, "customer fetched successfully", customer)
    )

});

export const updateCustomer = TryCatch(async (req, res) => {

    const { id: customerId } = req.params;

    const updatedData = req.body;

    const updatedCustomer = await updateCustomerService(customerId, updatedData);

     console.log(updatedCustomer)

    res.status(200).json(
        new ApiResponse(200, "customer updated successfully", updatedCustomer)
    )

});

export const deleteCustomer = TryCatch(async (req, res) => {

    const { id: customerId } = req.params;

    await deleteCustomerService(customerId);

    res.status(200).json(
        new ApiResponse(200, "customer deleted successfully", null)
    )


});



