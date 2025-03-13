const express = require("express");
const router = express.Router();
const { signup, verifyOTP, resendOTP, login, logout, refreshToken, getProfile } = require("../controllers/authController");
const {protectRoute} = require("../middlewares/authMiddleware");
router.post('/register', signup);
router.post('/verifyOtp', verifyOTP);
router.post('/resendOtp', resendOTP);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refreshToken',refreshToken);
router.get('/getProfile',protectRoute,getProfile);

module.exports = router;