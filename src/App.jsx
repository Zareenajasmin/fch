import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, Navigate} from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import DashboardPage from './components/DashboardPage'; // Your dashboard or home page
import TaskPage from './components/TaskPage';
import HomePage from './components/HomePage';
import ProjectBoard from './components/ProjectBoard'; // Import the ProjectBoard component
import WorkspacePage from './components/WorspacePage';
import { getAuthToken } from './services/authService'; // Helper function to check token

const ProtectedRoute = ({ element }) => {
  const token = getAuthToken();
  return token ? element : <Navigate to="/login" />;
};

const App = () => {
  const location = useLocation(); // Get current route location
  
  const showSidebar = location.pathname === '/'; // Show sidebar only on HomePage

  return (
    <div className="app">
      {showSidebar && (
        <div className="sidebar">
          <h2></h2>
          <ul>

          </ul>
        </div>
      )}
      
      <div className="content">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={<HomePage />} /> {/* HomePage route */}
          <Route path="/project-board" element={<ProjectBoard />} /> {/* Project Board route */}
          <Route path="/workspace" element={<WorkspacePage />} /> {/* Shared Workspace page route */}
          <Route path="/time-tracking" element={<TaskPage />} /> {/* Shared Workspace page route */}

          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

          {/* Add other routes here */}
        </Routes>
      </div>
    </div>
  );
};

export default App;
