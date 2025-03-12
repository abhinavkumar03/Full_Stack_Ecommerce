const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
require('dotenv').config(); 

// Environment variables
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/e-commerce";
const JWT_SECRET = process.env.JWT_SECRET || "secret_ecom";

app.use(express.json());
app.use(cors());

// Database Connection With MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Image Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload/images');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product_' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Serve static files from upload directory
app.use('/images', express.static(path.join(__dirname, 'upload/images')));

// Image upload endpoint
app.post('/upload', upload.single('product'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    res.json({
      success: true,
      image_url: `/images/${req.file.filename}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error uploading file",
      error: error.message
    });
  }
});

// Error handling for multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB'
      });
    }
  }
  next(error);
});

// MiddleWare to fetch user from token
const fetchuser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
};

// Schema for creating user model
const Users = mongoose.model("Users", {
  id: { type: Number, required: true },
  name: { type: String, required: true }, 
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  cartData: { type: Object, default: {} },
  addresses: [{
    name: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    phone: String,
    isDefault: { type: Boolean, default: false }
  }],
  orders: [{
    orderId: String,
    items: [{
      productId: Number,
      quantity: Number,
      price: Number,
      name: String,
      image: String
    }],
    totalAmount: Number,
    shippingAddress: {
      name: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
      phone: String
    },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    orderStatus: { type: String, enum: ['processing', 'shipped', 'delivered', 'cancelled'], default: 'processing' },
    paymentMethod: String,
    orderDate: { type: Date, default: Date.now }
  }],
  date: { type: Date, default: Date.now },
});

// Schema for creating Product
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number },
  old_price: { type: Number },
  keywords: { type: [String], default: [] },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

// ROOT API Route For Testing
app.get("/", (req, res) => {
  res.send("Root");
});

// Create an endpoint at ip/login for login the user and giving auth-token
app.post('/login', async (req, res) => {
  console.log("Login");
  let success = false;
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
          role: user.role
        }
      }
      success = true;
      console.log(user.id);
      const token = jwt.sign(data, JWT_SECRET);
      res.json({ success, token, role: user.role });
    }
    else {
      return res.status(400).json({ success: success, errors: "please try with correct email/password" })
    }
  }
  else {
    return res.status(400).json({ success: success, errors: "please try with correct email/password" })
  }
})

//Create an endpoint at ip/auth for regestring the user & sending auth-token
app.post('/signup', async (req, res) => {
  console.log("Sign Up");
  let success = false;
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success: success, errors: "existing user found with this email" });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role || 'user',
    cartData: cart,
  });
  await user.save();
  const data = {
    user: {
      id: user.id,
      role: user.role
    }
  }

  const token = jwt.sign(data, JWT_SECRET);
  success = true;
  res.json({ success, token, role: user.role })
})

// endpoint for getting all users data
app.get("/allusers", async (req, res) => {
  try {
    let users = await Users.find({}, '-password');
    console.log("All Users");
    res.json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
});

// Create an endpoint for adding users
app.post("/adduser", async (req, res) => {
  try {
    // Check if email already exists
    const existingUser = await Users.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "Email already exists" 
      });
    }

    // Find the highest ID currently in use
    const highestUser = await Users.findOne().sort('-id');
    const nextId = highestUser?.id ? highestUser.id + 1 : 1;
    console.log("Next ID:", nextId);

    // Initialize empty cart data
    let cartData = {};
    for (let i = 0; i < 300; i++) {
      cartData[i] = 0;
    }

    const user = new Users({
      id: nextId,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || 'user',
      cartData: cartData,
    });

    await user.save();
    console.log("User saved successfully with ID:", nextId);
    const userResponse = { ...user.toObject() };
    delete userResponse.password;
    res.json({ success: true, user: userResponse });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(400).json({ 
      success: false, 
      message: error.code === 11000 ? 
        "Email already exists" : 
        "Error creating user"
    });
  }
});

// Create an endpoint for editing users
app.post("/edituser", async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
    };

    // Only include password in update if it's provided
    if (req.body.password) {
      updateData.password = req.body.password;
    }

    const user = await Users.findOneAndUpdate(
      { id: req.body.id },
      updateData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userResponse = { ...user.toObject() };
    delete userResponse.password;
    
    console.log("User updated successfully");
    res.json({ success: true, user: userResponse });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).json({ 
      success: false, 
      message: error.code === 11000 ? 
        "Email already exists" : 
        "Error updating user"
    });
  }
});

// Create an endpoint for removing users
app.post("/removeuser", async (req, res) => {
  try {
    const user = await Users.findOneAndDelete({ id: req.body.id });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    console.log("User removed successfully");
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error removing user:", error);
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
});

// endpoint for getting all products data
app.get("/allproducts", async (req, res) => {
  const category = req.query.category; 
  if (category) products = await Product.find({ category: category });
  else products = await Product.find({});
  
  console.log("Fetched Products for Category:", category || "All Categories");
  res.send(products);
});

// endpoint for getting latest products data
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let arr = products.slice(0).slice(-8);
  console.log("New Collections");
  res.send(arr);
});

// endpoint for getting womens products data
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let arr = products.splice(0, 4);
  console.log("Popular In Women");
  res.send(arr);
});

// endpoint for getting related products data
app.post("/relatedproducts", async (req, res) => {
  console.log("Related Products");
  const {category} = req.body;
  const products = await Product.find({ category });
  const arr = products.slice(0, 4);
  res.send(arr);
});

// Create an endpoint for saving the product in cart
app.post('/addtocart', fetchuser, async (req, res) => {
  console.log("Add Cart");
  let userData = await Users.findOne({ id: req.user.id });
  if (!userData.cartData[req.body.itemId]) {
    userData.cartData[req.body.itemId] = 0;
  }
  
  // Increment the item count
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate({ id: req.user.id }, { cartData: userData.cartData });
  res.send("Added")
})

// Create an endpoint for removing the product in cart
app.post('/removefromcart', fetchuser, async (req, res) => {
  console.log("Remove Cart");
  let userData = await Users.findOne({ id: req.user.id });
  if (userData.cartData[req.body.itemId] != 0) {
    userData.cartData[req.body.itemId] -= 1;
  }
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Removed");
})

app.post('/getcart', async (req, res) => {
  try {
    const token = req.headers['auth-token'];
    
    if (!token) {
      alert("Please Login");
      window.location.href = '/login';
    }
    
    const decodedToken = jwt.verify(token, JWT_SECRET).user;
    const userId = decodedToken.id;
    
    const userData = await Users.findOne({ id: userId });
    if (!userData) return res.status(404).json({ error: 'User not found' });
    
    res.json(userData.cartData || []);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// Create an endpoint for adding products using admin panel
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  }
  else { id = 1; }
  const product = new Product({
    id: id,
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  await product.save();
  console.log("Saved");
  res.json({ success: true, name: req.body.name })
});

app.post("/updateproduct", async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: req.body.id },
      {
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    console.log("Product updated successfully");
    res.json({ success: true, product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error updating product" 
    });
  }
});

// Create an endpoint for removing products using admin panel
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({ success: true, name: req.body.name })
});

// Search products endpoint
app.get("/searchproducts", async (req, res) => {
  try {
    const { query } = req.query;
    const searchRegex = new RegExp(query, 'i');
    
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { keywords: searchRegex }
      ]
    });
    
    res.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ success: false, message: "Error searching products" });
  }
});

// Get user profile
app.get('/profile', fetchuser, async (req, res) => {
  try {
    const user = await Users.findOne({ id: req.user.id }, '-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching profile" });
  }
});

// Update user profile
app.post('/profile/update', fetchuser, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await Users.findOneAndUpdate(
      { id: req.user.id },
      { name, email },
      { new: true }
    ).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
});

// Add/Update address
app.post('/address', fetchuser, async (req, res) => {
  try {
    const user = await Users.findOne({ id: req.user.id });
    const { addressId, ...addressData } = req.body;

    if (addressId) {
      // Update existing address
      const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
      if (addressIndex > -1) {
        user.addresses[addressIndex] = { ...user.addresses[addressIndex], ...addressData };
      }
    } else {
      // Add new address
      if (addressData.isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
      }
      user.addresses.push(addressData);
    }

    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error managing address" });
  }
});

// Delete address
app.delete('/address/:id', fetchuser, async (req, res) => {
  try {
    const user = await Users.findOne({ id: req.user.id });
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting address" });
  }
});

// Create order
app.post('/order/create', fetchuser, async (req, res) => {
  try {
    const user = await Users.findOne({ id: req.user.id });
    const { addressId, paymentMethod, items, totalAmount } = req.body;

    // Find selected address
    const shippingAddress = user.addresses.find(addr => addr._id.toString() === addressId);
    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: "Shipping address not found" });
    }

    // Create order
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
    // Clear cart after order
    user.cartData = {};
    
    await user.save();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating order" });
  }
});

// Get user orders
app.get('/orders', fetchuser, async (req, res) => {
  try {
    const user = await Users.findOne({ id: req.user.id });
    res.json(user.orders.sort((a, b) => b.orderDate - a.orderDate));
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
});

// Update order status (for testing)
app.post('/order/update-status', fetchuser, async (req, res) => {
  try {
    const { orderId, paymentStatus, orderStatus } = req.body;
    const user = await Users.findOne({ id: req.user.id });
    
    const orderIndex = user.orders.findIndex(order => order.orderId === orderId);
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (paymentStatus) user.orders[orderIndex].paymentStatus = paymentStatus;
    if (orderStatus) user.orders[orderIndex].orderStatus = orderStatus;

    await user.save();
    res.json({ success: true, order: user.orders[orderIndex] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating order" });
  }
});

// Starting Express Server
app.listen(PORT, (error) => {
  if (!error) console.log("Server Running on port " + PORT);
  else console.log("Error : ", error);
});