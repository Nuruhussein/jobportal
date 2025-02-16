import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import JobDetailsModal from "../components/JobDetailsModal";

function Jobstable() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null); // Track the selected job for the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility

  // Fetch jobs from the backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You are not allowed to do!");
          return;
        }
        const response = await axios.get("http://localhost:5000/jobs/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in!");
        return;
      }

      await axios.delete(`http://localhost:5000/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));

      // Show success alert
      alert("Job deleted successfully!");
    } catch (error) {
      const errorMsg = error.response?.data?.error || "An error occurred while deleting the job.";
      alert(errorMsg);
    }
  };

  // Open the modal with job details
  const openModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setSelectedJob(null);
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-screen-xl mt-10 mx-auto px-4 md:px-8">
        <div className="items-start justify-between md:flex">
          <div className="max-w-lg">
            <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
              Job Listings
            </h3>
            <p className="text-gray-600 mt-2">
              Manage all the job postings from this dashboard.
            </p>
          </div>
          <div className="mt-3 md:mt-0">
            <a
              href="/admin/addjobs"
              className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm"
            >
              Add Job
            </a>
          </div>
        </div>
        <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
          <table className="w-full table-auto text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
              <tr>
                <th className="py-3 px-6">Title</th>
                <th className="py-3 px-6">Department</th>
                <th className="py-3 px-6">Posted By</th>
                <th className="py-3 px-6">Deadline</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">postStatus</th>
                <th className="py-3 px-6">Applications</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y">
              {jobs.map((job) => (
                <tr
                  key={job._id}
                  onClick={() => openModal(job)} // Open modal when clicking a row
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{job.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{job.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {job.postedBy ? job.postedBy.name : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(job.deadline).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{job.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{job.postStatus}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={`/admin/applications/${job._id}`}
                      className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg"
                      onClick={(e) => e.stopPropagation()} // Prevent row click from triggering
                    >
                      View Applications
                    </a>
                  </td>
                  <td className="text-right px-6 whitespace-nowrap">
                    <a
                      href={`/edit-job/${job._id}`}
                      className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg"
                      onClick={(e) => e.stopPropagation()} // Prevent row click from triggering
                    >
                      Edit
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click from triggering
                        handleDelete(job._id);
                      }}
                      className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg"
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

      {/* Render the modal */}
      {isModalOpen && (
        <JobDetailsModal job={selectedJob} onClose={closeModal} />
      )}
    </DashboardLayout>
  );
}

export default Jobstable;