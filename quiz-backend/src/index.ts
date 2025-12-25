import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import superadminAuthRoute from "./routes/superadmin.routes";
import adminRoutes from "./routes/admin.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/school/auth", authRoutes);
app.use("/api/superadmin/admin", superadminAuthRoute);
app.use("/api/admin", adminRoutes);

const connectDB = async () => {
  try {
    const mongoose = require("mongoose");
    mongoose.connect(process.env.DB_URL).then(() => {

    console.log("DB CONNECTED" + process.env.DB_URL);

});
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
