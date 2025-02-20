import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/jobs", {
          params: { search, department },
        });
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
        setAppliedJobs(response.data.map((app) => app.jobId));
      } catch (err) {
        console.error("Error fetching applied jobs", err);
      }
    };

    fetchJobs();
    fetchAppliedJobs();
  }, [search, department]); // Fetch jobs when search or department changes

  const handleApplyClick = (jobId) => {
    if (appliedJobs.includes(jobId)) return;
    navigate(`/apply/${jobId}`);
  };

  return (
    <div className="relative flex min-h-screen gap-4 flex-row-reverse items-start justify-center overflow-hidden bg-gray-50 p-6 sm:py-12">
      {/* Sidebar */}
      <div className="bg-white min-h-80 shadow-xl shadow-gray-100 w-full max-w-sm flex flex-col gap-3 sm:items-center justify-between px-5 py-4 rounded-md mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Departments</h2>
          {jobs.length > 0 ? (
            [...new Set(jobs.map((job) => job.department))].map((dept) => (
              <p key={dept} className="text-l font-bold text-gray-900">
                {dept || "jobs"}
              </p>
            ))
          ) : (
            <p className="text-gray-500">No departments available</p>
          )}
        </div>
      </div>

      {/* Job List */}
      <div className="w-full max-w-4xl space-y-6">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Search jobs by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-80"
          />

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-60"
          >
            <option value="">All Departments</option>
            {[...new Set(jobs.map((job) => job.department))].map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="text-center text-gray-500">Loading jobs...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white shadow-xl shadow-gray-100 w-full flex flex-col sm:flex-row gap-3 sm:items-center justify-between px-5 py-4 rounded-md"
          >
            <div>
              <span className="text-purple-800 text-sm">{job.department}</span>
              <h3 className="font-bold mt-px">{job.title}</h3>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className={`${
                    job.status === "open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  } rounded-full px-3 py-1 text-sm`}
                >
                  {job.status === "open" ? "Open" : "Closed"}
                </span>
                <span className="text-slate-600 text-sm flex gap-1 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  on-site
                </span>
              </div>
              <p className="text-gray-600 mt-2">{job.qualifications}</p>
              <p className="text-gray-600 mt-2">
                <strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}
              </p>
            </div>
            <div>
              {appliedJobs.includes(job._id) ? (
                <button
                  disabled
                  className="bg-gray-400 text-white font-medium px-4 py-2 rounded-md cursor-not-allowed"
                >
                  Already Applied
                </button>
              ) : (
                <button
                  onClick={() => handleApplyClick(job._id)}
                  className="bg-purple-900 text-white font-medium px-4 py-2 rounded-md hover:bg-purple-800 flex gap-1 items-center"
                >
                  Apply Now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}

        {!loading && jobs.length === 0 && <p className="text-center text-gray-500">No jobs available.</p>}
      </div>
    </div>
  );
};

export default JobList;
