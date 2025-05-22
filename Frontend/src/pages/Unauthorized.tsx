import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Unauthorized.css";

const Unauthorized: React.FC = () => {
  const { user } = useAuth();

  const getRedirectLink = () => {
    if (!user) return "/login";

    switch (user.role.toLowerCase()) {
      case "admin":
        return "/create-software";
      case "employee":
        return "/request-access";
      case "manager":
        return "/pending-requests";
      default:
        return "/";
    }
  };

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <h1>Access Denied</h1>
        <div className="unauthorized-icon">⚠️</div>
        <p>You don't have permission to access this page.</p>
        <Link to={getRedirectLink()} className="redirect-button">
          Go to your dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
