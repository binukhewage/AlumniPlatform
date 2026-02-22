import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", {
        email,
        password,
      });

      setMessage("Registration successful! Please check your email to verify.");
      setError("");

    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Alumni Register
        </h2>

        {message && (
          <p className="text-green-600 text-sm mb-4">{message}</p>
        )}

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <input
          type="email"
          placeholder="University Email"
          className="w-full p-2 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Register
        </button>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;