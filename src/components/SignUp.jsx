// src/SignUpPage.jsx
import { createUserWithEmailAndPassword } from 'firebase/auth';  // Import the function to create a user
import './signup.css'
import React, { useState } from 'react';
import { auth } from '../firebase-config'; // Import the Firebase auth object
import { useNavigate } from 'react-router-dom';


const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
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
    const { email, password, name } = formData;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, formData.email, formData.password  // Use Firebase Authentication to create user
      );
      // After successful signup, navigate to sign-in page
      navigate('/signin');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);  // Display error message if any
    }
  };

  return (
    <div className="signup-page">
      <div className="form-container">

      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
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
        <button type="submit">Sign Up</button>
      </form>
      {error && <p>{error}</p>}
      <p>Already registered? <a href="/signin">Sign In</a></p>
    </div>
    </div>
  );
};

export default SignUpPage;
