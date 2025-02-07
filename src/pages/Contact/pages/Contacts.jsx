import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Contacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [newContact, setNewContact] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    created: new Date().toISOString()
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('https://lead-savvy-backend-in-progress.onrender.com/api/contacts');
        setContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(contact =>
    (contact.name && contact.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleContactClick = (contact) => {
    setPopupContent(contact);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupContent(null);
  };

  const handleAddContactClick = () => {
    setPopupContent('add');
    setIsPopupOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://lead-savvy-backend-in-progress.onrender.com/api/contacts', newContact);
      setContacts([...contacts, response.data]);
      setNewContact({
        name: '',
        company: '',
        email: '',
        phone: '',
        created: new Date().toISOString()
      });
      closePopup();
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await axios.delete(`https://lead-savvy-backend-in-progress.onrender.com/api/contacts/${id}`);
      setContacts(contacts.filter(contact => contact._id !== id));
      setSelectedContacts(selectedContacts.filter(selectedId => selectedId !== id));
      closePopup();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleDeleteSelectedContacts = async () => {
    if (selectedContacts.length === 0) {
      alert("No contacts selected for deletion.");
      return;
    }
    try {
      await Promise.all(selectedContacts.map(id => axios.delete(`https://lead-savvy-backend-in-progress.onrender.com/api/contacts/${id}`)));
      setContacts(contacts.filter(contact => !selectedContacts.includes(contact._id)));
      setSelectedContacts([]);
    } catch (error) {
      console.error('Error deleting selected contacts:', error);
    }
  };

  return (
    <div className="page-content">
      <div className="toolbar">
        <div className="left-tools">
          <button className="tool-btn" title="Add Contact" onClick={handleAddContactClick}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"/>
            </svg>
          </button>
          <button className="tool-btn" title="Delete Selected Contacts" onClick={handleDeleteSelectedContacts}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </button>
        </div>
        <div className="right-tools">
          <input 
            type="text" 
            placeholder="Quick search" 
            className="search-input" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="contacts-table">
        <div className="table-header">
          <input 
            type="checkbox" 
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedContacts(contacts.map(c => c._id));
              } else {
                setSelectedContacts([]);
              }
            }}
          />
          <span>Name</span>
          <span>Company</span>
          <span>Email</span>
          <span>Phone</span>
          <span>Created</span>
        </div>
        {filteredContacts.map(contact => (
          <div key={contact._id} className="table-row">
            <input 
              type="checkbox"
              checked={selectedContacts.includes(contact._id)}
              onChange={() => {
                if (selectedContacts.includes(contact._id)) {
                  setSelectedContacts(selectedContacts.filter(id => id !== contact._id));
                } else {
                  setSelectedContacts([...selectedContacts, contact._id]);
                }
              }}
            />
            <div className="name-cell" onClick={() => handleContactClick(contact)}>
              <div className="avatar">{contact.name ? contact.name[0] : ''}</div>
              <div className="contact-info">
                <div className="contact-name">{contact.name}</div>
                <div className="contact-company">{contact.company}</div>
              </div>
            </div>
            <span>{contact.company}</span>
            <span>{contact.email}</span>
            <span>{contact.phone}</span>
            <span>{new Date(contact.created).toLocaleString()}</span>
          </div>
        ))}
      </div>

      {isPopupOpen && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-popup" onClick={closePopup}>✖</button>
            {popupContent === 'add' ? (
              <form className="add-contact-form" onSubmit={handleAddContact}>
                <h2>Add New Contact</h2>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newContact.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="company">Company</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={newContact.company}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newContact.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={newContact.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <button type="submit" className="submit-btn">Add Contact</button>
              </form>
            ) : (
              popupContent && (
                <div className="contact-details">
                  <h2>{popupContent.name}</h2>
                  <p><strong>Company:</strong> {popupContent.company}</p>
                  <p><strong>Email:</strong> {popupContent.email}</p>
                  <p><strong>Phone:</strong> {popupContent.phone}</p>
                  <p><strong>Created:</strong> {new Date(popupContent.created).toLocaleString()}</p>
                  <button onClick={() => handleDeleteContact(popupContent._id)}>Delete Contact</button>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Contacts;