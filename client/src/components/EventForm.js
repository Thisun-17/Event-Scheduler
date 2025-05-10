import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EventForm = ({ addEvent }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: '',
    sendReminder: false,
    reminderEmail: ''
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = 'Name is required';
    if (!formData.date) tempErrors.date = 'Date is required';
    if (!formData.time) tempErrors.time = 'Time is required';
    if (!formData.location) tempErrors.location = 'Location is required';
    if (formData.sendReminder && !formData.reminderEmail) {
      tempErrors.reminderEmail = 'Email is required for reminders';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Combine date and time
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      
      const eventData = {
        name: formData.name,
        date: dateTime.toISOString(),
        location: formData.location,
        description: formData.description,
        category: formData.category,
        reminder: formData.sendReminder ? {
          send: true,
          email: formData.reminderEmail
        } : {
          send: false
        }
      };
      
      const success = await addEvent(eventData);
      if (success) {
        navigate('/');
      }
    }
  };

  return (
    <div className="event-form-container">
      <h2>Add New Event</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label>Event Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>
        
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={errors.date ? 'error' : ''}
          />
          {errors.date && <span className="error-message">{errors.date}</span>}
        </div>
        
        <div className="form-group">
          <label>Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className={errors.time ? 'error' : ''}
          />
          {errors.time && <span className="error-message">{errors.time}</span>}
        </div>
        
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={errors.location ? 'error' : ''}
          />
          {errors.location && <span className="error-message">{errors.location}</span>}
        </div>
        
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="">Select a category</option>
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="family">Family</option>
            <option value="social">Social</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>
        
        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            name="sendReminder"
            checked={formData.sendReminder}
            onChange={handleChange}
            id="sendReminder"
          />
          <label htmlFor="sendReminder">Send email reminder</label>
        </div>
        
        {formData.sendReminder && (
          <div className="form-group">
            <label>Email for Reminder</label>
            <input
              type="email"
              name="reminderEmail"
              value={formData.reminderEmail}
              onChange={handleChange}
              className={errors.reminderEmail ? 'error' : ''}
            />
            {errors.reminderEmail && <span className="error-message">{errors.reminderEmail}</span>}
          </div>
        )}
        
        <button type="submit" className="btn btn-primary">Add Event</button>
      </form>
    </div>
  );
};

export default EventForm;