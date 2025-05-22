import React, { useState } from "react";
import "./SignUpForm.css";
import { auth } from "../services/api";
import { useNavigate } from "react-router-dom";

interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  department: string;
  userType: string;
}

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    userType: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const departments = [
    "Engineering",
    "Product",
    "Marketing",
    "Sales",
    "Human Resources",
    "Finance",
    "Operations",
  ];

  const userTypes = ["Employee", "Manager", "Admin"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: "Passwords do not match!", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await auth.signup(
        formData.username,
        formData.password,
        formData.department,
        formData.userType
      );
      console.log("response >>>", response);

      // const data = await response.json();

      if (!response.token || !response.user) {
        throw new Error(response.message || "Failed to create account");
      }

      setMessage({ text: "Account created successfully!", type: "success" });
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        department: "",
        userType: "",
      });

      // Redirect to login page after successful signup
      setTimeout(() => {
        console.log("navigating to login");
      navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage({
        text:
          error instanceof Error
            ? error.message
            : "Failed to create account. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Create Account</h2>
        <p className="subtitle">Join our software access management platform</p>

        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <div className="form-group">
          <label htmlFor="username">
            Username
            <span className="required">*</span>
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your username"
            required
            minLength={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email Address
            <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">
            Department
            <span className="required">*</span>
          </label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select your department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="userType">
            User Type
            <span className="required">*</span>
          </label>
          <select
            id="userType"
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select user type</option>
            {userTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="password-group">
          <div className="form-group">
            <label htmlFor="password">
              Password
              <span className="required">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Create password"
              required
              minLength={8}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password
              <span className="required">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-control"
              placeholder="Confirm password"
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? (
            <span className="loading-text">Creating Account...</span>
          ) : (
            "Sign Up"
          )}
        </button>

        <p className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;
