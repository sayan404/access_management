import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LoginForm } from "./components/LoginForm";
import { RequestAccessForm } from "./components/RequestAccessForm";
import CreateSoftwareForm from "./components/CreateSoftwareForm";
import PendingRequests from "./components/PendingRequests";
import "./styles/global.css";
import SignUpForm from "./components/SignUpForm";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected routes with Navbar */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route
                path="/create-software"
                element={
                  <>
                    <Navbar />
                    <main className="main-content">
                      <CreateSoftwareForm />
                    </main>
                  </>
                }
              />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
              <Route
                path="/request-access"
                element={
                  <>
                    <Navbar />
                    <main className="main-content">
                      <RequestAccessForm />
                    </main>
                  </>
                }
              />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
              <Route
                path="/pending-requests"
                element={
                  <>
                    <Navbar />
                    <main className="main-content">
                      <PendingRequests />
                    </main>
                  </>
                }
              />
            </Route>

            {/* Routes without Navbar */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
