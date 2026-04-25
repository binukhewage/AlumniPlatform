import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import FeaturedAlumni from "./pages/FeaturedAlumni";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import ViewAlumni from "./pages/ViewAlumni";
import RoleRoute from "./routes/RoleRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/featured" element={<FeaturedAlumni />} />
        <Route path="/view-alumni" element={<ViewAlumni />} />
        {/* Admin Only */}

        <Route
          path="/analytics"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AnalyticsDashboard />
            </RoleRoute>
          }
        />

        {/* Logged In Users */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
