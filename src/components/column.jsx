// Column.js
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import Task from './Task';

const Column = ({ column, tasks }) => {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div className="column" ref={setNodeRef}>
      <h2>{column.name}</h2>
      <div className="task-list">
        {tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Column;
