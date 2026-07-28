import Product from "../../model/invoice/product.model.js";

class ProductRepository {

    // Create Product
    async create(productData) {
        return await Product.create(productData);
    }


    // Get All Products
    async findAll(userId) {
        return await Product.find({ userId });
    }


    // Get Product By ID
    async findById(productId) {
        return await Product.findOne({ _id: productId });
    }


    // Get Product By Name
    async findByName(productName) {
        return await Product.findOne({ productName });
    }


    // Check Product Exists
    async existsById(productId) {
        return await Product.exists({ _id: productId });
    }


    // Update Product
    async updateById(productId, updatedData) {
        return await Product.findOneAndUpdate(
            { _id: productId },
            updatedData,
            {
                new: true,
                runValidators: true
            }
        );
    }


    // Delete Product
    async deleteById(productId) {
        return await Product.findOneAndDelete({ _id: productId });
    }

}

export default new ProductRepository();