import { useState, useEffect } from "react";
import { requests } from "../services/api";
import "./PendingRequests.css";

interface Request {
  id: number;
  requester: {
    id: number;
    username: string;
  };
  software: {
    id: number;
    name: string;
    accessLevels: string[];
  };
  accessType: string;
  reason: string;
  status: string;
  createdAt: string;
}

export default function PendingRequests() {
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await requests.getPending();
      console.log("Pending requests response:", response);
      setPendingRequests(response || []); // Ensure we always set an array
    } catch (err) {
      console.error("Error fetching pending requests:", err);
      setError("Failed to fetch pending requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (
    requestId: number,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      await requests.updateStatus(requestId, status);
      // Refresh the list after update
      fetchPendingRequests();
    } catch (err) {
      console.error("Error updating request status:", err);
      setError("Failed to update request status");
    }
  };

  if (isLoading) {
    return <div>Loading pending requests...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!pendingRequests || pendingRequests.length === 0) {
    return <div>No pending requests found.</div>;
  }

  return (
    <div className="pending-requests-container">
      <h2>Pending Access Requests</h2>
      <div className="requests-list">
        {pendingRequests.map((request) => (
          <div key={request.id} className="request-card">
            <div className="request-header">
              <h3>Request #{request.id}</h3>
              <span className="date">
                {new Date(request.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="request-details">
              <p>
                <strong>User:</strong> {request.requester.username}
              </p>
              <p>
                <strong>Software:</strong> {request.software.name}
              </p>
              <p>
                <strong>Access Type:</strong> {request.accessType}
              </p>
              <p>
                <strong>Reason:</strong> {request.reason}
              </p>
            </div>
            <div className="request-actions">
              <button
                className="approve-button"
                onClick={() => handleStatusUpdate(request.id, "APPROVED")}
              >
                Approve
              </button>
              <button
                className="reject-button"
                onClick={() => handleStatusUpdate(request.id, "REJECTED")}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
