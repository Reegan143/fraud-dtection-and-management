const express = require('express');
const UserController = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authUsers');

const router = express.Router();

router.post('/', UserController.registerUser);
router.post('/auth/login', UserController.loginUser);

// Protected routes
router.get('/users', protect, authorize('admin'), UserController.getAllUsers);
router.get('/me', protect, UserController.getUserById);
router.put('/user/:id', protect, UserController.updateUser);
router.delete('/user/:id', protect, authorize('admin'), UserController.deleteUser);

// OTP routes
router.post('/reset-password', UserController.sendOTP);
router.post('/verify-otp', UserController.verifyOTP);

module.exports = router;
