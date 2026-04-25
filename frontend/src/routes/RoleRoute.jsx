import { Navigate } from "react-router-dom";

const RoleRoute = ({ allowedRoles, children }) => {
  const role = localStorage.getItem("role");

  if (!role) return <Navigate to="/" replace />;

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default RoleRoute;