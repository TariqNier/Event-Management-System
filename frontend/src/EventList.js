import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- NEW: Pagination & Search States ---
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const MY_TOKEN = localStorage.getItem('userToken');

  const isPastEvent = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const eventDate = new Date(dateString);
    return eventDate < today;
  };

  // --- UPDATED: Fetch Function accepts a URL now ---
  const fetchEvents = useCallback(async (url = "http://127.0.0.1:8000/events/") => {
    setLoading(true);
    try {
      // If we are searching, append the query to the default URL
      // Note: If 'url' is a pagination link (e.g. page=2), it already has the search term in it!
      let finalUrl = url;
      if (url === "http://127.0.0.1:8000/events/" && searchQuery) {
          finalUrl = `${url}?search=${searchQuery}`; 
          // If your backend uses ?title= instead of ?search=, change it here.
      }

      const response = await fetch(finalUrl, {
        headers: { "Authorization": `Token ${MY_TOKEN}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        // Django DRF pagination structure: { count: 10, next: "...", previous: "...", results: [...] }
        if (data.results) {
            setEvents(data.results);
            setNextPage(data.next);      // Save the "Next Page" URL
            setPrevPage(data.previous);  // Save the "Previous Page" URL
        } else {
            // Fallback if pagination is turned off
            setEvents(data); 
        }
      }
    } catch (error) {
      console.error("Error fetching events", error);
    } finally {
      setLoading(false);
    }
  }, [MY_TOKEN, searchQuery]); // Re-create function if search query changes

  // Initial Load
  useEffect(() => {
    if (!MY_TOKEN) {
        navigate("/login");
        return;
    }
    fetchEvents(); 
    // We intentionally don't put fetchEvents in dependency array to avoid loops, 
    // unless we use useCallback (which we did above).
  }, [MY_TOKEN, navigate]); 

  const handleSearchSubmit = (e) => {
      e.preventDefault();
      fetchEvents(); // Trigger fetch with the new search term
  };

  if (loading && !events.length) return <div className="status-banner loading">Loading events...</div>;

  return (
    <div className="main-container">
      <div className="card-header">
        <h1>Upcoming Events</h1>
        <p>Book your tickets before they run out.</p>
      </div>

      {/* --- NEW: Search Bar --- */}
      <form onSubmit={handleSearchSubmit} style={{marginBottom: '20px', display: 'flex', gap: '10px'}}>
          <input 
            type="text" 
            placeholder="Search events..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
                flex: 1, 
                padding: '10px', 
                borderRadius: '8px', 
                border: '1px solid #d1d5db',
                fontSize: '1rem'
            }}
          />
          <button type="submit" className="btn-primary" style={{width: 'auto'}}>
            Search
          </button>
      </form>

      <div className="event-list">
        {events.length === 0 && !loading && <p style={{textAlign:'center', color:'#666'}}>No events found.</p>}
        
        {events.map((event) => {
            const isPast = isPastEvent(event.date);
            const isSoldOut = event.is_sold_out;
            const isDisabled = isPast || isSoldOut; 

            return (
                <div 
                    key={event.id} 
                    className={`event-card ${isPast ? 'past-event' : ''} ${isSoldOut ? 'sold-out-event' : ''}`}
                    onClick={() => {
                        if (!isDisabled) navigate(`/events/${event.id}`);
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

      {/* --- NEW: Pagination Controls --- */}
      <div style={{display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px'}}>
          <button 
            className="btn-secondary" 
            disabled={!prevPage} 
            onClick={() => fetchEvents(prevPage)}
            style={{opacity: !prevPage ? 0.5 : 1}}
          >
              ← Previous
          </button>
          
          <button 
            className="btn-secondary" 
            disabled={!nextPage} 
            onClick={() => fetchEvents(nextPage)}
            style={{opacity: !nextPage ? 0.5 : 1}}
          >
              Next →
          </button>
      </div>
    </div>
  );
}

export default EventList;