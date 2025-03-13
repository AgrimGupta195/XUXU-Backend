const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./lib/db");
const authRouter = require("./routes/authRoutes");
const app = express();
dotenv.config();

// app.get("/", (req, res) => {
//     res.send("Hello World");
// })

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/api/auth",authRouter)
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB();
})