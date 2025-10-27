import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import questionRoutes from "./routes/questions.js";
import resultRoutes from "./routes/result.js";
import adminRoutes from "./routes/admin.js";
import psychometricRouter from "./routes/psychometric.js";
dotenv.config();
const app = express();
const geminiApiKey = process.env.GEMINI_API_KEY;

const header= {
    Authorization: `Bearer ${geminiApiKey}`,
    "Content-Type":"application/json",
}

app.use(cors());
app.use(express.json());


app.use("/api/auth",authRoutes);
app.use("/api/question",questionRoutes);
app.use("/api/result",resultRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/psycho",psychometricRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));