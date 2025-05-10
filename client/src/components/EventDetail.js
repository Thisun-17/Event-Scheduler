import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const EventDetail = ({ events }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find(e => e._id === id);
  
  const [rsvp, setRsvp] = useState({ status: '', name: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  
  if (!event) {
    return <div>Event not found</div>;
  }
  
  const handleRsvpChange = (e) => {
    const { name, value } = e.target;
    setRsvp({ ...rsvp, [name]: value });
  };
  
  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // In a real app, you would send this to your API
      await fetch(`http://localhost:5000/api/events/${id}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rsvp),
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting RSVP:', error);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'PPPP');
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'p');
  };

  return (
    <div className="event-detail">
      <h2>{event.name}</h2>
      <div className="event-info">
        <p><strong>Date:</strong> {formatDate(event.date)}</p>
        <p><strong>Time:</strong> {formatTime(event.date)}</p>
        <p><strong>Location:</strong> {event.location}</p>
        {event.category && <p><strong>Category:</strong> {event.category}</p>}
        
        <div className="description">
          <h3>Description</h3>
          <p>{event.description || "No description provided."}</p>
        </div>
      </div>
      
      <div className="rsvp-section">
        <h3>RSVP</h3>
        
        {submitted ? (
          <div className="success-message">
            Thank you for your response!
          </div>
        ) : (
          <form onSubmit={handleRsvpSubmit} className="rsvp-form">
            <div className="form-group">
              <label>Your Name</label>
              <input 
                type="text" 
                name="name" 
                value={rsvp.name} 
                onChange={handleRsvpChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Your Email</label>
              <input 
                type="email" 
                name="email" 
                value={rsvp.email} 
                onChange={handleRsvpChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Your Response</label>
              <select 
                name="status" 
                value={rsvp.status} 
                onChange={handleRsvpChange}
                required
              >
                <option value="">Select your response</option>
                <option value="attending">Attending</option>
                <option value="maybe">Maybe</option>
                <option value="not-attending">Not Attending</option>
              </select>
            </div>
            
            <button type="submit" className="btn btn-primary">Submit RSVP</button>
          </form>
        )}
      </div>
      
      <button className="btn btn-secondary" onClick={() => navigate('/')}>
        Back to Events
      </button>
    </div>
  );
};

export default EventDetail;