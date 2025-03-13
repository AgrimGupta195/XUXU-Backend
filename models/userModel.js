const mongoose  = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    otp:{
        type: String
    },otpExpire:{
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    cartItems: [{
        quantity:{
            type: Number,
            default: 1
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    }],
    role:{
        type: String,
        enum: ["customer", "admin"],
        default: "customer"
    }
},{
    timestamps: true
}
)
const User = mongoose.model("User", userSchema);
module.exports = User;
