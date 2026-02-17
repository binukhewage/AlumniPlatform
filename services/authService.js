import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";

const SALT_ROUNDS = 10;

class AuthService {
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

    return { userId };
  }
}

export default AuthService;
