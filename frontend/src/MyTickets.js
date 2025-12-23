import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const MY_TOKEN = localStorage.getItem('userToken');

  useEffect(() => {
    if (!MY_TOKEN) { navigate("/login"); return; }
    fetchTickets();
  }, [MY_TOKEN, navigate]);

  const fetchTickets = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/registrations/", {
          headers: { "Authorization": `Token ${MY_TOKEN}` }
      });
      const data = await response.json();
      if (response.ok) setTickets(data.results || data);
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  };

  // --- NEW: Handle Cancel Logic ---
  const handleCancel = async (ticketId) => {
    if(!window.confirm("Are you sure you want to cancel this ticket?")) return;

    try {
        const response = await fetch(`http://127.0.0.1:8000/registrations/${ticketId}/`, {
            method: "DELETE", // <--- The backend handles this automatically!
            headers: { 
                "Authorization": `Token ${MY_TOKEN}` 
            }
        });

        if (response.ok) {
            // Remove the deleted ticket from the list instantly
            setTickets(tickets.filter(t => t.id !== ticketId));
            alert("Ticket cancelled successfully.");
        } else {
            alert("Failed to cancel ticket.");
        }
    } catch (error) {
        alert("Network error.");
    }
  };

  if (loading) return <div className="status-banner loading">Loading your tickets...</div>;

  return (
    <div className="main-container">
        <div className="card-header">
            <h1>My Tickets</h1>
            <p>See you at the show!</p>
        </div>

        {tickets.length === 0 ? (
            <div className="card" style={{textAlign: 'center', padding: '3rem'}}>
                <h3>No tickets yet</h3>
                <p style={{color: '#6b7280', marginBottom: '1.5rem'}}>You haven't booked any events yet.</p>
                <button onClick={() => navigate("/events")} className="btn-primary">
                    Browse Events
                </button>
            </div>
        ) : (
            <div className="event-list">
                {tickets.map((ticket) => (
                    <div key={ticket.id} className="event-card" style={{cursor: 'default'}}>
                        <div className="event-info">
                            <h2 className="event-title">{ticket.event_info.title}</h2> 
                            <p className="event-meta">
                                📅 {ticket.event_info.date} • ⏰ {ticket.event_info.time} <br/>
                                📍 {ticket.event_info.location}
                            </p>
                            
                            <div className="ticket-preview">
                                <span className="price-tag" style={{background: '#d1fae5', color: '#065f46'}}>
                                    {ticket.ticket_type} TICKET
                                </span>
                                <span className="tickets-left" style={{color: '#6b7280'}}>
                                    Booked: {new Date(ticket.booking_date).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {/* --- NEW: Cancel Button --- */}
                        <button 
                            onClick={() => handleCancel(ticket.id)}
                            style={{
                                background: '#fee2e2', 
                                color: '#991b1b', 
                                border: '1px solid #fecaca',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
}

export default MyTickets;