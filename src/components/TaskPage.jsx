// TaskPage.js
import React, { useState } from 'react';
import Timer from './Timer';
import TimeLogs from './TimeLogs';

const TaskPage = ({ taskId }) => {
  return (
    <div>
      <h1>Task Details</h1>
      <Timer taskId={taskId} />
      <TimeLogs taskId={taskId} />
    </div>
  );
};

export default TaskPage;
