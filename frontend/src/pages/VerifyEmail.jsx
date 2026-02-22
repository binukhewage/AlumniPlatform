import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying...");
  const [error, setError] = useState("");
  
  // 1. Use a Ref instead of State. Refs update instantly, 
  // fully protecting against Strict Mode double-execution.
  const hasRun = useRef(false); 

  useEffect(() => {
    if (hasRun.current) return; 
    hasRun.current = true; // Lock it immediately

    const token = searchParams.get("token");

    if (!token) {
      setError("Invalid verification link");
      return;
    }

    const verify = async () => {
      try {
        // 2. Pass the token in the `params` object so Axios 
        // automatically and safely URL-encodes special characters.
        const res = await api.get('/auth/verify-email', {
          params: { token }
        });
        setMessage(res.data.message);
      } catch (err) {
        setError(err.response?.data?.error || "Verification failed");
      }
    };

    verify();
  }, [searchParams]); 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96 text-center">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="text-green-600">{message}</p>
        )}

        <Link to="/" className="block mt-4 text-blue-600">
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;