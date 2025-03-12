const express = require("express");
const { addToCart, removeFromCart, getCart } = require("../controllers/cartController");
const { fetchUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/add', fetchUser, addToCart);
router.post('/remove', fetchUser, removeFromCart);
router.get('/get', fetchUser, getCart);

module.exports = router;
