const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connectDB = require("./lib/db");
const authRouter = require("./routes/authRoutes");
const productRouter = require("./routes/productRoutes");
const couponRouter = require("./routes/couponRoutes");
const cartRouter = require("./routes/cartRoutes");
const paymentRouter = require("./routes/paymentRoutes");
const analyticsRouter = require("./routes/analyticRoutes");
const app = express();
dotenv.config();

// app.get("/", (req, res) => {
//     res.send("Hello World");
// })

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
 }));
app.use("/api/auth",authRouter);
app.use("/api/products",productRouter);
app.use("/api/cart",cartRouter);
app.use("/api/coupons",couponRouter);
app.use("/api/payments",paymentRouter);
app.use("/api/analytics",analyticsRouter);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB();
})