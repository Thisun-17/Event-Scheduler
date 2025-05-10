
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Calendar from './components/Calendar';
import EventsList from './components/EventsList';
import EventForm from './components/EventForm';
import EventDetail from './components/EventDetail';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch events from your API
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events');
        const data = await response.json();
        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const addEvent = async (eventData) => {
    try {
      console.log('Sending event data:', eventData);
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server returned error:', errorData);
        alert(`Failed to create event: ${errorData.message || 'Unknown error'}`);
        return false;
      }
      
      const newEvent = await response.json();
      console.log('Event created successfully:', newEvent);
      setEvents([...events, newEvent]);
      return true;
    } catch (error) {
      console.error('Error adding event:', error);
      alert(`Failed to create event: ${error.message}`);
      return false;
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={
              <div className="home-page">
                <h1>Event Scheduler</h1>
                <Calendar events={events} />
                <EventsList events={events} loading={loading} />
              </div>
            } />
            <Route path="/add-event" element={<EventForm addEvent={addEvent} />} />
            <Route path="/event/:id" element={<EventDetail events={events} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;