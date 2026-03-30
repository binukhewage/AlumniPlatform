// Role-based access control middleware
// This function restricts access to specific user roles (e.g., developer)

const allowRoles = (...roles) => {

  
    return (req, res, next) => {
  
      // Check if user exists (JWT decoded) AND
    // if user's role is included in allowed roles
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({
          error: "Access denied"  // User is authenticated but not authorized
        });
      }
      
      // If role is valid → allow request to proceed
      next();
    };
  };
  
  export default allowRoles;