import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
  const [fullName, setFullName] = useState(""); // Added for backend profile creation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Updated payload to match your backend: full_name, email, password
      const res = await api.post("/auth/register", {
        full_name: fullName, 
        email,
        password,
      });

      setMessage("Registration successful! Please check your email to verify.");
      setError("");
      // Optional: Clear fields on success
      setFullName("");
      setEmail("");
      setPassword("");

    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleRegister}
        className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden"
      >
        {/* Subtle academic header added for a "redesign" feel */}
        <div className="bg-blue-800 p-6 text-white text-center">
          <h2 className="text-2xl font-semibold">Alumni Platform</h2>
          <p className="text-blue-200 text-sm">Create your institutional account</p>
        </div>

        <div className="p-8">
          {message && (
            <p className="bg-green-50 text-green-600 p-3 rounded text-sm mb-4 border border-green-200">
              {message}
            </p>
          )}

          {error && (
            <p className="bg-red-50 text-red-500 p-3 rounded text-sm mb-4 border border-red-200">
              {error}
            </p>
          )}

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-2.5 border rounded focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="University Email"
              className="w-full p-2.5 border rounded focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-2.5 border rounded focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white p-3 rounded-md mt-6 font-medium hover:bg-blue-800 transition-colors shadow-sm"
          >
            Register Account
          </button>

          <p className="text-sm mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/" className="text-blue-700 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;