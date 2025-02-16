import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Apply = () => {
  const { jobId } = useParams(); // Get the job ID from the URL
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [cvLink, setCvLink] = useState("");
  const [cvImage, setCvImage] = useState(null); // For file upload
  const [coverLetter, setCoverLetter] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/jobs/${jobId}`);
        setJob(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in!");
        return;
      }

      // Create a FormData object to send files and other fields
      const formData = new FormData();
      formData.append("jobId", jobId);
      formData.append("cvLink", cvLink || "");
      formData.append("coverLetter", coverLetter || "");
      formData.append("qualifications", qualifications || "");
      if (cvImage) {
        formData.append("cvImage", cvImage); // Append the file
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      };

      const response = await axios.post(
        "http://localhost:5000/applications",
        formData,
        config
      );

      setSubmissionMessage("Application submitted successfully!");
      setTimeout(() => {
        navigate("/"); // Redirect to the job list after successful submission
      }, 1500);
    } catch (error) {
      setSubmissionMessage(error.response?.data?.error || "An error occurred.");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading job details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!job) return <p className="text-center text-gray-500">Job not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Apply for {job.title}</h1>

      {/* Display Job Details */}
      <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Job Details</h2>
        <div className="space-y-3">
          <p>
            <strong>Title:</strong> {job.title}
          </p>
          <p>
            <strong>Description:</strong> {job.description}
          </p>
          <p>
            <strong>Department:</strong> {job.department}
          </p>
          {job.qualifications && (
            <p>
              <strong>Qualifications:</strong> {job.qualifications}
            </p>
          )}
          <p>
            <strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong> {job.status}
          </p>
          {job.postedBy && (
            <p>
              <strong>Posted By:</strong> {job.postedBy.name} {/* Assuming `postedBy` has a `name` field */}
            </p>
          )}
        </div>
      </div>

      {/* Application Form */}
      <form onSubmit={handleSubmitApplication} className="space-y-4">
        <div>
          <label htmlFor="cvLink" className="block text-sm font-medium text-gray-700">
            CV Link 
          </label>
          <input
            id="cvLink"
            type="url"
            value={cvLink}
            onChange={(e) => setCvLink(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="cvImage" className="block text-sm font-medium text-gray-700">
            Upload CV 
          </label>
          <input
            id="cvImage"
            type="file"
            onChange={(e) => setCvImage(e.target.files[0])} // Store the selected file
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
            Cover Letter
          </label>
          <textarea
            id="coverLetter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows="6"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">
            Qualifications 
          </label>
          <textarea
            id="qualifications"
            value={qualifications}
            onChange={(e) => setQualifications(e.target.value)}
            rows="4"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        {submissionMessage && (
          <p className="text-center text-sm text-green-500">{submissionMessage}</p>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default Apply;