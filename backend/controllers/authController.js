const jwt = require("jsonwebtoken");
const Users = require("../models/User");

exports.login = async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ success: false, errors: "Invalid credentials" });

  const isValidPassword = req.body.password === user.password;
  if (!isValidPassword) return res.status(400).json({ success: false, errors: "Invalid password" });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
  res.json({ success: true, token, role: user.role });
};

exports.signup = async (req, res) => {
  let existingUser = await Users.findOne({ email: req.body.email });
  if (existingUser) return res.status(400).json({ success: false, errors: "User already exists" });

  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }

  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role || 'user',
    cartData: cart
  });

  await user.save();
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
  res.json({ success: true, token, role: user.role });
};
