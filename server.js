import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import db from "./config/db.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Test DB Connection
try {
  await db.getConnection();
  console.log("MySQL Connected Successfuly");
} catch (error) {
  console.error("Database connection failed:", error);
}

app.get("/", (req, res) => {
  res.json({ message: "Alumni Platform API Running" });
});

const PORT = process.env.PORT || 5000;

import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
