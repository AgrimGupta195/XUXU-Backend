const Coupon = require("../models/couponModel");
const getCoupon = async (req, res) => {
    try {
        const Coupons = await Coupon.findOne({userId : req.user._id,isActive : true});
        return res.status(200).json(Coupons||null);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const validateCoupon = async (req, res) => {
    try {
        const{code}= req.body;
        const coupon = await Coupon.findOne({code,userId:req.user._id,isActive : true});
        if(!coupon){
            return res.status(400).json({message:"Invalid Coupon"});
        }
        if(Date.now() > coupon.expiryDate){
            coupon.isActive = false;
            await coupon.save();
            return res.status(400).json({message:"Coupon Expired"});
        }
        res.json({
            message:"Valid Coupon",
            discount : coupon.discountPercentage,
            code:coupon.code
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = {getCoupon,validateCoupon}