const express = require("express");
const { getAllProducts, addProduct, editProduct, removeProduct } = require("../controllers/productController");

const router = express.Router();

router.get('/allproducts', getAllProducts);
router.post('/addproduct', addProduct);
router.post('/editproduct', editProduct);
router.post('/removeproduct', removeProduct);

module.exports = router;
