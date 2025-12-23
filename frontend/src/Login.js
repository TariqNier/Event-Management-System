import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './App.css'; 

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // SUCCESS: Save Token, Role, AND Username
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('userName', data.username);
        
        setMessage({ text: "Login Successful! Redirecting...", type: "success" });
        
        // Redirect to the Events List after 1 second
        setTimeout(() => {
            window.location.href = "/events";
        }, 1000);
        
      } else {
        setMessage({ text: "Error: " + (data.error || "Invalid credentials"), type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Network Error: Is Django running?", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
        <div className="card" style={{ maxWidth: "450px", margin: "0 auto" }}>
            <div className="card-header">
                <h1>Welcome Back</h1>
                <p>Login to manage your events.</p>
            </div>

            {message.text && (
                <div className={`status-banner ${message.type}`}>
                    {message.text}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="event-form">
                <div className="input-group">
                    <label>Username</label>
                    <input 
                        type="text" 
                        name="username" 
                        value={formData.username} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Checking...' : 'Login'}
                </button>
            </form>

            <p style={{textAlign: 'center', marginTop: '1.5rem', color: '#6b7280'}}>
                New here? <a href="/register" style={{color: '#4f46e5', fontWeight: '600', textDecoration: 'none'}}>Create an account</a>
            </p>
        </div>
    </div>
  );
}

export default Login;