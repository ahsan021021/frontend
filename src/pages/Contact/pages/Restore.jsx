import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';

function Restore() {
  const [deletedContacts, setDeletedContacts] = useState([]);

  useEffect(() => {
    const fetchDeletedContacts = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const headers = { Authorization: `Bearer ${token}` }; // Add token to headers

        const response = await axios.get('http://82.180.137.7:5000/api/contacts/deleted', { headers });
        setDeletedContacts(response.data);
      } catch (error) {
        console.error('Error fetching deleted contacts:', error);
      }
    };

    fetchDeletedContacts();
  }, []);

  const handleRestore = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const headers = { Authorization: `Bearer ${token}` }; // Add token to headers

      await axios.patch(`http://82.180.137.7:5000/api/contacts/restore/${id}`, {}, { headers });
      alert('Contact restored successfully!');

      // Remove the restored contact from the list
      setDeletedContacts((prevContacts) => prevContacts.filter((contact) => contact._id !== id));
    } catch (error) {
      console.error('Error restoring contact:', error);
      alert('Failed to restore contact. Please try again.');
    }
  };

  const handlePermanentDelete = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const headers = { Authorization: `Bearer ${token}` }; // Add token to headers

      await axios.delete(`http://82.180.137.7:5000/api/contacts/permanent/${id}`, { headers });
      alert('Contact permanently deleted!');

      // Remove the permanently deleted contact from the list
      setDeletedContacts((prevContacts) => prevContacts.filter((contact) => contact._id !== id));
    } catch (error) {
      console.error('Error permanently deleting contact:', error);
      alert('Failed to delete contact permanently. Please try again.');
    }
  };

  return (
    <div className="page-content">
      <h2>Contacts Restore</h2>
      <div className="restore-table">
        <div className="table-header">
          <input type="checkbox" />
          <span>Name</span>
          <span>Email</span>
          <span>Phone</span>
          <span>Actions</span>
        </div>
        <div className="table-body">
          {deletedContacts.map((contact) => (
            <div key={contact._id} className="table-row">
              <input type="checkbox" />
              <span>{contact.name}</span>
              <span>{contact.email}</span>
              <span>{contact.phone}</span>
              <span>
                <button
                  className="restore-button"
                  onClick={() => handleRestore(contact._id)}
                  title="Restore Contact"
                >
                  <FontAwesomeIcon icon={faUndo} />
                </button>
                <button
                  className="delete-button"
                  onClick={() => handlePermanentDelete(contact._id)}
                  title="Delete Permanently"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Restore;