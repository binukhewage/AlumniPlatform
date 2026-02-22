import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.log(error);
    }

    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">
        Welcome to Dashboard
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;