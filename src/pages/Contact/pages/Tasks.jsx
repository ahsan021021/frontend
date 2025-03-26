import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]); // State for filtered tasks
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [statusFilter, setStatusFilter] = useState(''); // State for status filter
  const [dueDateFilter, setDueDateFilter] = useState(''); // State for due date filter
  const [loading, setLoading] = useState(true);
  const [isTaskPopupOpen, setIsTaskPopupOpen] = useState(false); // Popup state
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' }); // New task state

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const response = await axios.get('http://localhost:5000/api/tasks', { headers });
        setTasks(response.data);
        setFilteredTasks(response.data); // Initialize filtered tasks
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query)
    );
    setFilteredTasks(filtered);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    const status = e.target.value;
    setStatusFilter(status);

    if (status === '') {
      setFilteredTasks(tasks); // Show all tasks if no filter is selected
    } else {
      const filtered = tasks.filter((task) => task.status === status);
      setFilteredTasks(filtered);
    }
  };

  // Handle due date filter change
  const handleDueDateFilterChange = (dueDate) => {
    setDueDateFilter(dueDate);

    if (!dueDate) {
      setFilteredTasks(tasks); // Show all tasks if no due date is selected
      return;
    }

    const filtered = tasks.filter((task) => task.dueDate && task.dueDate.split('T')[0] === dueDate);
    setFilteredTasks(filtered);
  };

  // Handle task status change
  const handleTaskStatusChange = (taskId, newStatus) => {
    setFilteredTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  // Save task status to the backend
  const handleSaveTaskStatus = async (taskId, newStatus) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}/done`, { status: newStatus }, { headers });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
      alert('Task status updated successfully!');
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status.');
    }
  };

  // Handle task due date change
  const handleTaskDueDateChange = async (taskId, newDueDate) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${taskId}/due-date`,
        { dueDate: newDueDate },
        { headers }
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, dueDate: response.data.dueDate } : task
        )
      );
      setFilteredTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, dueDate: response.data.dueDate } : task
        )
      );
      alert('Due date updated successfully!');
    } catch (error) {
      console.error('Error updating due date:', error);
      alert('Failed to update due date.');
    }
  };

  // Handle new task input change
  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  // Add a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    try {
      const response = await axios.post('http://localhost:5000/api/tasks', newTask, { headers });
      setTasks([...tasks, response.data]); // Add the new task to the list
      setFilteredTasks([...tasks, response.data]); // Update filtered tasks
      setNewTask({ title: '', description: '', dueDate: '' }); // Reset the form
      setIsTaskPopupOpen(false); // Close the popup
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task.');
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, { headers });
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId)); // Remove the task from the list
      setFilteredTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId)); // Update filtered tasks
      alert('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task.');
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="page-content">
      <div className="tasks-header">
        <h2>Task List</h2>
        <button className="new-task-btn" onClick={() => setIsTaskPopupOpen(true)}>
          + Add Task
        </button>
      </div>
      <div className="tasks-filters">
        <input
          type="text"
          placeholder="Search by task name"
          className="task-search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select
          className="task-filter"
          value={statusFilter}
          onChange={handleStatusFilterChange}
        >
          <option value="">All Tasks</option>
          <option value="todo">To Do</option>
          <option value="done">Done</option>
        </select>
        <input
          type="date"
          className="task-due-date-filter"
          value={dueDateFilter}
          onChange={(e) => handleDueDateFilterChange(e.target.value)}
        />
      </div>
      <div className="tasks-table">
        <div className="table-header">
          <span>Name</span>
          <span>Description</span>
          <span>Status</span>
          <span>Due Date</span>
          <span>Actions</span>
        </div>
        {filteredTasks.map((task) => (
          <div key={task._id} className="table-row">
            <span>{task.title}</span>
            <span>{task.description}</span>
            <span>
              <select
                value={task.status}
                onChange={(e) => handleTaskStatusChange(task._id, e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="done">Done</option>
              </select>
            </span>
            <span>
              <input
                type="date"
                value={task.dueDate ? task.dueDate.split('T')[0] : ''}
                onChange={(e) => handleTaskDueDateChange(task._id, e.target.value)}
              />
            </span>
            <button onClick={() => handleSaveTaskStatus(task._id, task.status)}>Save</button>
            <button className="delete-task-btn" onClick={() => handleDeleteTask(task._id)}>Delete</button>
          </div>
        ))}
      </div>

      {isTaskPopupOpen && (
        <div className="popup-overlay" onClick={() => setIsTaskPopupOpen(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-popup" onClick={() => setIsTaskPopupOpen(false)}>
              ✖
            </button>
            <form className="add-task-form" onSubmit={handleAddTask}>
              <h2>Add New Task</h2>
              <div className="form-group">
                <label htmlFor="title">Task Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newTask.title}
                  onChange={handleTaskInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newTask.description}
                  onChange={handleTaskInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="dueDate">Due Date</label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleTaskInputChange}
                />
              </div>
              <button type="submit" className="submit-btn">
                Add Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;