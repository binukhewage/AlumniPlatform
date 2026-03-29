// This middleware is responsible for protecting API endpoints using API key authentication

import ApiKeyModel from "../models/apiKeyModel.js";

//Middle ware Funtion to validate API Keys

const apiKeyMiddleware = async (req, res, next) => {

  //  EXCLUDE THESE ROUTES (These does not require API including profile/degrees and all others 
  if (
    req.path.startsWith("/auth") ||
    req.path.startsWith("/api-keys")
  ) {
    return next();
  }

  //Extract API Key from Header 
  const key = req.headers["x-api-key"];

  if (!key) {
    return res.status(401).json({
      error: "API key required"
    });
  }

  //  ADD THIS (FRONTEND KEY BYPASS FOR FEATURED ALUMNI SHOW )
  //allows Frontend to  access API without DB check 
  if (key === process.env.FRONTEND_API_KEY) {
    return next();
  }

  // Normal DB validation
  const record = await ApiKeyModel.findByKey(key);

  if (!record) {
    return res.status(403).json({
      error: "Invalid or revoked API key"  //if key invalid or revoked throw the error 
    });
  }

  //  increment usage (Track Usage)
  await ApiKeyModel.incrementUsage(record.id);

  next();
};

export default apiKeyMiddleware;