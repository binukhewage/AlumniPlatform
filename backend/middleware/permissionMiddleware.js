export const requirePermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.apiKey) {
      return res.status(401).json({
        error: "API key required",
      });
    }

    const permissions = req.apiKey.permissions || "";

    const permsArray = permissions
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    if (
      permsArray.includes("*") ||
      permsArray.includes(requiredPermission)
    ) {
      return next();
    }

    return res.status(403).json({
      error: `Forbidden: requires ${requiredPermission}`,
    });
  };
};