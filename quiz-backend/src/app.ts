import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.routes";
import superadminRoutes from "./routes/superadmin.routes";
import schoolRoutes from "./routes/school.routes";
import studentRoutes from "./routes/student.routes";

const app = express();

// CORS & JSON middleware
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3005"],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/school/auth", authRoutes);
app.use("/api/school", schoolRoutes);
app.use("/api/superadmin/admin", superadminRoutes);
app.use("/api/student", studentRoutes);

export default app;
