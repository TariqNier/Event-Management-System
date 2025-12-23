import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './App.css';

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null); 
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const navigate = useNavigate();
  const MY_TOKEN = localStorage.getItem('userToken');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/events/${id}/`, {
            headers: { "Authorization": `Token ${MY_TOKEN}` }
        });
        const data = await response.json();
        if (response.ok) setEvent(data);
      } catch (error) {
        console.error("Error", error);
      }
    };
    if (MY_TOKEN) fetchEvent();
  }, [id, MY_TOKEN]);

  const handleBooking = async () => {
    if (!selectedTicket) {
        setMessage({ text: "Please select a ticket type first.", type: "error" });
        return;
    }

    setBookingLoading(true);
    setMessage({ text: "", type: "" });

    try {
        const response = await fetch("http://127.0.0.1:8000/registrations/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${MY_TOKEN}`
            },
            body: JSON.stringify({
                event: event.id,
                ticket_type: selectedTicket 
            })
        });

        const data = await response.json();

        if (response.ok) {
            setMessage({ text: "Booking Confirmed! See you there.", type: "success" });
            setTimeout(() => navigate("/events"), 1500); 
        } else {
            const errorMsg = data.error || Object.values(data).flat().join(", ");
            setMessage({ text: errorMsg, type: "error" });
        }
    } catch (error) {
        setMessage({ text: "Booking failed. Is the server running?", type: "error" });
    } finally {
        setBookingLoading(false);
    }
  };

  if (!event) return <div className="status-banner loading">Loading details...</div>;

  return (
    <div className="main-container">
        <button onClick={() => navigate("/events")} className="btn-secondary">← Back to List</button>
        
        <div className="card" style={{marginTop: "20px"}}>
            <div className="card-header">
                <h1>{event.title}</h1>
                <p>📍 {event.location} • 📅 {event.date} • ⏰ {event.time}</p>
            </div>

            {message.text && (
                <div className={`status-banner ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="form-section">
                <h3>Description</h3>
                <p style={{lineHeight: "1.6", color: "#4b5563"}}>
                    {event.description || "No description provided."}
                </p>
            </div>

            <hr className="divider" />

            <div className="form-section">
                <h3>Select Your Ticket</h3>
                
                {/* Standard Box */}
                <div 
                    className={`ticket-tier standard ${selectedTicket === 'STANDARD' ? 'selected-box' : ''}`}
                    onClick={() => setSelectedTicket('STANDARD')}
                    style={{cursor: 'pointer', transition: '0.2s'}}
                >
                    <div className="row" style={{alignItems: 'center', justifyContent: 'space-between'}}>
                        <h4>Standard Access {selectedTicket === 'STANDARD' && '✅'}</h4>
                        <span className="price-display">${event.standard_price}</span>
                    </div>
                    <p>{event.standard_left} tickets remaining</p>
                </div>

                {/* VIP Box */}
                {event.vip_price && (
                    <div 
                        className={`ticket-tier vip ${selectedTicket === 'VIP' ? 'selected-box' : ''}`}
                        onClick={() => setSelectedTicket('VIP')}
                        style={{cursor: 'pointer', transition: '0.2s'}}
                    >
                        <div className="row" style={{alignItems: 'center', justifyContent: 'space-between'}}>
                            <h4>VIP Access <span className="badge">Exclusive</span> {selectedTicket === 'VIP' && '✅'}</h4>
                            <span className="price-display">${event.vip_price}</span>
                        </div>
                        {/* CHANGED FROM LIMIT TO LEFT */}
                        <p>{event.vip_left} seats remaining</p> 
                    </div>
                )}

                {/* Backstage Box */}
                {event.backstage_price && (
                    <div 
                        className={`ticket-tier vip ${selectedTicket === 'BACKSTAGE' ? 'selected-box' : ''}`}
                        style={{
                            borderColor: selectedTicket === 'BACKSTAGE' ? '#7c3aed' : '#7c3aed', 
                            backgroundColor: selectedTicket === 'BACKSTAGE' ? '#ede9fe' : '#f5f3ff',
                            cursor: 'pointer',
                            borderWidth: selectedTicket === 'BACKSTAGE' ? '3px' : '1px'
                        }}
                        onClick={() => setSelectedTicket('BACKSTAGE')}
                    >
                        <div className="row" style={{alignItems: 'center', justifyContent: 'space-between'}}>
                            <h4 style={{color: '#7c3aed'}}>Backstage Pass <span className="badge" style={{background: '#ddd6fe', color: '#7c3aed'}}>Rare</span> {selectedTicket === 'BACKSTAGE' && '✅'}</h4>
                            <span className="price-display">${event.backstage_price}</span>
                        </div>
                        {/* CHANGED FROM LIMIT TO LEFT */}
                         <p>{event.backstage_left} seats remaining</p>
                    </div>
                )}
            </div>

            <button 
                className="btn-primary" 
                style={{width: "100%", opacity: selectedTicket ? 1 : 0.5}} 
                onClick={handleBooking}
                disabled={bookingLoading}
            >
                {bookingLoading ? "Booking..." : selectedTicket ? `Book ${selectedTicket} Ticket` : "Select a Ticket"}
            </button>
        </div>
    </div>
  );
}

export default EventDetails;