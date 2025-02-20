import { useState, useEffect,useContext } from "react";

import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom"; // useParams to get the job ID from the URL
// import { AuthContext } from "../../context/AuthContext";

const EditJob = () => {
      const { isAuthenticated, user } = useContext(AuthContext); // Assuming user object contains role

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        department: "",
        qualifications: "",
        deadline: "",
        status: "open",
        postStatus: "draft",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { jobId } = useParams(); // Get jobId from the URL

    // Fetch job details based on jobId
    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/jobs/${jobId}`);
                setFormData(response.data);
            } catch (error) {
                console.error("Error fetching job:", error);
                setError("An error occurred while fetching the job details.");
            }
        };

        fetchJob();
    }, [jobId]);

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
                alert("You are not logged in!");
                return;
            }

            const response = await axios.patch(`http://localhost:5000/jobs/${jobId}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
console.log(response)
            alert("Job updated successfully!");
            navigate("/admin/jobs"); // Redirect to the jobs list page after successful update
        } catch (error) {
            setError(error.response?.data?.error || "An error occurred while updating the job.");
        }
    };

    return (
        <div className="max-w-screen-lg mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Edit Job</h2>
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
                    <label htmlFor="status" className="block text-sm font-semibold text-gray-700">
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
                {isAuthenticated && user?.role !== "faculity" && (
                     <div className="mb-4">
                     <label htmlFor="postStatus" className="block text-sm font-semibold text-gray-700">
                         Post Status
                     </label>
                     <select
                         id="postStatus"
                         name="postStatus"
                         value={formData.postStatus}
                         onChange={handleChange}
                      
                         className="w-full p-2 border rounded-md"
                     >
                         <option value="draft">Draft</option>
                         <option value="published">Published</option>
                     </select>
                 </div>
                )}
                <div className="mb-4">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                        Update Job
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
    );
};

export default EditJob;
