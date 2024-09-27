import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/Tasks.css'; // Import the CSS file

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('pending');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState(''); // Add error state
  const [validationErrors, setValidationErrors] = useState({}); // Add validation errors state

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    };
    fetchTasks();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!title) errors.title = 'Title is required';
    if (!description) errors.description = 'Description is required';
    if (!dueDate) errors.dueDate = 'Due date is required';
    if (!status) errors.status = 'Status is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});
    try {
      if (editingTask) {
        const response = await axios.patch(
          `${process.env.REACT_APP_API_URL}/tasks/${editingTask._id}`,
          { title, description, dueDate, status },
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        setTasks(tasks.map((task) => (task._id === editingTask._id ? response.data : task)));
        setEditingTask(null);
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/tasks`,
          { title, description, dueDate, status },
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        setTasks([...tasks, response.data]);
      }
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('pending');
      setError(''); // Clear any previous error
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error); // Set error message from server
      } else {
        setError('An error occurred. Please try again.'); // Set a generic error message
      }
      console.error(error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
    setStatus(task.status);
  };

  const handleDelete = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredTasks = tasks
    .filter((task) => (filterStatus ? task.status === filterStatus : true))
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });

  const isFormValid = title && description && dueDate && status;

  return (
    <div className="tasks-container">
      <h2>Tasks</h2>
      <form onSubmit={handleSubmit} className="task-form">
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="task-input"
        />
        {validationErrors.title && <p style={{ color: 'red' }}>{validationErrors.title}</p>}
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="task-input"
        />
        {validationErrors.description && <p style={{ color: 'red' }}>{validationErrors.description}</p>}
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="task-input"
        />
        {validationErrors.dueDate && <p style={{ color: 'red' }}>{validationErrors.dueDate}</p>}
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="task-select">
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        {validationErrors.status && <p style={{ color: 'red' }}>{validationErrors.status}</p>}
        <button type="submit" className="task-button" disabled={!isFormValid}>
          {editingTask ? 'Update Task' : 'Add Task'}
        </button>
      </form>
      <div className="task-filters">
        <h3>Filter and Sort</h3>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="task-select">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="task-select">
          <option value="">Sort By</option>
          <option value="dueDate">Due Date</option>
        </select>
      </div>
      <ul className="task-list">
        {filteredTasks.map((task) => (
          <li key={task._id} className="task-item">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
            <p>Status: {task.status}</p>
            <button onClick={() => handleEdit(task)} className="task-button">Edit</button>
            <button onClick={() => handleDelete(task._id)} className="task-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tasks;