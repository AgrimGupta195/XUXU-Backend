const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const { sendReferralEmail, sendOtpEmail, welcomeEmail } = require("../services/otpVerification");
const jwt = require("jsonwebtoken");
const redis = require("../lib/redis");

const generateToken = (id) =>{
    const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: "15m" });
    const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET,{ expiresIn: "7d" });
    return { accessToken, refreshToken };
}
const storeRefreshToken = async (token, userId) => {
    try {
        await redis.set(`refreshToken:${userId}`, token,"EX", 60 * 60 * 24 * 7);
    } catch (error) {
        console.log(error);
    }
}
const setCookie = (res,accessToken,refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "Strict",
        secure: true,
        maxAge: 15 * 60 * 1000
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "Strict",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}
const generateOTP = () => Math.floor(1000 + Math.random() * 9000);

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        };
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const otpExpire = Date.now() + 10 * 60 * 1000;
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            otp,
            otpExpire
        });
        const emailResult = await sendOtpEmail(
            user.email,
            "xuxu - Verify Email",
            `Hi ${user.name}, \n\nPlease verify your email by entering the OTP sent to your email.`,
            user.otp
        );
        console.log("Email sent:", emailResult);
        return res.status(200).json({ message: "User Registered. Please verify OTP sent to your email." });   
    } catch (error) {
        res.status(500).json({ message: "Error Registering User", error });
    }
}

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        if (user.isVerified) return res.status(400).json({ message: "User already verified" });

        if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

        if (user.otpExpire < Date.now()) return res.status(400).json({ message: "OTP expired" });

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();

        const successEmail =await welcomeEmail(user.email, "XUXU - Welcome", `Hi ${user.name}, \n\nWelcome to XUXU E-Commerce!`);
        console.log("Email sent:", successEmail);
        
        res.status(200).json({ message: "Email Verified. You can now login." });
    } catch (error) {
        res.status(500).json({ message: "Error Verifying User", error });
    }
};

const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        if (user.isVerified) return res.status(400).json({ message: "User already verified" });

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpire = Date.now() + 10 * 60 * 1000;
        await user.save();
        const emailResult = await sendOtpEmail(
            user.email,
            "xuxu - Verify Email",
            `Hi ${user.name}, \n\nPlease verify your email by entering the OTP sent to your email.`,
            user.otp
        );
        
        res.status(200).json({ message: "OTP resent to your email." });
    } catch (error) {
        res.status(500).json({ message: "Error Resending OTP", error });
    }
};
const login = async (req, res) => {
    try {
        const{email,password} = req.body;
    const user = await User.findOne({email});
    if(!user || !user.isVerified) {
        return res.status(400).json({
            success: false,
            message: "User not found"
        }); 
    }
    if(user && (await bcrypt.compare(password,user.password))) {
        const{accessToken,refreshToken} = generateToken(user._id);
        await storeRefreshToken(refreshToken,user._id);
        setCookie(res,accessToken,refreshToken);
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            accessToken,
            refreshToken
        });
    }else{
        return res.status(400).json({
            success: false,
            message: "Invalid credentials"
        });
    }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }

}
const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(204);
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        await redis.del(`refreshToken:${decoded.id}`);
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
const refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({ message: "No refresh token provided" });
		}
		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		const storedToken = await redis.get(`refreshToken:${decoded.id}`);
		if (!storedToken) {
			return res.status(401).json({ message: "Refresh token expired or not found" });
		}
		if (storedToken !== refreshToken) {
			return res.status(401).json({ message: "Invalid refresh token" });
		}

		const accessToken = jwt.sign({ id: decoded.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 15 * 60 * 1000,
		});

		res.json({ message: "Token refreshed successfully", accessToken });
	} catch (error) {
		console.log("Error in refreshToken controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

const getProfile = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
module.exports = {
    signup,
    verifyOTP,
    resendOTP,
    logout,
    login,
    refreshToken,
    getProfile
};
