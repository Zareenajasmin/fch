// src/SignInPage.jsx

import React, { useState } from 'react';
import './signin.css'
import { auth } from '../firebase-config'; // Import the Firebase auth object
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth"; // Import the signInWithEmailAndPassword method



const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      // Sign in with Firebase Authentication using the method from Firebase SDK
      await signInWithEmailAndPassword(auth, email, password);

      // Redirect to homepage after successful login
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="signin-page">
            <div className="form-container">

      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Sign In</button>
      </form>
      {error && <p>{error}</p>}
      <p>Don't have an account? <a href="/signup">Sign Up</a></p>
    </div>
    </div>
  );
};

export default SignInPage;
