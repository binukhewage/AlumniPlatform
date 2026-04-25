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
import allowRoles from "./middleware/roleMiddleware.js";
import { requirePermission } from "./middleware/permissionMiddleware.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import alumniRoutes from "./routes/alumniRoutes.js";

import "./jobs/bidScheduler.js";
import { swaggerUi, swaggerSpec } from "./config/swagger.js";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

// ✅ Allow cross-origin image loading
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(cors());
app.use(express.json());

// ---------- RATE LIMITING ----------------- //

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: "Too many requests, please try again later",
  },
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
    user: req.user,
  });
});

// JWT Routes (normal logged in users)
app.use("/api/profile", authMiddleware, profileRoutes);
app.use("/api/degrees", authMiddleware, degreeRoutes);
app.use("/api/certifications", authMiddleware, certificationRoutes);
app.use("/api/licences", authMiddleware, licenceRoutes);
app.use("/api/courses", authMiddleware, courseRoutes);
app.use("/api/employment", authMiddleware, employmentRoutes);

// API Key Protected Routes
app.use(
  "/api/alumni",
  apiKeyMiddleware,
  requirePermission("read:alumni"),
  alumniRoutes
);

app.use(
  "/api/bids",
  limiter,
  bidRoutes
);

app.use(
  "/api/public",
  apiKeyMiddleware,
  requirePermission("read:alumni_of_day"),
  publicRoutes
);

// Developer Only
app.use(
  "/api/api-keys",
  authMiddleware,
  allowRoles("developer"),
  apiKeyRoutes
);

// Analytics (Admin Only)
app.use(
  "/api/analytics",
  authMiddleware,
  allowRoles("admin"),
  apiKeyMiddleware,
  requirePermission("read:analytics"),
  analyticsRoutes
);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});