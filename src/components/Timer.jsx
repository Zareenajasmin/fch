// Timer.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Timer = ({ taskId }) => {
  const [time, setTime] = useState(0); // Time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  // Handle Start/Stop Button
  const handleToggleTimer = () => {
    if (isRunning) {
      clearInterval(intervalId);
      setIsRunning(false);
      // Send logged time to the backend (post request)
      axios.post('http://localhost:5000/time-log', {
        taskId: taskId,
        time: time,
        endTime: new Date(),
      });
    } else {
      setIsRunning(true);
      // Start the timer
      const id = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
      setIntervalId(id);
    }
  };

  // Handle Reset Button
  const handleReset = () => {
    setTime(0);
    clearInterval(intervalId);
    setIsRunning(false);
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalId); // Cleanup when component unmounts
    };
  }, [intervalId]);

  return (
    <div>
      <h3>Time: {Math.floor(time / 60)}:{time % 60}</h3>
      <button onClick={handleToggleTimer}>{isRunning ? 'Stop' : 'Start'}</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default Timer;
