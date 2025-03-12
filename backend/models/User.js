const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
  orders: [
    {
      orderId: String,
      items: [{ productId: Number, quantity: Number, price: Number, name: String, image: String }],
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
    }
  ],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Users", userSchema);
