import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import crypto from "crypto";
import VerificationTokenModel from "../models/verificationTokenModel.js";
import db from "../config/db.js";
import jwt from "jsonwebtoken";
import EmailService from "./emailService.js";
import PasswordResetTokenModel from "../models/passwordResetTokenModel.js";

const SALT_ROUNDS = 10;

class AuthService {
  // ------------------- REGISTER (TRANSACTION SAFE) -------------------
  static async register(full_name, email, password) {

    const connection = await db.getConnection();
  
    try {
      await connection.beginTransaction();
  
      // Normalize email
      email = email.trim().toLowerCase();
  
      // ---------------- VALIDATION ----------------
  
      // Name validation
      if (!full_name || full_name.trim().length < 2) {
        throw new Error("Full name is required");
      }
  
      // Email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }
  
      // University domain check
      const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN;
      if (!email.endsWith(`@${allowedDomain.toLowerCase()}`)) {
        throw new Error(`Only ${allowedDomain} email addresses are allowed`);
      }
  
      // Strong password validation
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(password)) {
        throw new Error(
          "Password must be at least 8 characters long and include at least one uppercase letter and one number"
        );
      }
  
      // ---------------- CHECK USER ----------------
  
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        throw new Error("Email already registered");
      }
  
      // ---------------- CREATE USER ----------------
  
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  
      const [userResult] = await connection.execute(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword]
      );
  
      const userId = userResult.insertId;
  
      // ---------------- CREATE PROFILE ----------------
  
      await connection.execute(
        `INSERT INTO profiles (user_id, full_name)
         VALUES (?, ?)`,
        [userId, full_name]
      );
  
      // ---------------- TOKEN ----------------
  
      const token = crypto.randomBytes(32).toString("hex");
  
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
      await connection.execute(
        "INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
        [userId, token, expiresAt]
      );
  
      // ---------------- COMMIT ----------------
  
      await connection.commit();
      connection.release();
  
      // ---------------- EMAIL ----------------
  
      await EmailService.sendVerificationEmail(email, token);
  
      // ---------------- RESPONSE ----------------
  
      if (process.env.TEST_MODE === "true") {
        return { userId, verificationToken: token };
      }
  
      return { userId };
  
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
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

    if (new Date(record.expires_at) < new Date()) {
      throw new Error("Token expired");
    }

    await db.execute("UPDATE users SET is_verified = TRUE WHERE id = ?", [
      record.user_id,
    ]);

    await VerificationTokenModel.deleteById(record.id);

    return { message: "Email verified successfully" };
  }

  // ------------------- LOGIN -------------------
  static async login(email, password) {
    const user = await UserModel.findByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    if (!user.is_verified) {
      throw new Error("Email not verified");
    }

    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return { token };
  }

  // ------------------- LOGOUT -------------------
  static async logout() {
    return { message: "Logged out successfully" };
  }

  // ------------------- FORGOT PASSWORD -------------------
  static async forgotPassword(email) {
    const user = await UserModel.findByEmail(email);

    if (!user) {
      throw new Error("No account with that email");
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await PasswordResetTokenModel.createToken(user.id, token, expiresAt);

    await EmailService.sendPasswordResetEmail(email, token);

if (process.env.TEST_MODE === "true") {
  return {
    message: "Password reset email sent",
    resetToken: token
  };
}

return { message: "Password reset email sent" };
  }

  // ------------------- RESET PASSWORD -------------------
  static async resetPassword(token, newPassword) {
    const record = await PasswordResetTokenModel.findByToken(token);

    if (!record) {
      throw new Error("Invalid or expired token");
    }

    if (new Date(record.expires_at) < new Date()) {
      throw new Error("Token expired");
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await db.execute("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      record.user_id,
    ]);

    await PasswordResetTokenModel.deleteById(record.id);

    return { message: "Password reset successful" };
  }
}

export default AuthService;
