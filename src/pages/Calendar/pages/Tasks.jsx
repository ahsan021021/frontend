function Tasks() {
  return (
    <div className="page-content">
      <div className="tasks-header">
        <h2>Task List</h2>
        <button className="new-task-btn">+ New Task</button>
      </div>
      <div className="tasks-filters">
        <input type="text" placeholder="Search by task name" className="task-search" />
        <select className="task-filter">
          <option>Contact</option>
        </select>
        <select className="task-filter">
          <option>Assignee</option>
        </select>
        <select className="task-filter">
          <option>Status</option>
        </select>
        <select className="task-filter">
          <option>Due Date (DESC)</option>
        </select>
      </div>
      <div className="tasks-table">
        <div className="table-header">
          <span>Name & Description</span>
          <span>Contact</span>
          <span>Assignee</span>
          <span>Due Date</span>
          <span>Status</span>
        </div>
        {/* Tasks content */}
      </div>
    </div>
  );
}

export default Tasks;