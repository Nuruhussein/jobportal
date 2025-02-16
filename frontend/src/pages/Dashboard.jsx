import { useContext } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import { AuthContext } from "../context/AuthContext";



const Dashboard = () => {
   const { isAuthenticated, user, logout } = useContext(AuthContext); 

    // <div className="max-w-7xl mx-auto p-6">
    //   <Sidebar/>
    //   <h2 className="text-2xl font-bold">Admin Dashboard</h2>
    //   <p>Manage users, monitor activity, and configure the portal settings.</p>
    // </div>
    return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar
        <aside className="w-64 bg-gray-800 text-white flex flex-col">
          <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-gray-700">
            Admin Panel
          </div>
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="block py-2 px-4 rounded hover:bg-gray-700 transition"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-4 rounded hover:bg-gray-700 transition"
                >
                  Users
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-4 rounded hover:bg-gray-700 transition"
                >
                  Reports
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-4 rounded hover:bg-gray-700 transition"
                >
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </aside> */}
        <Sidebar/>
  
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="h-16 bg-white shadow flex items-center px-4">
            <h1 className="text-lg font-semibold text-gray-800">
              Welcome,  {isAuthenticated &&
            user?.role}
            </h1>
       
            <div className="ml-auto">
              <button className="text-sm bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                Logout
              </button>
            </div>
          </header>
  
          {/* Dashboard Content */}
          <main className="flex-1 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white p-4 shadow rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700">Users</h3>
                <p className="text-2xl font-bold text-gray-800 mt-2">1,245</p>
              </div>
              {/* Card 2 */}
              <div className="bg-white p-4 shadow rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
                <p className="text-2xl font-bold text-gray-800 mt-2">$12,345</p>
              </div>
              {/* Card 3 */}
              <div className="bg-white p-4 shadow rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700">Orders</h3>
                <p className="text-2xl font-bold text-gray-800 mt-2">320</p>
              </div>
            </div>
  
            {/* Table */}
            <div className="mt-8 bg-white p-6 shadow rounded-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 text-left">Name</th>
                    <th className="border border-gray-300 p-2 text-left">Action</th>
                    <th className="border border-gray-300 p-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">John Doe</td>
                    <td className="border border-gray-300 p-2">Created a report</td>
                    <td className="border border-gray-300 p-2">2024-12-12</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Jane Smith</td>
                    <td className="border border-gray-300 p-2">Updated profile</td>
                    <td className="border border-gray-300 p-2">2024-12-13</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    );

};

export default Dashboard;
