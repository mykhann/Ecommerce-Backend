import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const CreateProduct = asyncHandler(async (req, res) => {
    const { title, description, stock, price, category } = req.body;
    if (!title || !description || !stock || !price || !category) {
        throw new ApiError(201, "please enter all fields")
    }

    const ImageLocalPath = req.files?.productImage?.[0]?.path
    console.log(`ImageLocalPath: ${ImageLocalPath}`)
    if (!ImageLocalPath) {
        throw new ApiError(201, "Please enter an image path");
    }
    const productImage = await uploadOnCloudinary(ImageLocalPath)
    const product = await Product.create({
        title,
        description,
        stock,
        price,
        category,
        productImage: productImage.url
    })
    res.status(200).json({ message: "Product created successfully", product })
})

const DeleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!id) {
        throw new ApiError(201, "Provide id to delete the product")
    }
    const product = await Product.findByIdAndDelete(id)
    if (!product) {
        throw new ApiError(201, "Product not found")
    }
    res.status(200).json({ message: "Product deleted successfully", product })
})

const GetProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!id) {
        throw new ApiError(201, "please provide id")
    }
    const product = await Product.findById(id)
    if (!product) {
        throw new ApiError(201, "Product not found")
    }
    res.status(200).json({ message: "Product found successfully", product })

})

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    console.log(updates)
    if (!id) {
        throw new ApiError(201, "Provide Id");
    }
    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError(201, "Product not found");
    }
    Object.assign(product, updates);
    const savedProduct = await product.save();
    res.status(200).json({
        message: "updated product successfully",
        savedProduct
    })
})
export {
    CreateProduct,
    DeleteProduct,
    GetProduct,
    updateProduct
}