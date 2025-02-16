import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // Hook for navigation

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

  const handleApplyClick = (jobId) => {
    if (appliedJobs.includes(jobId)) return; // Prevent navigation if already applied
    navigate(`/apply/${jobId}`); // Navigate to the dedicated apply page
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
                      onClick={() => handleApplyClick(job._id)}
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
    </section>
  );
};

export default JobList;