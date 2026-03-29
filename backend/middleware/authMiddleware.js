//This middleware verifies the JWT token sent in the request header and allows access only if the token is valid.


//import JWT library for token verification 
import jwt from "jsonwebtoken";

//middleware to protect routes using JWT AUTH
const authMiddleware = (req, res, next) => {

  // Get header 
  const authHeader = req.headers.authorization;

  // if no header user is not authenticated 
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Extract token
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Invalid token format" });
  }

  try {
    // Verify token using secret key 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info
    req.user = decoded;

    next(); //continue to next middleware route 

  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default authMiddleware;
