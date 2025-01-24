function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">CRM Suite</div>
      <div className="nav-menu">
        <button className="nav-item active">Contacts</button>
        <button className="nav-item">Companies</button>
        <button className="nav-item">Tasks</button>
        <button className="nav-item">Reports</button>
      </div>
      <div className="nav-profile">
        <img 
          src="https://ui-avatars.com/api/?name=Admin&background=random" 
          alt="Profile" 
          className="profile-avatar"
        />
      </div>
    </nav>
  );
}

export default Navbar;