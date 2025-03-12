const Product = require("../models/Product");

// Get All Products
exports.getAllProducts = async (req, res) => {
    const category = req.query.category;
    const products = category 
        ? await Product.find({ category })
        : await Product.find({});

    res.json(products);
};

// Add Product
exports.addProduct = async (req, res) => {
    const products = await Product.find({});
    const nextId = products.length > 0 
        ? products.slice(-1)[0].id + 1 
        : 1;

    const product = new Product({
        id: nextId,
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });

    await product.save();
    res.json({ success: true, name: req.body.name });
};

// Edit Product
exports.editProduct = async (req, res) => {
    const product = await Product.findOneAndUpdate(
        { id: req.body.id },
        req.body,
        { new: true }
    );

    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
};

// Remove Product
exports.removeProduct = async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    res.json({ success: true, message: "Product removed successfully" });
};
