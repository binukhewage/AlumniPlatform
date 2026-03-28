import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";

import db from "./config/db.js";
import authMiddleware from "./middleware/authMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import degreeRoutes from "./routes/degreeRoutes.js";
import certificationRoutes from "./routes/certificationRoutes.js";
import licenceRoutes from "./routes/licenceRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import employmentRoutes from "./routes/employmentRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import apiKeyRoutes from "./routes/apiKeyRoutes.js";
import apiKeyMiddleware from "./middleware/apiKeyMiddleware.js";

import "./jobs/bidScheduler.js";
import { swaggerUi, swaggerSpec } from "./config/swagger.js";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

// ✅ Allow cross-origin image loading
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(express.json());

// ---------- RATE LIMITING ----------------- // 

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: "Too many requests, please try again later"
  }
});

/* ---------------- DATABASE CONNECTION ---------------- */

try {
  await db.getConnection();
  console.log("MySQL Connected Successfully");
} catch (error) {
  console.error("Database connection failed:", error);
}

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ---------------- SERVE UPLOADED IMAGES ---------------- */

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


app.get("/", (req, res) => {
  res.json({ message: "Alumni Platform API Running" });
});


app.use("/api/auth", limiter, authRoutes);

// PROTECTED TEST ROUTE 

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed a protected route",
    user: req.user
  });
});

app.use("/api/profile",  profileRoutes);
app.use("/api/degrees",  degreeRoutes);
app.use("/api/certifications",  certificationRoutes);
app.use("/api/licences",  licenceRoutes);
app.use("/api/courses",  courseRoutes);
app.use("/api/employment", employmentRoutes);
app.use("/api/bids", limiter, bidRoutes);
app.use("/api/public", apiKeyMiddleware, publicRoutes);
app.use("/api/api-keys", authMiddleware, apiKeyRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});