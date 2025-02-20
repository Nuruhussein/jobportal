import { useNavigate } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import PropTypes from "prop-types";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    // Clear the authentication token
    localStorage.removeItem("token");

    // Optionally clear other user-related data
    localStorage.removeItem("user");

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center px-4">
          <h1 className="text-lg font-semibold text-gray-800">Welcome, Admin!</h1>
          <div className="ml-auto">
            <button
              onClick={handleLogout}
              className="text-sm bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

// Define PropTypes AFTER the function declaration
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
