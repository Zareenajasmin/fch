// src/components/Engagement.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, getDoc } from 'firebase/firestore';

function Engagement({ userId }) {
  const [engagement, setEngagement] = useState(null);

  useEffect(() => {
    const fetchEngagementData = async () => {
      const docRef = doc(db, "engagement", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEngagement(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    if (userId) fetchEngagementData();
  }, [userId]);

  if (!engagement) return <p>Loading...</p>;
  

  return (
    <div>
      <h3>Your Engagement</h3>
      <p>Tasks Completed: {engagement.tasksCompleted}</p>
      <p>Hours Logged: {engagement.hoursLogged}</p>
      <p>Points: {engagement.points}</p>
      <p>Level: {engagement.level}</p>
    </div>
  );
}

export default Engagement;
