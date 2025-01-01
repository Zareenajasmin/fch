// TimeLogs.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TimeLogs = ({ taskId }) => {
  const [timeLogs, setTimeLogs] = useState([]);

  useEffect(() => {
    const fetchTimeLogs = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/time-log/${taskId}`);
        setTimeLogs(response.data);
      } catch (error) {
        console.error('Error fetching time logs:', error);
      }
    };

    fetchTimeLogs();
  }, [taskId]);

  return (
    <div>
      <h3>Time Logs</h3>
      <ul>
        {timeLogs.map((log) => (
          <li key={log.id}>
            {log.startTime} - {log.endTime} | {log.time} seconds
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimeLogs;
