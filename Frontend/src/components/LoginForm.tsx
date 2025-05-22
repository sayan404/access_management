import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./LoginForm.css";

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await auth.login(username, password);
      console.log("User:", response);

      // Store the token in localStorage
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      // Use the login function from AuthContext
      login(response.user);

      switch (response.user.role.toLowerCase()) {
        case "admin":
          navigate("/create-software");
          break;
        case "employee":
          navigate("/request-access");
          break;
        case "manager":
          navigate("/pending-requests");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* <img src="/logo.png" alt="Logo" className="login-logo" /> */}
        <h2>Welcome Back!</h2>
        <p className="login-subtitle">Please sign in to continue</p>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
              className="input-field"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="input-field"
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <div className="loading-spinner-container">
                <span className="loading-spinner"></span>
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="create-account-text">
            Don't have an account?{" "}
            <a href="/signup" className="create-account-link">
              Create Account
            </a>
          </p>
          {/* <a href="/forgot-password" className="forgot-password">
            Forgot Password?
          </a> */}
        </div>
      </div>
    </div>
  );
};
