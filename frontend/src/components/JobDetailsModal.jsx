import React from "react";

const JobDetailsModal = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">{job.title}</h2>
        <div className="space-y-4">
          <p>
            <strong>Description:</strong> {job.description}
          </p>
          <p>
            <strong>Department:</strong> {job.department}
          </p>
          <p>
            <strong>Qualifications:</strong> {job.qualifications || "N/A"}
          </p>
          <p>
            <strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong> {job.status}
          </p>
          <p>
            <strong>Post Status:</strong> {job.postStatus}
          </p>
          <p>
            <strong>Posted By:</strong> {job.postedBy ? job.postedBy.name : "N/A"}
          </p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;