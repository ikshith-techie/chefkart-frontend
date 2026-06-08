import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './MyBookings.css';

const MyBookings = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fallbackChefs = {
    '64b0f9a2e4b0a1a2b3c4d5e1': { name: 'Chef Arjun Mehta', city: 'New Delhi', profilepic: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    '64b0f9a2e4b0a1a2b3c4d5e2': { name: 'Chef Priya Sharma', city: 'Mumbai', profilepic: 'https://images.unsplash.com/photo-1627885481745-0d70eb00970a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    '64b0f9a2e4b0a1a2b3c4d5e3': { name: 'Chef Vikram Singh', city: 'Bangalore', profilepic: 'https://images.unsplash.com/photo-1621350438157-19eb50e3001f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    '64b0f9a2e4b0a1a2b3c4d5e4': { name: 'Chef Sneha Patel', city: 'Ahmedabad', profilepic: 'https://images.unsplash.com/photo-1596495577660-f42f5341f238?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    '64b0f9a2e4b0a1a2b3c4d5e5': { name: 'Chef Rahul Desai', city: 'Pune', profilepic: 'https://images.unsplash.com/photo-1566810237731-1e967a1da4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    '64b0f9a2e4b0a1a2b3c4d5e6': { name: 'Chef Ananya Roy', city: 'Kolkata', profilepic: 'https://images.unsplash.com/photo-1608681283622-482103f1eb9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }
  };

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    const fetchMyBookings = async () => {
      try {
        const response = await axios.get('/booking/mybookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(response.data?.data || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load your bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [user, token, navigate]);

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked': return 'status-booked';
      case 'non-booked': return 'status-pending';
      default: return 'status-pending';
    }
  };

  return (
    <div className="my-bookings-page page-wrapper">
      <div className="container">
        <header className="page-header fade-in">
          <h1 className="page-title">My Bookings</h1>
          <p className="page-subtitle">Track and manage your upcoming culinary experiences.</p>
        </header>

        {loading ? (
          <div className="spinner"></div>
        ) : error ? (
          <div className="alert error-alert fade-in">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="empty-state glass-card fade-in">
            <div className="empty-icon">🍽️</div>
            <h3>No Bookings Yet</h3>
            <p>You haven't booked any chefs yet. Let's get cooking!</p>
            <button className="btn-primary mt-3" onClick={() => navigate('/booking')}>
              Book a Chef Now
            </button>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking, index) => (
              <div 
                key={booking._id} 
                className="booking-card glass-card fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="booking-status-wrapper">
                  <span className={`booking-status ${getStatusColor(booking.status)}`}>
                    {booking.status === 'non-booked' ? 'Pending Approval' : 'Confirmed'}
                  </span>
                  <span className="booking-date-label">Booked on: {new Date(booking.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="booking-content">
                  <div className="chef-min-card">
                    {(() => {
                      const chefId = booking.chef?._id || booking.chef;
                      const resolvedChef = (booking.chef && booking.chef.name) ? booking.chef : fallbackChefs[chefId];
                      
                      if (resolvedChef) {
                        return (
                          <>
                            <img 
                              src={resolvedChef.profilepic || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&q=80'} 
                              alt={resolvedChef.name} 
                              className="chef-avatar" 
                            />
                            <div>
                              <h4 className="chef-name">{resolvedChef.name}</h4>
                              <p className="chef-city">📍 {resolvedChef.city || 'Local'}</p>
                            </div>
                          </>
                        );
                      } else {
                        return (
                          <>
                            <div className="chef-avatar placeholder-avatar">👨‍🍳</div>
                            <div>
                              <h4 className="chef-name">Assigned Chef</h4>
                              <p className="chef-city">Details coming soon</p>
                            </div>
                          </>
                        );
                      }
                    })()}
                  </div>

                  <div className="booking-details">
                    <div className="detail-item">
                      <span className="detail-icon">🗓️</span>
                      <div>
                        <span className="detail-label">Service Date & Time</span>
                        <p className="detail-value">{formatDate(booking.bookingDate)}</p>
                      </div>
                    </div>

                    <div className="detail-item full-width">
                      <span className="detail-icon">📝</span>
                      <div>
                        <span className="detail-label">Booking Notes</span>
                        <p className="detail-value notes-text">{booking.notes || 'No special notes provided.'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
