const Users = require("../models/User");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    let users = await Users.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};

// Add new user
exports.addUser = async (req, res) => {
  try {
    const existingUser = await Users.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const highestUser = await Users.findOne().sort('-id');
    const nextId = highestUser?.id ? highestUser.id + 1 : 1;

    let cartData = {};
    for (let i = 0; i < 300; i++) cartData[i] = 0;

    const user = new Users({
      id: nextId,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || 'user',
      cartData,
    });

    await user.save();
    const userResponse = { ...user.toObject() };
    delete userResponse.password;
    res.json({ success: true, user: userResponse });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.code === 11000 ? "Email already exists" : "Error creating user"
    });
  }
};

// Edit user details
exports.editUser = async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
    };

    if (req.body.password) updateData.password = req.body.password;

    const user = await Users.findOneAndUpdate(
      { id: req.body.id },
      updateData,
      { new: true }
    );

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    res.json({ success: true, user: userResponse });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.code === 11000 ? "Email already exists" : "Error updating user"
    });
  }
};

// Remove user
exports.removeUser = async (req, res) => {
  try {
    const user = await Users.findOneAndDelete({ id: req.body.id });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
};
