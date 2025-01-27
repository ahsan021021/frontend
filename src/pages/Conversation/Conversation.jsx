import React, { useState } from 'react';
import { FiSearch, FiFilter, FiPlus, FiUser, FiMessageSquare, FiStar, FiClock, FiX, FiSmile, FiPaperclip, FiZap, FiFolder, FiEdit2, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import Sidebar from '../../components/Sidebar'; // Import Sidebar component
import './Conversation.css';

function Conversation() {
  const [activeTab, setActiveTab] = useState('conversations');
  const [activeSubTab, setActiveSubTab] = useState('unread');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSnippetDropdown, setShowSnippetDropdown] = useState(false);
  const [showTextSnippetModal, setShowTextSnippetModal] = useState(false);
  const [showEmailSnippetModal, setShowEmailSnippetModal] = useState(false);
  const [activeTriggerTab, setActiveTriggerTab] = useState('links');
  const [activeFolder, setActiveFolder] = useState('all');
  const [showFolderModal, setShowFolderModal] = useState(false);

  const tabs = [
    { id: 'conversations', label: 'Conversations' },
    { id: 'manualActions', label: 'Manual Actions' },
    { id: 'snippets', label: 'Snippets' },
    { id: 'triggerLinks', label: 'Trigger Links' }
  ];

  const subTabs = [
    { id: 'unread', label: 'Unread', icon: <FiMessageSquare /> },
    { id: 'recents', label: 'Recents', icon: <FiClock /> },
    { id: 'starred', label: 'Starred', icon: <FiStar /> },
    { id: 'all', label: 'All', icon: null }
  ];

  const mockConversations = [
    {
      id: 1,
      name: 'John Doe',
      lastMessage: 'Hey, I need help with my recent order',
      timestamp: '10:30 AM',
      unread: true,
      avatar: '🧑‍💼'
    },
    {
      id: 2,
      name: 'Sarah Smith',
      lastMessage: 'Thank you for your assistance!',
      timestamp: '9:45 AM',
      unread: true,
      avatar: '👩'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      lastMessage: 'When will my order be shipped?',
      timestamp: 'Yesterday',
      unread: false,
      avatar: '👨'
    }
  ];

  const mockMessages = {
    1: [
      { id: 1, sender: 'John Doe', content: 'Hey, I need help with my recent order', time: '10:30 AM', type: 'received' },
      { id: 2, sender: 'Agent', content: 'Hello John! I\'d be happy to help. Could you please provide your order number?', time: '10:31 AM', type: 'sent' },
      { id: 3, sender: 'John Doe', content: 'Sure, it\'s #ORD123456', time: '10:32 AM', type: 'received' }
    ],
    2: [
      { id: 1, sender: 'Sarah Smith', content: 'Thank you for your assistance!', time: '9:45 AM', type: 'received' },
      { id: 2, sender: 'Agent', content: 'You\'re welcome! Let me know if you need anything else.', time: '9:46 AM', type: 'sent' }
    ],
    3: [
      { id: 1, sender: 'Mike Johnson', content: 'When will my order be shipped?', time: 'Yesterday', type: 'received' },
      { id: 2, sender: 'Agent', content: 'Let me check that for you right away.', time: 'Yesterday', type: 'sent' },
      { id: 3, sender: 'Agent', content: 'Your order will be shipped within the next 24 hours.', time: 'Yesterday', type: 'sent' }
    ]
  };

  const mockFolders = [
    { id: 'all', name: 'All Snippets', count: 5 },
    { id: 'welcome', name: 'Welcome Messages', count: 2 },
    { id: 'support', name: 'Support Responses', count: 3 }
  ];

  const mockSnippets = [
    {
      id: 1,
      name: 'Welcome Message',
      content: 'Hello! Welcome to our support. How can I assist you today?',
      folder: 'welcome',
      type: 'text'
    },
    {
      id: 2,
      name: 'Order Status',
      content: 'I\'ll help you check the status of your order. Could you please provide your order number?',
      folder: 'support',
      type: 'text'
    },
    {
      id: 3,
      name: 'Thank You Email',
      subject: 'Thank You for Your Purchase',
      content: 'Dear customer,\n\nThank you for your recent purchase...',
      folder: 'welcome',
      type: 'email'
    }
  ];

  const mockActions = [
    {
      id: 1,
      title: 'Review Order #12345',
      description: 'Customer reported issues with their recent order',
      assignee: 'John Doe',
      priority: 'High',
      dueDate: '2023-07-20'
    },
    {
      id: 2,
      title: 'Update Shipping Address',
      description: 'Customer requested address change for order #54321',
      assignee: 'Sarah Smith',
      priority: 'Medium',
      dueDate: '2023-07-21'
    }
  ];

  const filteredConversations = mockConversations.filter(conv => {
    if (activeSubTab === 'unread') return conv.unread;
    return true;
  }).filter(conv => {
    if (searchQuery) {
      return conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const filteredSnippets = mockSnippets.filter(snippet => 
    activeFolder === 'all' || snippet.folder === activeFolder
  );

  const renderTriggerLinks = () => {
    return (
      <div className="trigger-links">
        <div className="trigger-links-header">
          <div className="trigger-links-tabs">
            <button 
              className={`tab ${activeTriggerTab === 'links' ? 'active' : ''}`}
              onClick={() => setActiveTriggerTab('links')}
            >
              Links
            </button>
            <button 
              className={`tab ${activeTriggerTab === 'analyze' ? 'active' : ''}`}
              onClick={() => setActiveTriggerTab('analyze')}
            >
              Analyze
            </button>
          </div>
          <button className="primary-button">Add Link</button>
        </div>
        
        {activeTriggerTab === 'links' ? (
          <div className="trigger-links-content">
            <div className="trigger-links-table">
              <div className="table-header">
                <div>Name</div>
                <div>Link URL</div>
                <div>Link Key</div>
                <div>Actions</div>
              </div>
              <div className="empty-state">
                <p>You do not have any trigger link yet. <a href="#">Click here to create your first trigger link</a></p>
              </div>
            </div>
          </div>
        ) : (
          <div className="trigger-links-analyze">
            <div className="empty-state">
              <p>No analytics data available yet.</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSnippets = () => {
    return (
      <div className="snippets">
        <div className="snippets-wrapper">
          <div className="snippets-sidebar">
            <div className="search-input">
              <FiSearch className="search-icon" />
              <input type="text" placeholder="Search snippets..." />
            </div>
            <div className="folder-list">
              {mockFolders.map(folder => (
                <div
                  key={folder.id}
                  className={`folder-item ${activeFolder === folder.id ? 'active' : ''}`}
                  onClick={() => setActiveFolder(folder.id)}
                >
                  <FiFolder />
                  <span>{folder.name}</span>
                  <span className="text-secondary">({folder.count})</span>
                </div>
              ))}
            </div>
          </div>
          <div className="snippets-main">
            <div className="snippets-header">
              <h2>Snippets</h2>
              <p>Create snippets to quickly insert predefined content into messages for faster, consistent communication.</p>
              <div className="snippets-actions">
                <button 
                  className="secondary-button"
                  onClick={() => setShowFolderModal(true)}
                >
                  <FiFolder /> Add Folder
                </button>
                <div className="dropdown-container">
                  <button 
                    className="primary-button"
                    onClick={() => setShowSnippetDropdown(!showSnippetDropdown)}
                  >
                    Add Snippet
                  </button>
                  {showSnippetDropdown && (
                    <div className="dropdown-menu">
                      <button onClick={() => {
                        setShowTextSnippetModal(true);
                        setShowSnippetDropdown(false);
                      }}>Add Text Snippet</button>
                      <button onClick={() => {
                        setShowEmailSnippetModal(true);
                        setShowSnippetDropdown(false);
                      }}>Add Email Snippet</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="snippets-content">
              {filteredSnippets.length > 0 ? (
                filteredSnippets.map(snippet => (
                  <div key={snippet.id} className="snippet-card">
                    <div className="snippet-header">
                      <h3>{snippet.name}</h3>
                      <div className="snippet-actions">
                        <button className="icon-button"><FiEdit2 /></button>
                        <button className="icon-button"><FiTrash2 /></button>
                        <button className="icon-button"><FiMoreVertical /></button>
                      </div>
                    </div>
                    <p>{snippet.content.substring(0, 100)}...</p>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📄</div>
                  <p>No snippets found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {showTextSnippetModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Create Text Snippet</h3>
                <button className="close-button" onClick={() => setShowTextSnippetModal(false)}>
                  <FiX />
                </button>
              </div>
              <div className="modal-content">
                <div className="form-group">
                  <label>Name <span className="required">*</span></label>
                  <input type="text" placeholder="Enter Snippet Name" />
                </div>
                <div className="form-group">
                  <label>Snippets Body <span className="required">*</span></label>
                  <div className="text-editor">
                    <div className="editor-toolbar">
                      <button><FiSmile /></button>
                      <button><FiPaperclip /></button>
                      <button><FiZap /></button>
                    </div>
                    <textarea placeholder="Type a message"></textarea>
                    <div className="editor-footer">
                      <span>Approximate Cost: $0</span>
                      <span>0 characters | 0 words | 0 segs</span>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Add file through URL</label>
                  <div className="url-input">
                    <input type="text" placeholder="Enter URL" />
                    <button className="primary-button">Add</button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Test Snippet</label>
                  <div className="test-input">
                    <input type="text" placeholder="Enter phone number" />
                    <button className="primary-button">Send</button>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="secondary-button" onClick={() => setShowTextSnippetModal(false)}>Cancel</button>
                <button className="primary-button">Save</button>
              </div>
            </div>
          </div>
        )}

        {showEmailSnippetModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Create Email Snippet</h3>
                <button className="close-button" onClick={() => setShowEmailSnippetModal(false)}>
                  <FiX />
                </button>
              </div>
              <div className="modal-content">
                <div className="form-group">
                  <label>Name <span className="required">*</span></label>
                  <input type="text" placeholder="Enter Snippet Name" />
                </div>
                <div className="form-group">
                  <label>Subject <span className="required">*</span></label>
                  <input type="text" placeholder="Enter Subject" />
                </div>
                <div className="form-group">
                  <label>Snippets Body <span className="required">*</span></label>
                  <div className="rich-text-editor">
                    <div className="editor-toolbar">
                      <select><option>Paragraph</option></select>
                      <select><option>14px</option></select>
                      <select><option>1.5</option></select>
                      <select><option>Verdana</option></select>
                    </div>
                    <textarea placeholder="Type a message"></textarea>
                    <div className="editor-footer">
                      <span>0 characters | 0 words</span>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Test Email Snippet</label>
                  <div className="test-email">
                    <input type="email" placeholder="From Email Address" />
                    <input type="email" placeholder="To Email Address" />
                    <button className="primary-button">Send Test</button>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="secondary-button" onClick={() => setShowEmailSnippetModal(false)}>Cancel</button>
                <button className="primary-button">Save</button>
              </div>
            </div>
          </div>
        )}

        {showFolderModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Create New Folder</h3>
                <button className="close-button" onClick={() => setShowFolderModal(false)}>
                  <FiX />
                </button>
              </div>
              <div className="modal-content">
                <div className="form-group">
                  <label>Folder Name <span className="required">*</span></label>
                  <input type="text" placeholder="Enter folder name" />
                </div>
              </div>
              <div className="modal-footer">
                <button className="secondary-button" onClick={() => setShowFolderModal(false)}>Cancel</button>
                <button className="primary-button">Create Folder</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderManualActions = () => {
    return (
      <div className="manual-actions">
        <div className="actions-header">
          <h2>Manual Actions</h2>
          <div className="actions-controls">
            <input type="text" placeholder="Type to Search Workflows" />
            <select>
              <option>Select Assignee</option>
              <option>John Doe</option>
              <option>Sarah Smith</option>
            </select>
            <button className="primary-button">Let's start</button>
          </div>
        </div>
        
        {mockActions.length > 0 ? (
          <div className="actions-list">
            {mockActions.map(action => (
              <div key={action.id} className="action-card">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
                <div className="action-meta">
                  <span>Assignee: {action.assignee}</span>
                  <span>Priority: {action.priority}</span>
                  <span>Due: {action.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="success-state">
            <div className="success-icon">✓</div>
            <h3>Good Work!</h3>
            <p>You have no pending tasks</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app">
      <Sidebar /> {/* Add Sidebar component */}
      <div className="main-content">
        <nav className="nav">
          <div className="tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="content">
          {activeTab === 'conversations' && (
            <div className="conversations-layout">
              <div className="conversations-sidebar">
                <div className="sub-tabs">
                  {subTabs.map(tab => (
                    <button
                      key={tab.id}
                      className={`sub-tab ${activeSubTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveSubTab(tab.id)}
                    >
                      {tab.icon && <span className="tab-icon">{tab.icon}</span>}
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="search-bar">
                  <div className="search-input">
                    <FiSearch className="search-icon" />
                    <input 
                      type="text" 
                      placeholder="Search conversations..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="search-actions">
                    <button className="icon-button">
                      <FiFilter />
                    </button>
                    <button className="icon-button">
                      <FiPlus />
                    </button>
                  </div>
                </div>

                <div className="conversations-list">
                  {filteredConversations.length > 0 ? (
                    filteredConversations.map(conv => (
                      <div
                        key={conv.id}
                        className={`conversation-item ${selectedConversation === conv.id ? 'selected' : ''} ${conv.unread ? 'unread' : ''}`}
                        onClick={() => setSelectedConversation(conv.id)}
                      >
                        <div className="conversation-avatar">{conv.avatar}</div>
                        <div className="conversation-info">
                          <div className="conversation-header">
                            <h4>{conv.name}</h4>
                            <span className="timestamp">{conv.timestamp}</span>
                          </div>
                          <p className="last-message">{conv.lastMessage}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">💬</div>
                      <p>No conversations found</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="conversation-main">
                {selectedConversation ? (
                  <div className="selected-conversation">
                    <div className="conversation-header">
                      <div className="contact-info">
                        <div className="avatar">
                          {mockConversations.find(c => c.id === selectedConversation)?.avatar}
                        </div>
                        <h3>{mockConversations.find(c => c.id === selectedConversation)?.name}</h3>
                      </div>
                    </div>
                    <div className="messages-container">
                      {mockMessages[selectedConversation].map(message => (
                        <div key={message.id} className={`message ${message.type}`}>
                          <div className="message-content">
                            <p>{message.content}</p>
                            <span className="message-time">{message.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="message-input">
                      <input type="text" placeholder="Type your message..." />
                      <button className="send-button">Send</button>
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">💭</div>
                    <h3>No conversation selected</h3>
                    <p>Select a conversation to start messaging</p>
                  </div>
                )}
              </div>

              <div className="contact-details">
                {selectedConversation ? (
                  <div className="contact-info-panel">
                    <div className="contact-header">
                      <div className="large-avatar">
                        {mockConversations.find(c => c.id === selectedConversation)?.avatar}
                      </div>
                      <h3>{mockConversations.find(c => c.id === selectedConversation)?.name}</h3>
                    </div>
                    <div className="contact-details-content">
                      <div className="detail-section">
                        <h4>Contact Information</h4>
                        <p><FiUser /> Customer since 2023</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">👤</div>
                    <h3>No contact selected</h3>
                    <p>Select a conversation to view contact details</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'manualActions' && renderManualActions()}
          {activeTab === 'snippets' && renderSnippets()}
          {activeTab === 'triggerLinks' && renderTriggerLinks()}
        </div>
      </div>
    </div>
  );
}

export default Conversation;