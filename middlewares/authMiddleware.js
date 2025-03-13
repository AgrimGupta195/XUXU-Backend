const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const protectRoute = async (req, res, next) => {
	try {
		const accessToken = req.cookies.accessToken;
		if (!accessToken) {
			return res.status(401).json({ message: "Unauthorized - No access token provided" });
		}
		try {
			const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
			const user = await User.findById(decoded.id).select("-password");
			if (!user) {
				return res.status(401).json({ message: "User not found" });
			}
			req.user = user;
			next();
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				return res.status(401).json({ message: "Unauthorized - Access token expired" });
			}
			throw error;
		}
	} catch (error) {
		console.log("Error in protectRoute middleware", error.message);
		return res.status(401).json({ message: "Unauthorized - Invalid access token" });
	}
};
const isAdmin = async (req, res, next) => {
	try {
		const user = req.user;
		if (user.role !== "admin") {
			return res.status(403).json({ message: "Forbidden - User is not an admin" });
		}
		next();
	} catch (error) {
		console.log("Error in isAdmin middleware", error.message);
		return res.status(500).json({ message: "Server error", error: error.message });
	}
};
module.exports = {protectRoute,isAdmin};