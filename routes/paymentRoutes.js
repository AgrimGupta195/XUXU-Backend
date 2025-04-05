const { createCheckoutSession, checkoutSuccess } = require("../controllers/paymentContoller");
const{protectRoute} = require("../middlewares/authMiddleware");
const express = require("express");

const router = express.Router();

router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/checkout-success", protectRoute, checkoutSuccess);

module.exports = router;