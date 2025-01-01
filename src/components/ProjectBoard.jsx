import React, { useState, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import Column from './column';
import Task from './Task';
import { FaCalendarAlt, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import moduleName from './ProjectBoard.css';

const ProjectBoard = () => {
  const initialColumns = [
    { id: '1', name: 'To-Do' },
    { id: '2', name: 'In Progress' },
    { id: '3', name: 'Done' },
  ];

  const [tasks, setTasks] = useState([]); // Initialize tasks as empty, it will be fetched from Firestore
  const [newTask, setNewTask] = useState({
    name: '',
    deadline: '',
    columnId: '1',
  });

  // Fetch tasks from the backend (Firebase) when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:5000/tasks') // Update with your backend URL
      .then((response) => {
        setTasks(response.data); // Set tasks state with the data from Firestore
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }, []); // The empty array means this will run only once when the component is mounted

  const handleCreateTask = () => {
    if (newTask.name && newTask.deadline) {
      // Send the new task to the backend (Node.js + Firebase)
      axios
        .post('http://localhost:5000/tasks', newTask) // Update with your backend URL
        .then((response) => {
          // After successful task creation in Firebase, add it to the state
          setTasks([...tasks, response.data]);
          setNewTask({ name: '', deadline: '', columnId: '1' }); // Reset the form
        })
        .catch((error) => {
          console.error('Error creating task:', error);
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over) {
      const updatedTasks = [...tasks];
      const taskIndex = updatedTasks.findIndex((task) => task.id === active.id);
      const movedTask = updatedTasks.splice(taskIndex, 1)[0];
      movedTask.columnId = over.id;
      updatedTasks.splice(over.index, 0, movedTask);
      setTasks(updatedTasks);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="project-board">
        <div className="task-creation-form">
          <h3>Create a New Task</h3>

          {/* Form container - Side by side layout */}
          <div className="form-container">
            {/* Task Name */}
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={newTask.name}
                onChange={handleInputChange}
                placeholder="Task Name"
                className="form-input"
              />
              <label className="floating-label">Task Name</label>
            </div>

            {/* Deadline */}
            <div className="form-group">
              <div className="icon-input">
                <FaCalendarAlt className="calendar-icon" />
                <input
                  type="date"
                  name="deadline"
                  value={newTask.deadline}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <label className="floating-label">Deadline</label>
            </div>

            {/* Task Status */}
            <div className="form-group">
              <select
                name="columnId"
                value={newTask.columnId}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="1">To-Do</option>
                <option value="2">In Progress</option>
                <option value="3">Done</option>
              </select>
              <label className="floating-label">Status</label>
            </div>
          </div>

          {/* Create Task Button */}
          <button onClick={handleCreateTask} className="create-task-btn">
            <FaPlus className="plus-icon" />
            Create Task
          </button>
        </div>

        {/* Display Columns */}
        {initialColumns.map((column) => (
          <Column key={column.id} column={column} tasks={tasks.filter((task) => task.columnId === column.id)} />
        ))}
      </div>
    </DndContext>
  );
};

export default ProjectBoard;
