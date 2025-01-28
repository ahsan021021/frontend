import { useState } from 'react';
import './EmailMarketing.css';

function SubscriberList({ subscribers, onAddSubscriber, onDeleteSubscriber }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubscriber, setNewSubscriber] = useState({
    email: '',
    name: '',
    status: 'active'
  });
  const [editingSubscriber, setEditingSubscriber] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSubscriber) {
      onAddSubscriber({ ...newSubscriber, id: editingSubscriber.id });
      setEditingSubscriber(null);
    } else {
      onAddSubscriber(newSubscriber);
    }
    setNewSubscriber({ email: '', name: '', status: 'active' });
    setShowAddForm(false);
  };

  const handleEdit = (subscriber) => {
    setEditingSubscriber(subscriber);
    setNewSubscriber({ ...subscriber });
    setShowAddForm(true);
  };

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="subscriber-list">
      <div className="header">
        <h2>Subscribers</h2>
        <button onClick={() => setShowAddForm(true)}>Add Subscriber</button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search subscribers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showAddForm && (
        <form className="add-subscriber-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={newSubscriber.email}
            onChange={(e) => setNewSubscriber({...newSubscriber, email: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Name"
            value={newSubscriber.name}
            onChange={(e) => setNewSubscriber({...newSubscriber, name: e.target.value})}
            required
          />
          <select
            value={newSubscriber.status}
            onChange={(e) => setNewSubscriber({...newSubscriber, status: e.target.value})}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="form-actions">
            <button type="submit">{editingSubscriber ? 'Update' : 'Save'}</button>
            <button type="button" onClick={() => {
              setShowAddForm(false);
              setEditingSubscriber(null);
            }}>Cancel</button>
          </div>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Status</th>
            <th>Last Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubscribers.map(subscriber => (
            <tr key={subscriber.id}>
              <td>{subscriber.email}</td>
              <td>{subscriber.name}</td>
              <td>
                <span className={`status ${subscriber.status}`}>
                  {subscriber.status}
                </span>
              </td>
              <td>{subscriber.lastActive}</td>
              <td>
                <button 
                  className="action-btn"
                  onClick={() => handleEdit(subscriber)}
                >
                  Edit
                </button>
                <button 
                  className="action-btn delete"
                  onClick={() => onDeleteSubscriber(subscriber.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SubscriberList;