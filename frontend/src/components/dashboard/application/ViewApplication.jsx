import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";

const ViewApplication = () => {
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("You are not logged in!");
                    return;
                }

                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get(`http://localhost:5000/applications/${id}`, config);

                setApplication(response.data);
            } catch (error) {
                console.error("Error fetching application details:", error);
                setError("Failed to fetch application details.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, [id]);

    if (loading) return <div className="text-center py-10 text-lg">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
    if (!application) return <div className="text-center py-10 text-gray-500">Application not found.</div>;

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-xl">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-4">Application Details</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <p><strong className="text-gray-900">Applicant Name:</strong> {application.applicantId.name}</p>
                    <p><strong className="text-gray-900">Email:</strong> {application.applicantId.email}</p>
                    <p><strong className="text-gray-900">CV Link:</strong> 
                        {application.cvLink ? (
                            <a href={application.cvLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                                View CV
                            </a>
                        ) : (
                            <span className="text-gray-500 ml-2">No CV link provided</span>
                        )}
                    </p>
                    <p><strong className="text-gray-900">Uploaded CV:</strong> 
                        {application.cvImage ? (
                      <a
                      href={`http://localhost:5000/applications/download-cv/${application.cvImage.replace(/\\/g, '/').split('/').pop()}`}
                      download
                      className="text-blue-600 hover:underline ml-2"
                  >
                      Download CV
                  </a>
                  
                   
                        ) : (
                            <span className="text-gray-500 ml-2">No CV file uploaded</span>
                        )}
                    </p>
                    <p><strong className="text-gray-900">Cover Letter:</strong> {application.coverLetter || "N/A"}</p>
                    <p><strong className="text-gray-900">Qualifications:</strong> {application.qualifications || "N/A"}</p>
                    <p><strong className="text-gray-900">Status:</strong> 
                        <span className={`ml-2 px-2 py-1 text-sm font-medium rounded-lg 
                            ${application.status === "accepted" ? "bg-green-200 text-green-700" : 
                               application.status === "rejected" ? "bg-red-200 text-red-700" : 
                               "bg-yellow-200 text-yellow-700"}`}>
                            {application.status}
                        </span>
                    </p>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-5 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition duration-200 shadow-md"
                    >
                        Back
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ViewApplication;