import React, { useState, useEffect } from "react";
import { Software } from "../types";
import { software, requests, AccessLevel } from "../services/api";
import "./RequestAccessForm.css";

export const RequestAccessForm: React.FC = () => {
  const [softwareList, setSoftwareList] = useState<Software[]>([]);
  const [selectedSoftware, setSelectedSoftware] = useState("");
  const [accessType, setAccessType] = useState("Read");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const accessLevelOptions = Object.values(AccessLevel).map((level) => ({
    value: level,
    label: level.charAt(0) + level.slice(1).toLowerCase(),
  }));

  useEffect(() => {
    const fetchSoftware = async () => {
      const response = await software.getAll();
      setSoftwareList(response.data);
    };
    fetchSoftware();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await requests.create({
        softwareId: parseInt(selectedSoftware),
        accessType: accessType as AccessLevel,
        reason,
        userType: "Employee",
      });
      setMessage({ text: "Request submitted successfully!", type: "success" });
      setSelectedSoftware("");
      setAccessType("Read");
      setReason("");
    } catch (error) {
      setMessage({
        text: "Failed to submit request. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(null), 5000); // Clear message after 5 seconds
    }
  };

  return (
    <div className="request-access-container">
      <form onSubmit={handleSubmit} className="request-access-form">
        <h2>Request Software Access</h2>

        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <div className="form-group">
          <label htmlFor="software">Software:</label>
          <select
            id="software"
            value={selectedSoftware}
            onChange={(e) => setSelectedSoftware(e.target.value)}
            required
            className="form-control"
          >
            <option value="">Select Software</option>
            {softwareList.map((sw) => (
              <option key={sw.id} value={sw.id}>
                {sw.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="accessType">Access Type:</label>
          <div className="access-type-buttons">
            <select
              value={accessType}
              onChange={(e) => setAccessType(e.target.value as AccessLevel)}
            >
              {accessLevelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reason">Reason:</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="form-control"
            placeholder="Please explain why you need access..."
            rows={4}
          />
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
};
