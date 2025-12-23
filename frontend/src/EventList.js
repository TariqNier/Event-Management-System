import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const MY_TOKEN = localStorage.getItem('userToken');

  // Helper: Check if date is in the past
  const isPastEvent = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const eventDate = new Date(dateString);
    return eventDate < today;
  };

  useEffect(() => {
    if (!MY_TOKEN) {
        navigate("/login");
        return;
    }

    const fetchEvents = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/events/", {
          headers: { "Authorization": `Token ${MY_TOKEN}` }
        });
        const data = await response.json();
        if (response.ok) {
            setEvents(data.results || data); 
        }
      } catch (error) {
        console.error("Error fetching events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [MY_TOKEN, navigate]);

  if (loading) return <div className="status-banner loading">Loading events...</div>;

  return (
    <div className="main-container">
      <div className="card-header">
        <h1>Upcoming Events</h1>
        <p>Book your tickets before they run out.</p>
      </div>

      <div className="event-list">
        {events.map((event) => {
            const isPast = isPastEvent(event.date);
            const isSoldOut = event.is_sold_out;
            const isDisabled = isPast || isSoldOut; 

            return (
                <div 
                    key={event.id} 
                    className={`event-card ${isPast ? 'past-event' : ''} ${isSoldOut ? 'sold-out-event' : ''}`}
                    onClick={() => {
                        if (!isDisabled) {
                            navigate(`/events/${event.id}`);
                        }
                    }}
                >
                    {isSoldOut && !isPast && <div className="badge-sold-out">SOLD OUT</div>}
                    {isPast && <div className="badge-past">EVENT ENDED</div>}

                    <div className="event-info">
                        <h2 className="event-title">{event.title}</h2>
                        <p className="event-meta">📍 {event.location} | 📅 {event.date} at {event.time}</p>
                        
                        <div className="ticket-preview">
                            <span className="price-tag">${event.standard_price}</span>
                            <span className="tickets-left">
                                {isPast ? "0" : event.standard_left} Standard tickets left
                            </span>
                        </div>
                    </div>
                    
                    {!isDisabled && <div className="arrow-icon">→</div>}
                </div>
            );
        })}
      </div>
    </div>
  );
}

export default EventList;