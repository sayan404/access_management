import React, { useState } from "react";
import { software } from "../services/api";
import "./CreateSoftwareForm.css";

const CreateSoftwareForm: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [accessLevels, setAccessLevels] = useState<string[]>(["Read"]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await software.create({
        name,
        description,
        accessLevels,
      });
      setMessage({ text: "Software created successfully!", type: "success" });
      setName("");
      setDescription("");
      setAccessLevels(["Read"]);
    } catch (err) {
      setMessage({
        text: "Failed to create software. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleAccessLevelToggle = (level: string) => {
    if (accessLevels.includes(level)) {
      // Don't allow removing the last access level
      if (accessLevels.length > 1) {
        setAccessLevels(accessLevels.filter((l) => l !== level));
      }
    } else {
      setAccessLevels([...accessLevels, level]);
    }
  };

  return (
    <div className="create-software-container">
      <form onSubmit={handleSubmit} className="create-software-form">
        <h2>Create New Software</h2>

        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <div className="form-group">
          <label htmlFor="name">Software Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
            placeholder="Enter software name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
            placeholder="Describe the software and its purpose..."
            rows={4}
            required
          />
        </div>

        <div className="form-group">
          <label>Access Levels</label>
          <div className="access-levels-grid">
            {["Read", "Write", "Admin"].map((level) => (
              <button
                key={level}
                type="button"
                className={`access-level-button ${
                  accessLevels.includes(level) ? "active" : "not-active"
                }`}
                onClick={() => handleAccessLevelToggle(level)}
              >
                <span className="access-level-icon">
                  {accessLevels.includes(level) ? "✓" : "+"}
                </span>
                {level}
              </button>
            ))}
          </div>
          <small className="help-text">
            Select at least one access level for the software
          </small>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isLoading || accessLevels.length === 0}
        >
          {isLoading ? (
            <span className="loading-text">Creating Software...</span>
          ) : (
            "Create Software"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateSoftwareForm;
