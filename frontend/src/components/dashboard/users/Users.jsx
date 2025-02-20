import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../../layouts/DashboardLayout";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [role, setRole] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "", 
        role: "",
        department: "",
    });

    useEffect(() => {
        fetchUsers();
    }, [role]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Unauthorized! Please log in.");
                return;
            }

            const response = await axios.get(`http://localhost:5000/users${role ? `?role=${role}` : ''}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            setError(error.response?.data?.error || "Error fetching users.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You are not allowed to perform this action!");
                return;
            }

            await axios.delete(`http://localhost:5000/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUsers(users.filter((user) => user._id !== id));
        } catch (error) {
            alert(error.response?.data?.error || "Error deleting user.");
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData(user);
        setShowModal(true);
    };

    const handleAdd = () => {
        setEditingUser(null);
        setFormData({ name: "", email: "", password: "", role: "", department: "" });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You are not allowed to perform this action!");
                return;
            }

            if (editingUser) {
                await axios.put(`http://localhost:5000/users/${editingUser._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                if (!formData.password) {
                    alert("Password is required!");
                    return;
                }
                await axios.post("http://localhost:5000/users", formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            setShowModal(false);
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.error || "Error saving user.");
        }
    };

    return (
             <DashboardLayout>
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">User Management</h1>

            {error && <div className="text-red-600 mb-4">{error}</div>}

            <div className="flex justify-between items-center mb-4">
                <select onChange={(e) => setRole(e.target.value)} className="p-2 border rounded bg-white shadow-md">
                    <option value="">All</option>
                    <option value="job_seeker">Job Seeker</option>
                    <option value="employer">Employer</option>
                    <option value="evaluator">Evaluator</option>
                    <option value="faculity">Faculity</option>
                    <option value="admin">Admin</option>
                </select>
                <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600">
                    + Add User
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-md rounded-lg border border-gray-200">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3 text-left">Department</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id} className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}>
                                <td className="p-3">{user.name}</td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3">{user.role}</td>
                                <td className="p-3">{user.department}</td>
                                <td className="p-3">
                                    <button onClick={() => handleEdit(user)} className="text-blue-500 hover:underline mr-2">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(user._id)} className="text-red-500 hover:underline">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Add/Edit User */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">{editingUser ? "Edit User" : "Add User"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Name" className="w-full p-2 border rounded" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                            {!editingUser && (
                                <input type="password" placeholder="Password" className="w-full p-2 border rounded" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                            )}
                            <select className="w-full p-2 border rounded" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required>
                                <option value="">Select Role</option>
                                <option value="job_seeker">Job Seeker</option>
                                <option value="employer">Employer</option>
                                <option value="evaluator">Evaluator</option>
                                <option value="faculity">Faculity</option>
                                <option value="admin">Admin</option>
                            </select>
                            <input type="text" placeholder="Department" className="w-full p-2 border rounded" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} required />
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
        </DashboardLayout>
    );
};

export default Users;
