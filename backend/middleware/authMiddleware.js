import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {

  // Get header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Extract token
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Invalid token format" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info
    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default authMiddleware;
