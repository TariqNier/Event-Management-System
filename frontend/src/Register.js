import React, { useState } from 'react';
import './App.css'; 

function Register() {
  const [formData, setFormData] = useState({
    username: "", email: "", password: "", confirmPassword: ""
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
        setMessage({ text: "Passwords do not match!", type: "error" });
        return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: "Account created! Welcome, " + data.username, type: "success" });
        // Clear form
        setFormData({ username: "", email: "", password: "", confirmPassword: "" });
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
        <div className="card" style={{ maxWidth: "500px", margin: "0 auto" }}>
            <div className="card-header">
                <h1>Join Us</h1>
                <p>Create your account to start booking events.</p>
            </div>

            {message.text && (
                <div className={`status-banner ${message.type}`}>
                    {message.text}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="event-form">
                <div className="input-group">
                    <label>Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>
            
            <p style={{textAlign: 'center', marginTop: '1.5rem', color: '#6b7280'}}>
                Already have an account? <a href="/login" style={{color: '#4f46e5', fontWeight: '600', textDecoration: 'none'}}>Login here</a>
            </p>
        </div>
    </div>
  );
}

export default Register;