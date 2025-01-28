import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/SideBar';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek, addDays, isToday, setMonth, setYear } from 'date-fns';
import { FaChevronLeft, FaChevronRight, FaClock, FaVideo, FaEnvelope, FaTimes, FaUndo } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import './Calendar.css';

function Calendar() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showMeetingDetails, setShowMeetingDetails] = useState(null);
  const [viewMode, setViewMode] = useState('month');
  const [isMobile, setIsMobile] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showCancelReason, setShowCancelReason] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [pendingMeetings, setPendingMeetings] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    duration: 30,
    email: ''
  });

  // Mock meetings data
  const initialMeetings = [
    {
      id: 1,
      title: "Team Meeting",
      date: format(new Date(), 'yyyy-MM-dd'), // Today
      startTime: "10:00",
      duration: 60,
      email: "team@example.com"
    },
    {
      id: 2,
      title: "Client Review",
      date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), // Tomorrow
      startTime: "14:00",
      duration: 45,
      email: "client@example.com"
    }
  ];
  
  const [meetings, setMeetings] = useState(initialMeetings);

  // Sort meetings by date and time
  const sortedMeetings = [...meetings].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`);
    const dateB = new Date(`${b.date}T${b.startTime}`);
    return dateA - dateB;
  });

  // Filter meetings based on active tab
  const filteredMeetings = sortedMeetings.filter(meeting => {
    const meetingDate = new Date(`${meeting.date}T${meeting.startTime}`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (activeTab) {
      case 'today':
        return isSameDay(meetingDate, today);
      case 'upcoming':
        return meetingDate >= today;
      case 'pending':
        // Meetings that are today but haven't started yet
        const now = new Date();
        return isSameDay(meetingDate, today) && meetingDate > now;
      case 'all':
        return true;
      case 'restore':
        return false; // No meetings to show in the main timeline for restore tab
      default:
        return true;
    }
  });

  const handlePrevMonth = () => {
    setSelectedDate(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1));
  };

  const handlePrevYear = () => {
    setSelectedDate(subMonths(selectedDate, 12));
  };

  const handleNextYear = () => {
    setSelectedDate(addMonths(selectedDate, 12));
  };

  const handleSelectYear = (year) => {
    setSelectedDate(setYear(selectedDate, year));
    setShowYearDropdown(false);
  };

  const handleSelectMonth = (month) => {
    setSelectedDate(setMonth(selectedDate, month));
    setShowMonthDropdown(false);
  };

  const getDaysInMonth = () => {
    const start = startOfWeek(startOfMonth(selectedDate));
    const end = endOfWeek(endOfMonth(selectedDate));
    return eachDayOfInterval({ start, end });
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    
    // Validate date is not in the past
    const eventDate = new Date(`${newEvent.date}T${newEvent.startTime}`);
    if (eventDate < new Date()) {
      toast.error("Cannot schedule meetings in the past");
      return;
    }

    const event = {
      id: meetings.length + 1,
      ...newEvent
    };
    
    setMeetings([...meetings, event]);
    setShowAddEvent(false);
    setNewEvent({
      title: '',
      date: format(selectedDate, 'yyyy-MM-dd'), // Use selected date as default
      startTime: '09:00',
      duration: 30,
      email: ''
    });
    toast.success('Event added successfully!');
  };

  const handleDeleteMeeting = (id) => {
    const meetingToDelete = meetings.find(meeting => meeting.id === id);
    setPendingMeetings([...pendingMeetings, meetingToDelete]);
    setMeetings(meetings.filter(meeting => meeting.id !== id));
    setShowMeetingDetails(null);
    toast.success('Meeting cancelled successfully');
  };

  const handleCancelMeeting = (e) => {
    e.preventDefault();
    if (cancelReason.trim() === '') {
      toast.error("Please provide a reason for cancellation");
      return;
    }
    handleDeleteMeeting(showMeetingDetails.id);
    setShowCancelReason(false);
    setCancelReason('');
  };

  const handleRestoreMeeting = (id) => {
    const meetingToRestore = pendingMeetings.find(meeting => meeting.id === id);
    setMeetings([...meetings, meetingToRestore]);
    setPendingMeetings(pendingMeetings.filter(meeting => meeting.id !== id));
    toast.success('Meeting restored successfully');
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const TabButton = ({ tab, label }) => (
    <button 
      onClick={() => setActiveTab(tab)}
      className={`tab-button ${activeTab === tab ? 'active' : ''}`}
    >
      {label}
    </button>
  );

  return (
    <div className={`container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1E1E1E',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        />
        <div className="header">
          <div className="tabs">
            <TabButton tab="today" label="Today" />
            <TabButton tab="upcoming" label="Upcoming" />
            <TabButton tab="pending" label="Pending" />
            <TabButton tab="all" label="All" />
            <TabButton tab="restore" label="Restore" /> {/* New Restore tab */}
          </div>
          {isMobile && (
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="btn btn-primary"
            >
              {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
            </button>
          )}
        </div>

        <div className="main-grid">
          <div className="timeline">
            {activeTab === 'restore' ? (
              pendingMeetings.length === 0 ? (
                <div className="empty-state">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="empty-state-title">No Cancelled Meetings</h3>
                  <p>There are no meetings to restore</p>
                </div>
              ) : (
                <div>
                  {pendingMeetings.map((meeting) => (
                    <div key={meeting.id} className="pending-meeting-card">
                      <div className="pending-meeting-title">{meeting.title}</div>
                      <div className="pending-meeting-info">
                        <div className="pending-meeting-info-item">
                          <FaClock className="w-4 h-4" />
                          {meeting.startTime} ({meeting.duration} min)
                        </div>
                        <div className="pending-meeting-info-item">
                          <FaEnvelope className="w-4 h-4" />
                          {meeting.email}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRestoreMeeting(meeting.id)}
                        className="btn btn-restore"
                      >
                        <FaUndo className="w-4 h-4" /> Restore
                      </button>
                    </div>
                  ))}
                </div>
              )
            ) : (
              filteredMeetings.length === 0 ? (
                <div className="empty-state">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="empty-state-title">No Upcoming Events</h3>
                  <p>Click "Add Event" to schedule a new meeting</p>
                </div>
              ) : (
                <div>
                  {filteredMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      onClick={() => setShowMeetingDetails(meeting)}
                      className="meeting-card"
                    >
                      <div className="meeting-title">{meeting.title}</div>
                      <div className="meeting-info">
                        <div className="meeting-info-item">
                          <FaClock className="w-4 h-4" />
                          {format(new Date(`${meeting.date}T${meeting.startTime}`), 'EEEE, MMMM d, yyyy')} at {meeting.startTime} ({meeting.duration} min)
                        </div>
                        <div className="meeting-info-item">
                          <FaEnvelope className="w-4 h-4" />
                          {meeting.email}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

          {(!isMobile || showCalendar) && (
            <div className="calendar">
              <div className="calendar-header">
                <div className="view-buttons">
                  <button 
                    onClick={() => setViewMode('month')}
                    className={`view-button ${viewMode === 'month' ? 'active' : ''}`}
                  >
                    MONTH
                  </button>
                </div>
                <div className="calendar-nav">
                  <button onClick={handlePrevYear}>
                    <FaChevronLeft className="w-5 h-5" />
                  </button>
                  <span onClick={() => setShowYearDropdown(!showYearDropdown)} className="cursor-pointer">
                    {format(selectedDate, 'yyyy')}
                  </span>
                  <button onClick={handleNextYear}>
                    <FaChevronRight className="w-5 h-5" />
                  </button>
                  {showYearDropdown && (
                    <div className="dropdown">
                      {[...Array(10)].map((_, i) => {
                        const year = new Date().getFullYear() - 5 + i;
                        return (
                          <div key={year} onClick={() => handleSelectYear(year)} className="dropdown-item">
                            {year}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="calendar-header">
                <button onClick={handlePrevMonth}>
                  <FaChevronLeft className="w-5 h-5" />
                </button>
                <span onClick={() => setShowMonthDropdown(!showMonthDropdown)} className="cursor-pointer">
                  {format(selectedDate, 'MMMM yyyy')}
                </span>
                <button onClick={handleNextMonth}>
                  <FaChevronRight className="w-5 h-5" />
                </button>
                {showMonthDropdown && (
                  <div className="dropdown">
                    {Array.from({ length: 12 }, (_, i) => (
                      <div key={i} onClick={() => handleSelectMonth(i)} className="dropdown-item">
                        {format(setMonth(new Date(), i), 'MMMM')}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="calendar-day-header">{day}</div>
                ))}
              </div>
              
              <div className="calendar-grid">
                {getDaysInMonth().map((day, i) => {
                  const isCurrentMonth = format(day, 'M') === format(selectedDate, 'M');
                  const hasEvent = meetings.some(m => m.date === format(day, 'yyyy-MM-dd'));
                  const dayClasses = [
                    'calendar-day',
                    !isCurrentMonth && 'other-month',
                    isSameDay(day, selectedDate) && 'selected',
                    hasEvent && 'has-event',
                    isToday(day) && !isSameDay(day, selectedDate) && 'today' // Ensure only one date is selected
                  ].filter(Boolean).join(' ');

                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(day)}
                      className={dayClasses}
                    >
                      {format(day, 'd')}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  setShowAddEvent(true);
                  setNewEvent({
                    ...newEvent,
                    date: format(selectedDate, 'yyyy-MM-dd') // Set selected date when opening the form
                  });
                }}
                className="add-event-btn"
              >
                ADD EVENT
              </button>
            </div>
          )}
        </div>

        {showMeetingDetails && (
          <div className="modal-overlay">
            <div className="modal">
              <button
                onClick={() => setShowMeetingDetails(null)}
                className="modal-close"
              >
                <FaTimes className="w-6 h-6" />
              </button>
              <h3 className="modal-title">Meeting Info</h3>
              <div className="meeting-info">
                <div className="meeting-info-item">
                  <FaClock className="w-5 h-5" />
                  <div>{format(new Date(`${showMeetingDetails.date}T${showMeetingDetails.startTime}`), 'EEEE, MMMM d, yyyy')} at {showMeetingDetails.startTime} ({showMeetingDetails.duration} min)</div>
                </div>
                <div className="meeting-info-item">
                  <FaVideo className="w-5 h-5" />
                  <div>Web conferencing details provided upon confirmation.</div>
                </div>
                <div className="meeting-info-item">
                  <FaEnvelope className="w-5 h-5" />
                  <div>{showMeetingDetails.email}</div>
                </div>
              </div>
              <div className="form-buttons" style={{ marginTop: '1.5rem' }}>
                <button
                  onClick={() => setShowCancelReason(true)}
                  className="btn btn-cancel"
                >
                  Cancel Meeting
                </button>
              </div>
            </div>
          </div>
        )}

        {showCancelReason && (
          <div className="modal-overlay">
            <div className="modal">
              <button
                onClick={() => setShowCancelReason(false)}
                className="modal-close"
              >
                <FaTimes className="w-6 h-6" />
              </button>
              <h3 className="modal-title">Cancel Meeting</h3>
              <form onSubmit={handleCancelMeeting}>
                <div className="form-group">
                  <label className="form-label">Reason for Cancellation</label>
                  <textarea
                    required
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="form-input"
                    placeholder="Enter reason for cancellation"
                  />
                </div>
                <div className="form-buttons">
                  <button
                    type="button"
                    onClick={() => setShowCancelReason(false)}
                    className="btn btn-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAddEvent && (
          <div className="modal-overlay">
            <div className="modal">
              <button
                onClick={() => setShowAddEvent(false)}
                className="modal-close"
              >
                <FaTimes className="w-6 h-6" />
              </button>
              <h3 className="modal-title">Add New Event</h3>
              <form onSubmit={handleAddEvent}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    required
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="form-input"
                    placeholder="Enter meeting title"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    required
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    required
                    min="15"
                    step="15"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({...newEvent, duration: parseInt(e.target.value)})}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    required
                    value={newEvent.email}
                    onChange={(e) => setNewEvent({...newEvent, email: e.target.value})}
                    className="form-input"
                    placeholder="Enter participant's email"
                  />
                </div>
                <div className="form-buttons">
                  <button
                    type="button"
                    onClick={() => setShowAddEvent(false)}
                    className="btn btn-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Add Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendar;