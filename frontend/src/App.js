import React, { useState } from 'react';

function App() {
  // 1. HARDCODE YOUR TOKEN HERE (Get this from Django Admin or /login/)
  const MY_TOKEN = "ada0d2bff0106dc793973b587deaee57d0c02af5"; 

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
    time: "",
    standard_price: "",
    standard_limit: "",
    vip_limit: "",
    vip_price: "",
    backstage_limit: "",
    backstage_price: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/events/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${MY_TOKEN}` // Send the token!
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Event Created Successfully! ID: " + data.id);
      } else {
        alert("Error: " + JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h1>Create an Event</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "300px", gap: "10px" }}>
        
        <input name="title" placeholder="Event Title" onChange={handleChange} required />
        <input name="location" placeholder="Location" onChange={handleChange} required />
        
        <label>Date:</label>
        <input type="date" name="date" onChange={handleChange} required />
        
        <label>Time:</label>
        <input type="time" name="time" onChange={handleChange} required />
        
        <input type="number" name="standard_price" placeholder="Price ($)" onChange={handleChange} required />
        <input type="number" name="standard_limit" placeholder="Capacity" onChange={handleChange} required />

        <button type="submit" style={{ padding: "10px", marginTop: "10px" }}>Create Event</button>
      </form>
    </div>
  );
}

export default App;