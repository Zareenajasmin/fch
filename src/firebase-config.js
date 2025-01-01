// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";  // Import Firebase Authentication

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiszQfKm9v_NAldwGcbXxM7Xs-_j05bgs",
  authDomain: "fchh-af14f.firebaseapp.com",
  projectId: "fchh-af14f",
  storageBucket: "fchh-af14f.firebasestorage.app",
  messagingSenderId: "1027066244302",
  appId: "1:1027066244302:web:5acddb89b1e759ea33749f",
  measurementId: "G-5D3REJ8YC0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);  // Initialize Firebase Authentication


export { app, auth,analytics };