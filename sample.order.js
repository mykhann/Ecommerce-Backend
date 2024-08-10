// controllers/orderController.js
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');

const createOrder = async (req, res, next) => {
  try {
    // Use the user ID from the authenticated user
    const userId = req.user._id;
    const { orderItems, shippingAddress } = req.body;

    // Validate user (though this may be redundant if you're sure req.user is valid)
    const user = await User.findById(userId);
    if (!user) {
      return next(new ApiError('User not found', 404));
    }

    // Validate order items and calculate total amount
    let totalAmount = 0;
    const items = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return next(new ApiError(`Product not found: ${item.productId}`, 404));
      }
      items.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price * item.quantity
      });
      totalAmount += product.price * item.quantity;
    }

    // Create new order
    const order = new Order({
      user: user._id,
      items: items,
      totalAmount: totalAmount,
      shippingAddress: shippingAddress
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    next(new ApiError('Internal server error', 500));
  }
};

module.exports = { createOrder };
