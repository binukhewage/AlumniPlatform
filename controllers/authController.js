import AuthService from "../services/authService.js";

class AuthController {
  static async register(req, res) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.register(email, password);

      res.status(201).json({
        message: "User registered successfully",
        userId: result.userId,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
}

export default AuthController;
