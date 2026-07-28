import ApiError from "../../utils/ApiError.js"
import productRepository from "../../repository/invoice/product.repository.js"



export const createProductService = async (productData) => {

    const product = await productRepository.create(productData);

    if (!product) {
        throw new ApiError(500, "product not created successfully")
    }

    return product;

}

export const getAllProductsService = async (userId) => {

    const products = await productRepository.findAll(userId);

    return products;

}


export const getProductByIdService = async (productId) => {

    const product = await productRepository.findById(productId);

    if (!product) {
        throw new ApiError(500, "product not found")
    }

    return product;

}

export const updateProductService = async (productId, updateData) => {

    const productExist = await productRepository.existsById(productId);

    if (!productExist) {
        throw new ApiError(404, "product not found!")

    }

    const updateProduct = await productRepository.updateById(productId, updateData);

    if (!updateProduct) {
        throw new ApiError(500, "product not updated successfully")
    }

    return updateProduct;


}

export const deleteProductService = async (productId) => {


    const productExist = await productRepository.existsById(productId);

    if (!productExist) {
        throw new ApiError(404, "product not found!")

    }


    await productRepository.deleteById(productId);

    return null;
}