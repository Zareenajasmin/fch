import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin'); // Redirect to the sign-in page after logout
  };

  return (
    <div className="dashboard-page">
      <h1>Welcome to your Dashboard!</h1>
      <p>Here, you can manage your workspaces and projects.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardPage;
