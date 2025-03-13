const express = require ("express");
const router = express.Router();
const {protectRoute, isAdmin} = require("../middlewares/authMiddleware");
const { getAllProducts, getFeaturedProduct, createProduct, deleteProduct, getRecommendedProduct } = require("../controllers/productController");


router.get("/",protectRoute,isAdmin,getAllProducts);
router.get("/featured",getFeaturedProduct);
router.get("/recommendations",getRecommendedProduct);
router.post("/",protectRoute,isAdmin,createProduct);
router.delete("/:id",protectRoute,isAdmin,deleteProduct);

module.exports = router;