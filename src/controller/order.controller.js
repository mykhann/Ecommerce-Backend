import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";


const createOrder = asyncHandler(async (req, res) => {
    try {
        const { shippingAddress, orderItems } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(401, "user  not found");
        }

        let totalAmount = 0;
        const items = [];

        for (const item of orderItems) {
            const product = await Product.findById(item.productId);
            if (!product) {
                throw new ApiError(401, "product not found");
            }
            items.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price * item.quantity
            })
            totalAmount += product.price * item.quantity;

        }
        const order = await Order.create({
            user: user._id,
            items,
            totalAmount,
            shippingAddress
        })
        await order.save()
        res.json(order)
    } catch (error) {
        console.error(error);
    }


})

const getOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id
    if (!id) {
        throw new ApiError(404, "please enter a valid order id")
    }
    const order = await Order.findById(id)
    if (!order) {
        throw new ApiError(404, "order not found")
    }
    if (order.user.toString() !== userId.toString()) {
        throw new ApiError(404, "access denied")
    }
    res.status(200).json(order)

})

const getallOrders = asyncHandler(async (req, res) => {
    const userId = req.user._id
    if (!userId) {
        throw new ApiError(404, "no orders for your account")
    }

    const orders = await Order.find({ user: userId })
    if (!orders.length) throw new ApiError(404, "order not found")
    res.status(200).json({ message: "orders found", orders })
})

const updateorder = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const { id } = req.params
    if (!id) {
        throw new ApiError(404, "order not found");

    }
    const order = await Order.findById(id)
    if (!order) {
        throw new ApiError(404, "order not found");
    }
    if (order.user.toString() !== userId.toString()) {
        throw new ApiError(404, "access denied");

    }

    const updates = req.body
    Object.assign(order, updates)
    await order.save()
    res.status(200).json({ message: "success", order })



})
const deletorder = asyncHandler(async (req, res) => {
    const { id } = req.params
    const userId = req.user._id
    if (!id) {
        throw new ApiError(404, "please enter id")
    }

    const order = await Order.findById(id)
    if (!order) { throw new ApiError(303, "no order found") }
    if (order.user.toString() !== userId.toString()) {
        throw new ApiError(404, "access denied")
    }
    await order.deleteOne({id});
    res.status(200).json({ message: "order deleted successfully" })
})

export {
    createOrder,
    getOrder,
    getallOrders,
    updateorder,
    deletorder
}