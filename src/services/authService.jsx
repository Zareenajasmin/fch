// src/services/authService.js

// To store token after login
export const setAuthToken = (token) => {
  if (token) {
    // Store token in localStorage
    localStorage.setItem('token', token);
  } else {
    // If no token, remove it from localStorage
    localStorage.removeItem('token');
  }
};

// To retrieve token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// To check if the user is logged in (based on token existence)
export const isAuthenticated = () => {
  const token = getAuthToken();
  return token ? true : false;
};
