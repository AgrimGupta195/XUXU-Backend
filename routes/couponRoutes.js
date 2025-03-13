const express = require("express");
const router = express.Router();
const {protectRoute} = require("../middlewares/authMiddleware");
const { getCoupon, validateCoupon } = require("../controllers/couponController");

router.get("/",protectRoute,getCoupon);
router.post("/validate",protectRoute,validateCoupon);
module.exports = router;