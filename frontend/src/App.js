import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';

import CreateEvent from './CreateEvent';
import Register from './Register';
import Login from './Login';
import EventList from './EventList';
import EventDetails from './EventDetails';
import MyTickets from './MyTickets';

function App() {
  const userToken = localStorage.getItem('userToken');
  const rawRole = localStorage.getItem('userRole'); // Read raw value
  const userName = localStorage.getItem('userName');
  
  // Normalize role to Uppercase to avoid case issues (e.g., "admin" -> "ADMIN")
  const userRole = rawRole ? rawRole.toUpperCase() : "";

  // Debugging: Check your browser console to see exactly what is happening
  console.log("Logged in as:", userName, "| Role:", userRole);

  const handleLogout = () => {
    localStorage.clear(); 
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="app-wrapper">
        <nav className="navbar">
          
          {/* --- LEFT SIDE: Brand + Welcome Message --- */}
          <div className="nav-left">
            <div className="nav-brand">EventMgr</div>
            
            {/* Only show "Welcome" if logged in */}
            {userToken && userName && (
                <span className="nav-welcome">
                    Welcome, {userName}
                </span>
            )}
          </div>

          {/* --- RIGHT SIDE: Navigation Links --- */}
          <div className="nav-links">
            <Link to="/events">View Events</Link>
            
            {/* Only Organizer/Admin sees Create */}
            {userToken && (userRole === 'ORGANIZER' || userRole === 'ADMIN' || userRole === 'organizer' || userRole === 'admin') && (
    <Link to="/create">Create Event</Link>
)}

            {!userToken ? (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            ) : (
                <>
                    <Link to="/tickets">My Tickets</Link>
                    <button onClick={handleLogout} className="nav-logout-btn">
                        Logout
                    </button>
                </>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/events" />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/tickets" element={<MyTickets />} />
          
          <Route path="/create" element={
            (userToken && (userRole === 'ORGANIZER' || userRole === 'ADMIN')) 
            ? <CreateEvent /> : <Navigate to="/events" />
          } />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;