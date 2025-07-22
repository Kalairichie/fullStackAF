require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const salesRoutes = require("./routes/salesRoute");
const SalesUser = require("../Server/models/SalesUser");
const EstimationUser = require("../Server/models/EstimationUser");
const SalesOrderUser = require("../Server/models/SalesOrderUser");
const ManagementUser = require("../Server/models/ManagementUser");

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

mongoose
    .connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log("MongoDB connected");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => console.error("MongoDB error:", err));
