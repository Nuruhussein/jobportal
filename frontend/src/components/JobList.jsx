import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [cvLink, setCvLink] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [submissionMessage, setSubmissionMessage] = useState("");
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/jobs");
        setJobs(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchAppliedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get("http://localhost:5000/applications/user", config);
        setAppliedJobs(response.data.map((app) => app.jobId)); // Store applied job IDs
      } catch (err) {
        console.error("Error fetching applied jobs", err);
      }
    };

    fetchJobs();
    fetchAppliedJobs();
  }, []);

  const openModal = (job) => {
    if (appliedJobs.includes(job._id)) return; // Prevent opening modal if already applied
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedJob(null);
    setIsModalOpen(false);
    setCvLink("");
    setCoverLetter("");
    setSubmissionMessage("");
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in!");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(
        "http://localhost:5000/applications",
        {
          jobId: selectedJob._id,
          cvLink,
          coverLetter,
        },
        config
      );

      setAppliedJobs([...appliedJobs, selectedJob._id]); // Update state after applying
      setSubmissionMessage("Application submitted successfully!");
      closeModal();
    } catch (error) {
      setSubmissionMessage(error.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <section className="py-10 sm:py-16 lg:py-24">
      <div className="flex flex-row-reverse">
        <div className="space-y-3 flex flex-col mt-10 text-center shadow-lg justify-center items-center sm:block overflow-y-auto lg:w-1/5 lg:px-2 lg:space-y-4">
          <h2 className="text-xl font-bold leading-tight text-black sm:text-4xl lg:text-2xl m-6">
            Departments
          </h2>
          <span>Welcome, {user?.name || "User"}</span>
          <button onClick={logout}>Logout</button>
        </div>

        <div className="max-w-6xl px-4 mx-auto w-3/4 sm:px-6 lg:px-8">
          <h2 className="ml-14 text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
            Jobs
          </h2>

          {loading && <p className="mt-12 text-center text-gray-500">Loading jobs...</p>}
          {error && <p className="mt-12 text-center text-red-500">{error}</p>}

          <div className="flow-root mt-12 sm:mt-16">
            <div className="divide-y divide-gray-200 -my-9">
              {jobs.map((job) => (
                <div key={job._id} className="py-9 pl-4 m-8 shadow-lg bg-white">
                  <p className="text-xl font-semibold text-black">{job.title}</p>
                  <p className="mt-3 text-base text-gray-600">{job.description}</p>
                  <p className="mt-3 text-base text-gray-600">
                    <strong>Department:</strong> {job.department}
                  </p>
                  <p className="mt-3 text-base text-gray-600">
                    <strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}
                  </p>
                  {appliedJobs.includes(job._id) ? (
                    <button className="mt-4 px-4 py-2 text-white bg-gray-400 cursor-not-allowed rounded-md">
                      Already Applied
                    </button>
                  ) : (
                    <button
                      className="mt-4 px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                      onClick={() => openModal(job)}
                    >
                      Apply
                    </button>
                  )}
                </div>
              ))}

              {!loading && jobs.length === 0 && (
                <p className="mt-12 text-center text-gray-500">No jobs available.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Apply for {selectedJob.title}</h3>
            <form onSubmit={handleSubmitApplication}>
              <div className="mb-4">
                <label htmlFor="cvLink" className="block text-sm font-medium text-gray-700">
                  CV Link
                </label>
                <input
                  id="cvLink"
                  type="url"
                  value={cvLink}
                  onChange={(e) => setCvLink(e.target.value)}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
                  Cover Letter
                </label>
                <textarea
                  id="coverLetter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  required
                  rows="4"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
              </div>
              {submissionMessage && <p className="text-center text-sm text-green-500">{submissionMessage}</p>}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default JobList;
