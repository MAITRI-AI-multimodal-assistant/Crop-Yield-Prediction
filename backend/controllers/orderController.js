import Order from "../models/orderModel.js";

// ✅ CREATE ORDER AFTER PAYMENT
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, paymentId } = req.body;

    const order = await Order.create({
      userId: req.user?.id, // if auth middleware used
      items,
      totalAmount,
      paymentId,
      status: "paid",
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET USER ORDERS
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};