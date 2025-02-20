import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";

const ApplicationspecificTable = () => {
    const [applications, setApplications] = useState([]);
    const [jobTitle, setJobTitle] = useState("");
    const { jobId } = useParams();
    const navigate = useNavigate();

    // Fetch applications for the job
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("You are not logged in!");
                    return;
                }

                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get(`http://localhost:5000/applications/job/${jobId}`, config);

                setApplications(response.data);
                setJobTitle(response.data[0]?.jobId?.title || "Job Applications");
            } catch (error) {
                console.error("Error fetching applications:", error);
            }
        };

        fetchApplications();
    }, [jobId]);

    // Handle updating application status
    const handleUpdateStatus = async (applicationId, status) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You are not logged in!");
                return;
            }

            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.patch(
                `http://localhost:5000/applications/${applicationId}`,
                { status },
                config
            );

            if (response.data.application && response.data.application.status) {
                setApplications((prevApplications) =>
                    prevApplications.map((app) =>
                        app._id === applicationId ? { ...app, status: response.data.application.status } : app
                    )
                );
                alert("Application status updated successfully!");
            } else {
                alert("Failed to update the application status.");
            }
        } catch (error) {
            console.error("Error updating application status:", error);
            alert("An error occurred while updating the status.");
        }
    };

    // Handle viewing application details
    const handleViewApplication = (applicationId) => {
        navigate(`/applications/${applicationId}`); // Navigate to the application details page
    };

    const handleDeleteApplication = async (applicationId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You are not logged in!");
                return;
            }
    
            const confirmDelete = window.confirm("Are you sure you want to delete this application?");
            if (!confirmDelete) return;
    
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`http://localhost:5000/applications/${applicationId}`, config);
    
            setApplications((prevApplications) =>
                prevApplications.filter((app) => app._id !== applicationId)
            );
    
            alert("Application deleted successfully!");
        } catch (error) {
            console.error("Error deleting application:", error.response?.data || error.message);
            alert(error.response?.data?.error || "An error occurred while deleting the application.");
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-screen-xl mt-10 mx-auto px-4 md:px-8">
                <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">{jobTitle}</h3>
                <p className="text-gray-600 mt-2">
                    View and manage all applications for this job.
                </p>

                <div className="mt-8 shadow-sm border rounded-lg overflow-x-auto">
                    <table className="w-full table-auto text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                            <tr>
                                <th className="py-3 px-6">Applicant Name</th>
                                <th className="py-3 px-6">Email</th>
                                <th className="py-3 px-6">CV Link</th>
                                <th className="py-3 px-6">Status</th>
                                <th className="py-3 px-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 divide-y">
                            {applications.length > 0 ? (
                                applications.map((app) => (
                                    <tr key={app._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{app.applicantId.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{app.applicantId.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <a
                                                href={app.cvLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:underline"
                                            >
                                                View CV
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{app.status}</td>
                                        <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                                            <button
                                                onClick={() => handleViewApplication(app._id)}
                                                className="px-3 py-1 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleDeleteApplication(app._id)}
                                                className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg"
                                            >
                                                Delete
                                            </button>
                                            <select
                                                value={app.status}
                                                onChange={(e) =>
                                                    handleUpdateStatus(app._id, e.target.value)
                                                }
                                                className="block w-32 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            >
                                                <option value="submitted">Submitted</option>
                                                <option value="pending">Pending</option>
                                                <option value="accepted">Accepted</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-4 text-center text-gray-500"
                                    >
                                        No applications found for this job.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ApplicationspecificTable;