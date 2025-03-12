const Users = require("../models/User");

// Create Order
exports.createOrder = async (req, res) => {
    const user = await Users.findOne({ id: req.user.id });
    const { addressId, paymentMethod, items, totalAmount } = req.body;

    const shippingAddress = user.addresses.find(addr => addr._id.toString() === addressId);

    if (!shippingAddress) {
        return res.status(400).json({ success: false, message: "Shipping address not found" });
    }

    const orderId = 'ORD' + Date.now();

    const order = {
        orderId,
        items,
        totalAmount,
        shippingAddress,
        paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'processing'
    };

    user.orders.push(order);
    user.cartData = {};  // Clear cart after placing order

    await user.save();
    res.json({ success: true, order });
};

// Get Orders
exports.getOrders = async (req, res) => {
    const user = await Users.findOne({ id: req.user.id });
    res.json(user.orders.sort((a, b) => b.orderDate - a.orderDate));
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
    const user = await Users.findOne({ id: req.user.id });
    const { orderId, paymentStatus, orderStatus } = req.body;

    const orderIndex = user.orders.findIndex(order => order.orderId === orderId);

    if (orderIndex === -1) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (paymentStatus) user.orders[orderIndex].paymentStatus = paymentStatus;
    if (orderStatus) user.orders[orderIndex].orderStatus = orderStatus;

    await user.save();
    res.json({ success: true, order: user.orders[orderIndex] });
};
