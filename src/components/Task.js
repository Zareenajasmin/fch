// src/components/Task.js
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import './Task.css'; // Importing external CSS file for task styling

const Task = ({ task }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`task ${isDragging ? 'dragging' : ''}`}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',  // Apply the grabbing cursor while dragging
      }}
    >
      <p>{task.name}</p>
      <p>Deadline: {task.deadline}</p>
    </div>
  );
};

export default Task;
