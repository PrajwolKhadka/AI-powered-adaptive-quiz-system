import express from "express";
import connectDB from "./database/db";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import superadminAuthRoute from "./routes/superadmin.routes";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/school/auth", authRoutes);
app.use("/api/superadmin/admin", superadminAuthRoute);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
