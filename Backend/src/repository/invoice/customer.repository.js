import Customer from "../../model/invoice/customer.model.js";

class CustomerRepository {

    // Create Customer
    async create(customerData) {
        return await Customer.create(customerData);
    }


    // Get All Customers
    async findAll(userId) {
        return await Customer.find({ userId });
    }


    // Get Customer By ID
    async findById(customerId) {
        return await Customer.findOne({ _id: customerId });
    }


    // Get Customer By Email
    async findByEmail(email) {
        return await Customer.findOne({ email });
    }


    // Check Customer Exists
    async existsById(customerId) {
        return await Customer.exists({ _id: customerId });
    }


    // Update Customer
    async updateById(customerId, updatedData) {
        return await Customer.findOneAndUpdate(
            { _id: customerId },
            updatedData,
            {
                new: true,
                runValidators: true
            }
        );
    }


    // Delete Customer
    async deleteById(customerId) {
        return await Customer.findOneAndDelete({ _id: customerId });
    }

}

export default new CustomerRepository();