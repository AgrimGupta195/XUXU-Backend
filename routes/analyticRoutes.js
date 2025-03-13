const express  = require("express");
const { protectRoute, isAdmin } = require("../middlewares/authMiddleware");
const {getAnalyticData, getDailySalesData} = require("../controllers/analyticController");
const router = express.Router();

router.get("/", protectRoute, isAdmin, async (req, res) => {
	try {
		const analyticsData = await getAnalyticData();

		const endDate = new Date();
		const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

		const dailySalesData = await getDailySalesData(startDate, endDate);

		res.json({
			analyticsData,
			dailySalesData,
		});
	} catch (error) {
		console.log("Error in analytics route", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
});


module.exports = router;