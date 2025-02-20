import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import DashboardLayout from "../../layouts/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
// import { AuthContext } from "@/context/AuthContext";
const AddJob = () => {

      const { isAuthenticated, user, logout } = useContext(AuthContext); // Assuming user object contains role

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        department: "",
        qualifications: "",
        deadline: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate(); // For redirecting after job creation

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You are not allowed to do!");
                return;
            }

            const response = await axios.post("http://localhost:5000/jobs", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
console.log(response)
            alert("Job created successfully!");
            navigate("/admin/jobs"); // Redirect to job listings page (use navigate instead of history.push)
        } catch (error) {
            setError(error.response?.data?.error || "An error occurred while creating the job.");
        }
    };

    return (
        <DashboardLayout>
        <div className="max-w-screen-lg mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Add a New Job</h2>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                        Job Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                        Job Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                {isAuthenticated && user?.role !== "faculity" && (
                <div className="mb-4">
                    <label htmlFor="department" className="block text-sm font-semibold text-gray-700">
                        Department
                    </label>
                    <input
                        type="text"
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                )}
                <div className="mb-4">
                    <label htmlFor="qualifications" className="block text-sm font-semibold text-gray-700">
                        Qualifications
                    </label>
                    <input
                        type="text"
                        id="qualifications"
                        name="qualifications"
                        value={formData.qualifications}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="deadline" className="block text-sm font-semibold text-gray-700">
                        Deadline
                    </label>
                    <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                        Create Job
                    </button>
                    <div className="mt-6 flex justify-end">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-5 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition duration-200 shadow-md"
                    >
                        Back
                    </button>
                </div>
                </div>
                
            </form>
        </div>
        </DashboardLayout>
    );
};

export default AddJob;
