const Users = require("../models/User");

// Add to Cart
exports.addToCart = async (req, res) => {
    const userData = await Users.findOne({ id: req.user.id });

    if (!userData.cartData[req.body.itemId]) {
        userData.cartData[req.body.itemId] = 0;
    }

    userData.cartData[req.body.itemId] += 1;

    await Users.findOneAndUpdate({ id: req.user.id }, { cartData: userData.cartData });
    res.json({ success: true, message: "Item added to cart successfully" });
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
    const userData = await Users.findOne({ id: req.user.id });

    if (userData.cartData[req.body.itemId] > 0) {
        userData.cartData[req.body.itemId] -= 1;
    }

    await Users.findOneAndUpdate({ id: req.user.id }, { cartData: userData.cartData });
    res.json({ success: true, message: "Item removed from cart successfully" });
};

// Get Cart
exports.getCart = async (req, res) => {
    const userData = await Users.findOne({ id: req.user.id });

    if (!userData) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json(userData.cartData || {});
};
