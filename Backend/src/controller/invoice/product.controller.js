import ApiResponse from "../../utils/ApiResponse.js";
import TryCatch from "../../middleware/TryCatch.js";

import {
    createProductService,
    getAllProductsService,
    getProductByIdService,
    updateProductService,
    deleteProductService
} from "../../service/product.service.js";



// Create Product
export const createProduct = TryCatch(async (req, res) => {

    const userId = req.user._id;
    const productData = req.body;

    productData.userId  = userId;

    const product = await createProductService(productData);
  
    console.log(product)
    return res.status(201).json(
        new ApiResponse(
            201,
            "Product created successfully",
            product
        )
    );

});



// Get All Products
export const getAllProducts = TryCatch(async (req, res) => {

    const userId = req.user._id;

    const products = await getAllProductsService(userId);

    console.log(products)
    return res.status(200).json(
        new ApiResponse(
            200,
            "All products fetched successfully",
            products
        )
    );

});



// Get Product By ID
export const getProductById = TryCatch(async (req, res) => {

    const { id: productId } = req.params;

    const product = await getProductByIdService(productId);
    console.log(product)

    return res.status(200).json(
        new ApiResponse(
            200,
            "Product fetched successfully",
            product
        )
    );

});



// Update Product
export const updateProduct = TryCatch(async (req, res) => {

    const { id: productId } = req.params;
    const updateData = req.body;

    const updatedProduct = await updateProductService(
        productId,
        updateData
    );

        console.log(updatedProduct)


    return res.status(200).json(
        new ApiResponse(
            200,
            "Product updated successfully",
            updatedProduct
        )
    );

});



// Delete Product
export const deleteProduct = TryCatch(async (req, res) => {

    const { id: productId } = req.params;

    await deleteProductService(productId);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Product deleted successfully",
            null
        )
    );

});