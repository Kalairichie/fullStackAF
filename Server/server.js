require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const salesRoutes = require("./routes/salesRoute");
const User = require("../Server/models/User");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    "http://localhost:3000",
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/sales", salesRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the Acoustical Factory API!");
});

const seedDefaultUsers = async () => {
    await User.deleteMany({});
    await User.insertMany([
        { username: "ASI_Sales", password: "Welcome@123" },
        { username: "ASI_Estimation", password: "Welcome@123" },
        { username: "ASI_BDManager", password: "Welcome@123" },
        { username: "ASI_CEO", password: "Welcome@123" },
    ]);
    console.log("✅ Default users (re)inserted");
};

mongoose
    .connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log("MongoDB connected");
        await seedDefaultUsers();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => console.error("MongoDB error:", err));
