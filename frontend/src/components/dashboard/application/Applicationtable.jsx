import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../layouts/DashboardLayout';

const ApplicationTable = () => {
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You are not logged in!");
            return;
        }

        try {
            const response = await axios.get('http://localhost:5000/applications', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setApplications(response.data);
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this application?")) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("You are not logged in!");
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/applications/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setApplications(applications.filter(app => app._id !== id)); // Update UI after deletion
        } catch (error) {
            console.error("Error deleting application:", error);
        }
    };

    return (
        <DashboardLayout>
            <div className="overflow-x-auto w-full p-6">
                <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200 text-left text-sm font-semibold text-gray-600">
                                <th className="px-4 py-3">Job Title</th>
                                <th className="px-4 py-3">Applicant Name</th>
                                <th className="px-4 py-3">CV Link</th>
                                <th className="px-4 py-3">Status</th>
                                {/* <th className="px-4 py-3">Evaluator Feedback</th>
                                <th className="px-4 py-3">Grade</th> */}
                                <th className="px-4 py-3">qualifications</th>

                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((application) => (
                                <tr key={application._id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-700">{application.jobId?.title}</td>
                                    <td className="px-4 py-3 text-gray-700">{application.applicantId?.name}</td>
                                    <td className="px-4 py-3 text-gray-700">
                                        <a href={application.cvLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            View CV
                                        </a>
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">
                                        <span className={`px-3 py-1 rounded-full ${application.status === 'submitted' ? 'bg-yellow-100 text-yellow-600' : application.status === 'shortlisted' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {application.status}
                                        </span>
                                    </td>
                                    {/* <td className="px-4 py-3 text-gray-700">{application.evaluatorFeedback || "N/A"}</td>
                                    <td className="px-4 py-3 text-gray-700">{application.grade || "N/A"}</td> */}
                                    <td className="px-4 py-3 text-gray-700">{application. qualifications|| "N/A"}</td> 
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => navigate(`/applications/${application._id}`)}
                                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDelete(application._id)}
                                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ApplicationTable;
