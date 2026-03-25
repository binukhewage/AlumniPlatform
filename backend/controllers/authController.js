import AuthService from "../services/authService.js";

class AuthController {

  // REGISTER
  static async register(req, res) {
    try {
      const { full_name, email, password } = req.body;

      const result = await AuthService.register(full_name, email, password);

      res.status(201).json({
        message: "User registered successfully",
        userId: result.userId,
        verificationToken: result.verificationToken // keep for now (testing)
      });

    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }


  // VERIFY EMAIL
  static async verifyEmail(req, res) {
    try {
      const { token } = req.query;

      const result = await AuthService.verifyEmail(token);

      res.status(200).json(result);

    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }


  //  LOGIN
static async login(req, res) {
  try {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    res.status(200).json(result);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

//LOGOUT
static async logout(req, res) {
  try {
    const result = await AuthService.logout();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// forgot password
static async forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const result = await AuthService.forgotPassword(email);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// reset password
static async resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;
    const result = await AuthService.resetPassword(token, newPassword);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

}

export default AuthController;
