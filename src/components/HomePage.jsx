import React from 'react';
import{ useState}from 'react';

import {Link, NavLink} from 'react-router-dom';

import './HomePage.css';
const HomePage = () => {
  // State to track whether the user has clicked the "Explore Features" button
  const [isExplored, setIsExplored] = useState(false);

  // Function to handle button click
  const handleExploreClick = () => {
    setIsExplored(true); // Set state to true when the button is clicked
  };
  return (
    <div className="homepage">
      <h1>Welcome to the Freelance Project Collaboration Hub!</h1>
      <p>"Empowering remote teams to achieve more—together, wherever you are."</p>
      
      <p1><strong>WHERE INNOVATION MEETS COLLABORATION.</strong></p1>      <section>
        <p>
        Collaborate effortlessly with tools designed to simplify your workflow. 
        From managing tasks to sharing ideas, we bring your freelance team closer, 
        enabling success every step of the way.

        </p>
      </section>

            


      <button onClick={handleExploreClick}>Explore Features</button>


      {/* Example feature cards */}
      {isExplored && (
        <>
      <div className="feature-card">
      <h2>
          {/* NavLink automatically adds 'active' class when the route is active */}
          <NavLink 
            to="/project-board" 
            className="feature-link" 
            activeClassName="feature-link-active"  // This class is applied when the link is active
          >
            Task Management
          </NavLink>
        </h2>
        <p>Organize and manage your tasks effectively with our intuitive board.</p>
      </div>

      <div className="feature-card">
      <h2>
          <NavLink 
            to="/workspace" 
            className="feature-link" 
            activeClassName="feature-link-active"
          >
            Shared Workspace
          </NavLink>
        </h2>   
        <p>Seamlessly upload and share files with your team.</p>
      </div>

      <div className="feature-card">
            <h2>
              <NavLink 
                to="/time-tracking" 
                className="feature-link" 
                activeClassName="feature-link-active"
              >
                Time Tracking
              </NavLink>
            </h2>
            <p>Track the time spent on various tasks and manage your work schedule.</p>
          </div>
        </>
      )}

    </div>
  );
};

export default HomePage;
