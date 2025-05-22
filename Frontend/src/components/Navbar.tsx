import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Software Access Management</Link>
      </div>
      <div className="navbar-menu">
        {user?.role.toLowerCase() === 'admin' && (
          <Link to="/create-software" className="navbar-item">Create Software</Link>
        )}
        {user?.role.toLowerCase() === 'employee' && (
          <Link to="/request-access" className="navbar-item">Request Access</Link>
        )}
        {user?.role.toLowerCase() === 'manager' && (
          <Link to="/pending-requests" className="navbar-item">Pending Requests</Link>
        )}
      </div>
      <div className="navbar-end">
        <span className="user-info">
          Welcome, {user?.username} ({user?.role})
        </span>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 