const express = require("express");
const router = express.Router();
const { getAllUsers, addUser, editUser, removeUser } = require("../controllers/userController");

// Routes for user management
router.get('/allusers', getAllUsers);
router.post('/adduser', addUser);
router.post('/edituser', editUser);
router.post('/removeuser', removeUser);

module.exports = router;