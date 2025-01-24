function Companies() {
  return (
    <div className="page-content">
      <div className="companies-header">
        <h2>Companies</h2>
        <span className="company-count">0 Companies</span>
        <button className="add-company-btn">+ Add Company</button>
      </div>
      <div className="companies-filters">
        <button className="list-view-btn">List</button>
        <div className="advanced-filters">
          <button>Advanced Filters</button>
          <button>Sort (1)</button>
        </div>
        <input type="text" placeholder="Search" className="company-search" />
        <button className="manage-fields-btn">Manage Fields</button>
      </div>
      <div className="companies-table">
        <div className="table-header">
          <input type="checkbox" />
          <span>Company Name</span>
          <span>Phone</span>
          <span>Email</span>
          <span>Website</span>
          <span>Address</span>
          <span>State</span>
          <span>City</span>
          <span>Description</span>
          <span>Postal Code</span>
          <span>Country</span>
          <span>Created At (EST)</span>
          <span>Updated At (EST)</span>
          <span>Created By</span>
        </div>
        {/* Companies content */}
      </div>
    </div>
  );
}

export default Companies;