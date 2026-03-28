import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added for a more "pro" feel
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        
        {/* Matching University Header */}
        <div className="bg-blue-800 p-6 text-white text-center">
          <h2 className="text-2xl font-semibold uppercase tracking-wide">Alumni Portal</h2>
          <p className="text-blue-200 text-xs mt-1">Authorized Access Only</p>
        </div>

        <form onSubmit={handleLogin} className="p-8">
          {error && (
            <p className="bg-red-50 text-red-500 p-3 rounded text-sm mb-4 border border-red-200 text-center">
              {error}
            </p>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
              <input
                type="email"
                placeholder="w******@my.westminster.ac.uk"
                className="w-full p-2.5 border rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-2.5 border rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <Link
              to="/forgot-password"
              className="text-xs text-blue-700 hover:underline font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-md mt-6 font-semibold text-white transition-all shadow-sm
              ${loading ? "bg-blue-400" : "bg-blue-700 hover:bg-blue-800 active:scale-[0.98]"}`}
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>

          <p className="text-sm mt-8 text-center text-gray-600">
            Need an account?{" "}
            <Link to="/register" className="text-blue-700 font-bold hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;