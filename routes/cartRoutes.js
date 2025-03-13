const express = require("express");
const { protectRoute } = require("../middlewares/authMiddleware");
const { addToCart, getCartProducts, removeAllfromCart, updateCartQuantity } = require("../controllers/cartController");
const router = express.Router();

router.get("/",protectRoute,getCartProducts);
router.post("/",protectRoute,addToCart);
router.delete("/",protectRoute,removeAllfromCart);
router.put("/:id",protectRoute,updateCartQuantity);


module.exports=router;