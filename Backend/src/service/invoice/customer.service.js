import ApiError from "../../utils/ApiError.js"
import customerRepository from "../../repository/invoice/customer.repository.js"





export const createCustomerService = async (userData) => {

    const customer = await customerRepository.create(userData);

    if (!customer) {
        throw new ApiError(500, "customer not created successfully")
    }

    return customer

}

export const getAllCustomersService = async (userId) => {

    const customers = await customerRepository.findAll(userId);

    return customers

}

export const getCustomerByIdService = async (customerId) => {

    const customer = await customerRepository.findById(customerId);

    if (!customer) {
        throw new ApiError(404, "Customer not found")
    }

    return customer;

}

export const updateCustomerService = async (customerId, updateData) => {

    const existedCustomer = await customerRepository.existsById(customerId);

    if (!existedCustomer) {
        throw new ApiError(404, "customer not exist")

    }

    const updatedCustomer = await customerRepository.updateById(customerId, updateData);

    if (!updatedCustomer) {
        throw new ApiError(500, "customer not update successfully")
    }

    return updatedCustomer;

}

export const deleteCustomerService = async (customerId) => {

    const existedCustomer = await customerRepository.existsById(customerId);

    if (!existedCustomer) {
        throw new ApiError(404, "customer not exist")

    }

    await customerRepository.deleteById(customerId);


    return null;

}
