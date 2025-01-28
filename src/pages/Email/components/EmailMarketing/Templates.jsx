import { useState } from 'react';
import './EmailMarketing.css';

function Templates({ templates, setTemplates }) {
  const [showForm, setShowForm] = useState(false);
  const [template, setTemplate] = useState({
    name: '',
    content: '',
    category: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setTemplates([...templates, { ...template, id: Date.now() }]);
    setTemplate({ name: '', content: '', category: '' });
    setShowForm(false);
  };

  return (
    <div className="templates">
      <div className="header">
        <h2>Email Templates</h2>
        <button onClick={() => setShowForm(true)}>Create Template</button>
      </div>

      {showForm && (
        <form className="template-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Template Name"
            value={template.name}
            onChange={(e) => setTemplate({...template, name: e.target.value})}
            required
          />
          <select
            value={template.category}
            onChange={(e) => setTemplate({...template, category: e.target.value})}
            required
          >
            <option value="">Select Category</option>
            <option value="newsletter">Newsletter</option>
            <option value="promotion">Promotion</option>
            <option value="announcement">Announcement</option>
          </select>
          <textarea
            placeholder="Template Content (HTML)"
            value={template.content}
            onChange={(e) => setTemplate({...template, content: e.target.value})}
            required
          />
          <div className="form-actions">
            <button type="submit">Save Template</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="template-grid">
        {templates.map(template => (
          <div key={template.id} className="template-card">
            <h3>{template.name}</h3>
            <p>Category: {template.category}</p>
            <div className="template-actions">
              <button>Edit</button>
              <button>Preview</button>
              <button className="delete">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Templates;