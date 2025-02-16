import axios from 'axios';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';

const ApplicationTable = () => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        // Fetch applications from the backend
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You are not logged in!");
            return;
        }

        const fetchApplications = async () => {
            try {
                const response = await axios.get('http://localhost:5000/applications', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log(response.data); // This will log the fetched data

                setApplications(response.data); // Directly use response.data
            } catch (error) {
                console.error("Error fetching applications:", error);
            }
        };

        fetchApplications();
    }, []);

    return (
        <DashboardLayout>
        <div className="overflow-x-auto w-full p-4">
            <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-left text-sm font-semibold text-gray-600">
                            <th className="px-4 py-2">Job Title</th>
                            <th className="px-4 py-2">Applicant Name</th>
                            <th className="px-4 py-2">CV Link</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Evaluator Feedback</th>
                            <th className="px-4 py-2">Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((application) => (
                            <tr key={application._id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm text-gray-700">{application.jobId?.title}</td>
                                <td className="px-4 py-2 text-sm text-gray-700">{application.applicantId?.name}</td>
                                <td className="px-4 py-2 text-sm text-gray-700">
                                    <a href={application.cvLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        View CV
                                    </a>
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700">
                                    <span className={`px-2 py-1 rounded-full ${application.status === 'submitted' ? 'bg-yellow-100 text-yellow-600' : application.status === 'shortlisted' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {application.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700">{application.evaluatorFeedback}</td>
                                <td className="px-4 py-2 text-sm text-gray-700">{application.grade ? application.grade : 'N/A'}</td>
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
