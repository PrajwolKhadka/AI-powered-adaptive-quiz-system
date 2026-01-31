import express from "express";
import connectDB from "./database/db";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes";
import superadminAuthRoute from "./routes/superadmin.routes";
import schoolRoutes from "./routes/school.routes";
import studentRoute from "./routes/student.routes";

dotenv.config();

const app = express();

// app.use(cors());
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3005'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use("/api/school/auth", authRoutes);
app.use("/api/school", schoolRoutes)
app.use("/api/superadmin/admin", superadminAuthRoute);
app.use("/api/student", studentRoute);

const PORT = Number(process.env.PORT) || 5000;

connectDB().then(() => {
  app.listen(PORT,'0.0.0.0',() => {
    console.log(`Server running on port ${PORT}`);
  });
});
// '0.0.0.0', 