import { useState } from 'react';
import ContactForm from '../components/ContactForm';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

function Contacts() {
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [contacts, setContacts] = useState([
    {
      id: '1',
      name: 'Mariana',
      company: 'website.science',
      email: 'website.science1@gmail.com',
      phone: '+1234567890',
      created_at: '2024-12-12T03:39:00.000Z',
      tags: ['Client', 'VIP'],
      avatar: 'https://ui-avatars.com/api/?name=Mariana&background=random'
    },
    {
      id: '2',
      name: 'Ken',
      company: 'Web That Sells',
      email: 'ken@webthatssells.com',
      phone: '+1987654321',
      created_at: '2024-12-12T03:39:00.000Z',
      tags: ['Partner'],
      avatar: 'https://ui-avatars.com/api/?name=Ken&background=random'
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (id) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    toast.success('Contact deleted successfully');
  };

  const handleBulkDelete = () => {
    if (!selectedContacts.length) return;
    setContacts(contacts.filter(contact => !selectedContacts.includes(contact.id)));
    setSelectedContacts([]);
    toast.success('Contacts deleted successfully');
  };

  const handleEdit = (contact) => {
    setEditContact(contact);
    setShowAddForm(true);
  };

  const handleFormSubmit = (contactData) => {
    if (editContact) {
      setContacts(contacts.map(c => 
        c.id === editContact.id ? { ...contactData, id: editContact.id } : c
      ));
      toast.success('Contact updated successfully');
    } else {
      const newContact = {
        ...contactData,
        id: uuidv4(),
        created_at: new Date().toISOString()
      };
      setContacts([newContact, ...contacts]);
      toast.success('Contact added successfully');
    }
    setShowAddForm(false);
    setEditContact(null);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-content">
      <div className="toolbar">
        <div className="left-tools">
          <button className="tool-btn" onClick={() => setShowAddForm(true)} title="Add Contact">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"/>
            </svg>
          </button>
          <button className="tool-btn" title="Download">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
            </svg>
          </button>
          <button className="tool-btn" title="Print">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
              <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/>
            </svg>
          </button>
          <button className="tool-btn" title="Send Message">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15z"/>
            </svg>
          </button>
          <button className="tool-btn" title="Send Email">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.708 2.825L15 11.105V5.383zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.105l4.708-2.897L1 5.383v5.722z"/>
            </svg>
          </button>
          <button className="tool-btn" title="Refresh">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
            </svg>
          </button>
          {selectedContacts.length > 0 && (
            <button className="tool-btn" onClick={handleBulkDelete} title="Delete Selected">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1z"/>
              </svg>
            </button>
          )}
          <button className="tool-btn" title="Import/Export">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"/>
            </svg>
          </button>
          <button className="tool-btn" title="View">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
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
          <button className="columns-btn">Columns ▼</button>
          <button className="filters-btn">More Filters ⚡</button>
        </div>
      </div>

      <div className="contacts-table">
        <div className="table-header">
          <input 
            type="checkbox" 
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedContacts(contacts.map(c => c.id));
              } else {
                setSelectedContacts([]);
              }
            }}
            checked={selectedContacts.length === contacts.length && contacts.length > 0}
          />
          <span>Name</span>
          <span>Phone</span>
          <span>Email</span>
          <span>Created</span>
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
            <div className="name-cell">
              <div className="avatar">{contact.name?.[0] || '?'}</div>
              <div className="contact-info">
                <div className="contact-name">{contact.name}</div>
                <div className="contact-company">{contact.company}</div>
              </div>
            </div>
            <span>{contact.phone}</span>
            <span>{contact.email}</span>
            <span>{new Date(contact.created_at).toLocaleString()}</span>
            <div className="tags">
              {contact.tags?.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
            <div className="actions">
              <button className="tool-btn" onClick={() => handleEdit(contact)}>✏️</button>
              <button className="tool-btn" onClick={() => handleDelete(contact.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <ContactForm
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowAddForm(false);
            setEditContact(null);
          }}
          editContact={editContact}
        />
      )}
    </div>
  );
}

export default Contacts;