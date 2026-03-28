import ApiKeyModel from "../models/apiKeyModel.js";

const apiKeyMiddleware = async (req, res, next) => {

  //  EXCLUDE THESE ROUTES
  if (
    req.path.startsWith("/auth") ||
    req.path.startsWith("/api-keys")
  ) {
    return next();
  }

  const key = req.headers["x-api-key"];

  if (!key) {
    return res.status(401).json({
      error: "API key required"
    });
  }

  //  ADD THIS (FRONTEND KEY BYPASS)
  if (key === process.env.FRONTEND_API_KEY) {
    return next();
  }

  // Normal DB validation
  const record = await ApiKeyModel.findByKey(key);

  if (!record) {
    return res.status(403).json({
      error: "Invalid or revoked API key"
    });
  }

  //  increment usage
  await ApiKeyModel.incrementUsage(record.id);

  next();
};

export default apiKeyMiddleware;