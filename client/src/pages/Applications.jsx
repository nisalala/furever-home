import React, { useEffect, useState } from "react";
import axios from "axios";

const Applications = () => {
  const [sentApplications, setSentApplications] = useState([]);
  const [receivedApplications, setReceivedApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = "http://localhost:5002";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);

        // Sent applications
        const sentRes = await axios.get(`${backendUrl}/api/applications/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Received applications
        const receivedRes = await axios.get(`${backendUrl}/api/applications/received`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSentApplications(sentRes.data);
        setReceivedApplications(receivedRes.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token]);

  const handleApprove = async (id, note = "") => {
    try {
      await axios.put(
        `${backendUrl}/api/applications/${id}/approve`,
        { approvalNote: note },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReceivedApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status: "Approved", approvalNote: note } : app
        )
      );
      alert("Application approved!");
    } catch (err) {
      console.error(err);
      alert("Failed to approve application.");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(
        `${backendUrl}/api/applications/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReceivedApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status: "Rejected" } : app
        )
      );
      alert("Application rejected.");
    } catch (err) {
      console.error(err);
      alert("Failed to reject application.");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  // Helper to get badge color
  const statusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* Sent Applications */}
<section className="bg-white p-6 rounded-xl shadow-md">
  <h2 className="text-xl font-semibold mb-4">📤 Sent Applications</h2>
  {sentApplications.length === 0 ? (
    <p className="text-gray-600">No applications sent yet.</p>
  ) : (
    <div className="grid gap-4">
      {sentApplications.map((app) => (
        <div
          key={app._id}
          className="flex flex-col md:flex-row bg-gray-50 border rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Left: Pet Info */}
          <div className="flex items-center gap-4 md:w-1/3">
            <img
  src={
    app.pet.images && app.pet.images.length > 0
      ? `${backendUrl}/${app.pet.images[0].replace(/^\/+/, '')}`
      : "/default-pet.png"
  }
  alt={app.pet.name}
  className="w-24 h-24 object-cover rounded-md"
/>

            <div>
              <p className="font-semibold text-lg">{app.pet.name}</p>
              <p className="text-sm text-gray-500">{app.pet.breed}</p>
              <p className="text-sm text-gray-500">{app.pet.size} • {app.pet.gender}</p>
              {app.pet.status && (
                <span
                  className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    app.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : app.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {app.status}
                </span>
              )}
            </div>
          </div>

          {/* Right: Application Message & Note */}
          <div className="flex flex-col justify-between md:w-2/3 mt-4 md:mt-0 md:pl-6">
            <div>
              {app.message && (
                <p className="text-gray-600 mb-2">
                  <strong>Message:</strong> "{app.message}"
                </p>
              )}
              {app.approvalNote && (
                <p className="text-gray-600">
                  <strong>Note:</strong> {app.approvalNote}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</section>


      {/* Received Applications */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">📩 Received Applications</h2>
        {receivedApplications.length === 0 ? (
          <p className="text-gray-600">No applications received yet.</p>
        ) : (
          <div className="grid gap-4">
            {receivedApplications.map((app) => (
              <div
                key={app._id}
                className="flex flex-col md:flex-row bg-gray-50 border rounded-lg p-4 md:p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
              >
                {/* Left: Applicant Info */}
                <div className="flex items-center gap-4 md:w-1/3">
                  <img
                    src={
                      app.applicant.profilePicture
                        ? `${backendUrl}/${app.applicant.profilePicture}`
                        : "/default-profile.png"
                    }
                    alt={app.applicant.name}
                    className="w-24 h-24 rounded-md object-cover"
                  />
                  <div>
                    <p className="font-semibold text-lg">{app.applicant.name}</p>
                    <p className="text-sm text-gray-500">{app.applicant.email}</p>
                    {app.applicant.location && (
                      <p className="text-sm text-gray-500">
                        {Object.values(app.applicant.location).join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Pet Info & Message */}
                <div className="flex flex-col justify-between md:w-2/3 mt-4 md:mt-0 md:pl-6">
                  <p className="font-medium">
                    Applied for <strong>{app.pet.name}</strong> —{" "}
                    <span className="italic">{app.status}</span>
                  </p>
                  {app.message && (
                    <p className="mt-2 text-gray-600">Message: "{app.message}"</p>
                  )}
                  {app.approvalNote && (
                    <p className="mt-1 text-gray-600">Note: {app.approvalNote}</p>
                  )}

                  {/* Approve/Reject Buttons */}
                  {app.status === "Pending" && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => {
                          const note = prompt("Enter approval note (optional):", "");
                          handleApprove(app._id, note);
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(app._id)}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Applications;
