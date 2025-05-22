import React from 'react';

const PendingRequests: React.FC = () => {
  return (
    <div className="pending-requests-container">
      <h1>Pending Access Requests</h1>
      <p>This page is only accessible to managers.</p>
      {/* Add your list of pending requests here */}
    </div>
  );
};

export default PendingRequests; 