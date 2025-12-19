import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import mongoose from "mongoose";
import connectDB from "./db.js";

import schoolRoutes from "./routes/schoolroute.js";
import questionRoutes from "./routes/questions.js";
import resultRoutes from "./routes/result.js";
import adminRoutes from "./routes/adminroute.js";
import psychometricRouter from "./routes/psychometric.js";
import studentRoutes from "./routes/studentroute.js";


dotenv.config();
const app = express();

connectDB();

app.use(cors());
app.use(express.json());


// app.use("/api/auth",authRoutes);
// app.use("/api/question",questionRoutes);
// app.use("/api/result",resultRoutes);
// app.use("/api/admin",adminRoutes);
// app.use("/api/psycho",psychometricRouter);
// app.use("/api/student",studentRouter);


app.use("/api/admin", adminRoutes);
app.use("/api/school", schoolRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/question",questionRoutes);
app.use("/api/result",resultRoutes);
app.use("/api/psycho",psychometricRouter);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));