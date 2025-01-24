import { useState } from 'react';

function ContactList({ contacts, onAddNew }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedContacts(contacts.map(c => c.id));
    } else {
      setSelectedContacts([]);
    }
  };

  return (
    <div className="contacts-container">
      <div className="contacts-header">
        <h1>Contacts</h1>
        <div className="contacts-actions">
          <input
            type="text"
            placeholder="Search contacts..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn-primary" onClick={onAddNew}>
            Add Contact
          </button>
        </div>
      </div>

      <div className="contacts-table">
        <div className="table-header">
          <input
            type="checkbox"
            onChange={handleSelectAll}
            checked={selectedContacts.length === contacts.length}
          />
          <span>Name</span>
          <span>Email</span>
          <span>Phone</span>
          <span>Company</span>
          <span>Tags</span>
          <span>Actions</span>
        </div>
        
        {filteredContacts.map(contact => (
          <div key={contact.id} className="table-row">
            <input
              type="checkbox"
              checked={selectedContacts.includes(contact.id)}
              onChange={() => {
                if (selectedContacts.includes(contact.id)) {
                  setSelectedContacts(selectedContacts.filter(id => id !== contact.id));
                } else {
                  setSelectedContacts([...selectedContacts, contact.id]);
                }
              }}
            />
            <div className="contact-name">
              <img src={contact.avatar} alt={contact.name} className="contact-avatar" />
              <span>{contact.name}</span>
            </div>
            <span>{contact.email}</span>
            <span>{contact.phone}</span>
            <span>{contact.company}</span>
            <div className="contact-tags">
              {contact.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            <div className="row-actions">
              <button className="btn-icon">✏️</button>
              <button className="btn-icon">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContactList;