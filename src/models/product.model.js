import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: [0, 'Stock cannot be less than zero'],
        default: 0
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    productImage: [{
        type: String,
        required: true
    }],
        
   

}, { timestamps: true })

export const Product = mongoose.model("Product", productSchema);