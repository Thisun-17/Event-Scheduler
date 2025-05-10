import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const EventsList = ({ events, loading }) => {
  const [filter, setFilter] = useState('all');
  const [category, setCategory] = useState('');

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    const eventDate = new Date(event.date);
    const today = new Date();
    
    if (filter === 'today') {
      return eventDate.toDateString() === today.toDateString();
    } else if (filter === 'upcoming') {
      return eventDate > today;
    } else if (filter === 'past') {
      return eventDate < today;
    } else if (filter === 'category' && category) {
      return event.category === category;
    }
    return true;
  });

  // Get unique categories from events
  const categories = [...new Set(events.map(event => event.category))];

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div className="events-list">
      <h2>Events</h2>
      <div className="filter-controls">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Events</option>
          <option value="today">Today</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="category">By Category</option>
        </select>
        
        {filter === 'category' && (
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        )}
      </div>
      
      {filteredEvents.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="events-grid">
          {filteredEvents.map(event => (
            <li key={event._id} className="event-card">
              <h3>{event.name}</h3>
              <p><strong>Date:</strong> {format(new Date(event.date), 'PPP')}</p>
              <p><strong>Time:</strong> {format(new Date(event.date), 'p')}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <Link to={`/event/${event._id}`} className="btn btn-details">View Details</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventsList;