import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import crypto from "crypto";
import VerificationTokenModel from "../models/verificationTokenModel.js";
import db from "../config/db.js";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

class AuthService {
  // ------------------- REGISTER -------------------
  static async register(email, password) {
    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // University domain check
    const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN;

    if (!email.endsWith(`@${allowedDomain}`)) {
      throw new Error(`Only ${allowedDomain} email addresses are allowed`);
    }

    // Strong password validation
    // At least 8 chars, 1 uppercase, 1 number
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)) {
      throw new Error(
        "Password must be at least 8 characters long and include at least one uppercase letter and one number",
      );
    }

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const userId = await UserModel.createUser(email, hashedPassword);

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");

    // Expiry 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Save token in DB
    await VerificationTokenModel.createToken(userId, token, expiresAt);

    return { userId, verificationToken: token };
  }

  // ------------------- VERIFY EMAIL -------------------
  static async verifyEmail(token) {
    if (!token) {
      throw new Error("Verification token is required");
    }

    const record = await VerificationTokenModel.findByToken(token);

    if (!record) {
      throw new Error("Invalid token");
    }

    // Check expiry
    if (new Date(record.expires_at) < new Date()) {
      throw new Error("Token expired");
    }

    // Mark user as verified
    await db.execute("UPDATE users SET is_verified = TRUE WHERE id = ?", [
      record.user_id,
    ]);

    // Delete token (single use)
    await VerificationTokenModel.deleteById(record.id);

    return { message: "Email verified successfully" };
  }

  // ------------------- LOGIN -------------------
  static async login(email, password) {
    const user = await UserModel.findByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    // Block unverified users
    if (!user.is_verified) {
      throw new Error("Email not verified");
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return { token };
  }

  // ------------------- LOGOUT -------------------
static async logout() {
  return { message: "Logged out successfully" };
}

}

export default AuthService;
