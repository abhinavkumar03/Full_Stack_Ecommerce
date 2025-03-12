const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const { upload } = require("./middlewares/uploadMiddleware.js");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
connectDB();

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);

// Image Upload Route
app.post('/upload', upload.single('product'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    res.json({ success: true, image_url: `/images/${req.file.filename}` });
});

// Serve static files
app.use('/images', express.static("upload/images"));

// Root Route
app.get("/", (req, res) => res.send("Root"));

// Error Handling
app.use((error, req, res, next) => {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
});

// Start Server with proper error handling
const server = app.listen(PORT)
    .on('listening', () => {
        console.log(`Server running on port ${PORT}`);
    })
    .on('error', (error) => {
        console.error('Server failed to start:', error.message);
        process.exit(1);
    });

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    server.close(() => process.exit(1));
});
