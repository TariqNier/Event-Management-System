import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function CreateEvent() {
  const [formData, setFormData] = useState({
    title: "", location: "", date: "", time: "",
    standard_price: "", standard_limit: "",
    vip_price: "", vip_limit: "",
    backstage_price: "", backstage_limit: "", description: ""
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const MY_TOKEN = localStorage.getItem('userToken');

  useEffect(() => {
    if (!MY_TOKEN) {
        // Optional: Redirect or just show the access denied UI
    }
  }, [MY_TOKEN]);

  if (!MY_TOKEN) {
    return (
        <div className="main-container">
            <div className="card" style={{textAlign: 'center', padding: '50px'}}>
                <h2>Access Denied</h2>
                <p>You must be logged in to create events.</p>
                <a href="/login" className="btn-primary" style={{display: 'inline-block', marginTop: '20px', textDecoration: 'none'}}>
                    Go to Login
                </a>
            </div>
        </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    const payload = { ...formData };
    
    // Safety: Convert empty strings to null so Django doesn't crash
    if (!payload.vip_price) payload.vip_price = null;
    if (!payload.vip_limit) payload.vip_limit = null;
    if (!payload.backstage_price) payload.backstage_price = null;
    if (!payload.backstage_limit) payload.backstage_limit = null;

    try {
      const response = await fetch("http://127.0.0.1:8000/events/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${MY_TOKEN}` 
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: "Success! Event #" + data.id + " created.", type: "success" });
        setFormData({ 
            title: "", location: "", date: "", time: "", 
            standard_price: "", standard_limit: "", 
            vip_price: "", vip_limit: "", 
            backstage_price: "", backstage_limit: "", description: "" 
        });
      } else {
        const errorMsg = Object.values(data).flat().join(", ");
        setMessage({ text: "Error: " + errorMsg, type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Network Error: Is Django running?", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
        <div className="card">
            <div className="card-header">
                <h1>Create New Event</h1>
                <p>Fill in the details to launch your next big event.</p>
            </div>

            {loading && <div className="status-banner loading">Creating event...</div>}
            {message.text && (
                <div className={`status-banner ${message.type}`}>
                    {message.text}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="event-form">
                <div className="form-section">
                    <div className="input-group">
                        <label>Event Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Summer Music Festival" />
                    </div>
                    <div className="input-group">
                        <label>Location</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Cairo Stadium" />
                    </div>
                    <div className="row">
                        <div className="input-group">
                            <label>Date</label>
                            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Time</label>
                            <input type="time" name="time" value={formData.time} onChange={handleChange} required />
                        </div>
                    </div>
                </div>

                <hr className="divider" />
                
                <div className="form-section">
                    <h3>Ticket Configuration</h3>
                    
                    <div className="ticket-tier standard">
                        <h4>Standard Tier</h4>
                        <div className="row">
                            <div className="input-group">
                                <label>Price ($)</label>
                                <input type="number" step="0.01" name="standard_price" value={formData.standard_price} onChange={handleChange} required placeholder="0.00"/>
                            </div>
                            <div className="input-group">
                                <label>Limit</label>
                                <input type="number" name="standard_limit" value={formData.standard_limit} onChange={handleChange} required placeholder="100"/>
                            </div>
                        </div>
                    </div>

                    <div className="ticket-tier vip">
                        <h4>VIP Tier <span className="badge">Optional</span></h4>
                        <div className="row">
                            <div className="input-group">
                                <label>Price ($)</label>
                                <input type="number" step="0.01" name="vip_price" value={formData.vip_price} onChange={handleChange} placeholder="0.00"/>
                            </div>
                            <div className="input-group">
                                <label>Limit</label>
                                <input type="number" name="vip_limit" value={formData.vip_limit} onChange={handleChange} placeholder="50"/>
                            </div>
                        </div>
                    </div>

                    <div className="ticket-tier vip" style={{borderColor: '#7c3aed', backgroundColor: '#f5f3ff'}}> 
                        <h4 style={{color: '#7c3aed'}}>Backstage Tier <span className="badge" style={{background: '#ddd6fe', color: '#7c3aed'}}>Rare</span></h4>
                        <div className="row">
                            <div className="input-group">
                                <label>Price ($)</label>
                                <input type="number" step="0.01" name="backstage_price" value={formData.backstage_price} onChange={handleChange} placeholder="0.00"/>
                            </div>
                            <div className="input-group">
                                <label>Limit</label>
                                <input type="number" name="backstage_limit" value={formData.backstage_limit} onChange={handleChange} placeholder="10"/>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Processing...' : 'Publish Event'}
                </button>
            </form>
        </div>
    </div>
  );
}

export default CreateEvent;