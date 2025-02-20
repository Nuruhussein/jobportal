import { useState, useEffect } from "react";
import axios from "axios";

const Announcement = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/applications/user/status", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setStatus(response.data.status);
        setData(response.data); // Store the entire response data
      } catch (error) {
        console.error("Error fetching application status:", error);
        setError("Failed to fetch application status. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationStatus();
  }, []);

  if (loading) {
    return <div className="">Loading...</div>; // Show a loading message
  }

  if (error) {
    return <div className="">{error}</div>; // Show an error message
  }

  return (
    <div className="py-14">
      {status === "accepted" && (
        <div>
          <h1 className="text-3xl font-bold text-green-600">
            🎉 Congratulations! Your application for the job <span className="underline">{data.jobTitle}</span> has been accepted.
          </h1>
          <h1 className="text-3xl font-bold text-green-600">
            You can come and connect with our university officers.
          </h1>
        </div>
      )}
      {status === "pending" && (
        <h1 className="text-3xl font-bold text-yellow-600">
          ⏳ Your application for the job <span className="underline">{data.jobTitle}</span> is still under review.
        </h1>
      )}
      {status === "rejected" && (
        <h1 className="text-3xl font-bold text-red-600">
          ❌ Unfortunately, your application for the job <span className="underline">{data.jobTitle}</span> has been rejected.
        </h1>
      )}
      {status === "no_application" && (
        <h1 className="text-3xl font-bold text-blue-600">
          📝 You haven't submitted an application yet.
        </h1>
      )}
    </div>
  );
};

export default Announcement;