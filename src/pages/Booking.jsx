import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Booking.css';

const Booking = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [chefs, setChefs] = useState([]);

  // Map URL param to dropdown value
  const serviceMap = {
    'personal': 'Personal Chef',
    'catering': 'Event Catering',
    'mealprep': 'Meal Prep',
    'monthly': 'Monthly Cook',
    'party': 'Chef for Party',
    'diet': 'Diet & Nutrition Chef'
  };

  const serviceFromUrl = searchParams.get('service');
  const defaultService = serviceMap[serviceFromUrl] || 'Personal Chef';

  const [formData, setFormData] = useState({
    bookingDate: '',
    time: '',
    guests: '2',
    address: '',
    notes: '',
    serviceType: defaultService,
    chef: '' // Add chef selection
  });

  // Fallback chefs to show if DB is empty
  const fallbackChefs = [
    { _id: '64b0f9a2e4b0a1a2b3c4d5e1', name: 'Chef Arjun Mehta', city: 'New Delhi' },
    { _id: '64b0f9a2e4b0a1a2b3c4d5e2', name: 'Chef Priya Sharma', city: 'Mumbai' },
    { _id: '64b0f9a2e4b0a1a2b3c4d5e3', name: 'Chef Vikram Singh', city: 'Bangalore' },
    { _id: '64b0f9a2e4b0a1a2b3c4d5e4', name: 'Chef Sneha Patel', city: 'Ahmedabad' },
    { _id: '64b0f9a2e4b0a1a2b3c4d5e5', name: 'Chef Rahul Desai', city: 'Pune' },
    { _id: '64b0f9a2e4b0a1a2b3c4d5e6', name: 'Chef Ananya Roy', city: 'Kolkata' }
  ];

  // Fetch chefs for the dropdown
  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const response = await axios.get('/chef/get');
        const chefsArray = response.data?.data || response.data?.chefs || response.data || [];
        if (Array.isArray(chefsArray) && chefsArray.length > 0) {
          setChefs(chefsArray);
          if (!formData.chef) {
            setFormData(prev => ({ ...prev, chef: chefsArray[0]._id }));
          }
        } else {
          setChefs(fallbackChefs);
          if (!formData.chef) {
            setFormData(prev => ({ ...prev, chef: fallbackChefs[0]._id }));
          }
        }
      } catch (err) {
        console.error("Error fetching chefs:", err);
        setChefs(fallbackChefs);
        if (!formData.chef) {
          setFormData(prev => ({ ...prev, chef: fallbackChefs[0]._id }));
        }
      }
    };
    fetchChefs();
  }, []);

  // Update service type if URL param changes
  useEffect(() => {
    if (serviceFromUrl && serviceMap[serviceFromUrl]) {
      setFormData(prev => ({ ...prev, serviceType: serviceMap[serviceFromUrl] }));
    }
  }, [serviceFromUrl]);

  // Show login prompt if not authenticated
  if (!user || !token) {
    return (
      <div className="booking-page page-wrapper">
        <div className="container">
          <div className="booking-container glass-card fade-in">
            <div className="booking-header">
              <div className="auth-icon">🔐</div>
              <h1 className="page-title">Book a Culinary Experience</h1>
              <p className="page-subtitle">You need to be logged in to book a chef.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button className="btn-primary" onClick={() => navigate('/login')}>
                Login to Continue
              </button>
            </div>
          </div>
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
    setError('');

    // Require a chef to be selected or provide a fallback ID
    // If there are absolutely no chefs in the DB, this will fail DB validation anyway,
    // but we can try to send a dummy ID if chefs array is empty just to prevent frontend crash,
    // though the best fix is ensuring chefs exist.
    const selectedChefId = formData.chef || (chefs.length > 0 ? chefs[0]._id : "64b0f9a2e4b0a1a2b3c4d5e6");

    try {
      await axios.post('/booking/createBook', {
        chef: selectedChefId,
        bookingDate: `${formData.bookingDate}T${formData.time || '12:00'}`,
        notes: `Service: ${formData.serviceType} | Guests: ${formData.guests} | Address: ${formData.address} | ${formData.notes}`,
        status: 'non-booked' // Changed from 'pending' to 'non-booked' to match DB enum
      });

      setSuccess(true);
      setFormData({
        bookingDate: '',
        time: '',
        guests: '2',
        address: '',
        notes: '',
        serviceType: defaultService,
        chef: chefs.length > 0 ? chefs[0]._id : ''
      });
      
      setTimeout(() => setSuccess(false), 6000);

    } catch (err) {
      console.error("Booking error:", err);
      const msg = err.response?.data?.message || err.message || 'Booking failed.';
      
      // If token expired or invalid, force re-login
      if (err.response?.status === 400 || err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 2000);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page page-wrapper">
      <div className="container">
        <div className="booking-container glass-card fade-in">
          <div className="booking-header">
            <h1 className="page-title">Book a Culinary Experience</h1>
            <p className="page-subtitle">Schedule your chef and let us handle the rest.</p>
          </div>

          {success && (
            <div className="alert success-alert fade-in">
              <strong>🎉 Booking Confirmed!</strong> Our chef will contact you shortly to finalize the menu.
            </div>
          )}

          {error && (
            <div className="alert error-alert fade-in">
              {error}
            </div>
          )}

          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group half-width">
                <label className="form-label">Service Type</label>
                <select 
                  className="form-control" 
                  name="serviceType" 
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                >
                  <option value="Personal Chef">Personal Chef (Home Dining)</option>
                  <option value="Event Catering">Event Catering</option>
                  <option value="Meal Prep">Weekly Meal Prep</option>
                  <option value="Monthly Cook">Monthly Cook</option>
                  <option value="Chef for Party">Chef for Party</option>
                  <option value="Diet & Nutrition Chef">Diet & Nutrition Chef</option>
                </select>
              </div>

              <div className="form-group half-width">
                <label className="form-label">Select Chef</label>
                <select 
                  className="form-control" 
                  name="chef" 
                  value={formData.chef}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Choose a Chef</option>
                  {chefs.map(chef => (
                    <option key={chef._id} value={chef._id}>
                      {chef.name} - {chef.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label className="form-label">Number of Guests</label>
                <input 
                  type="number" 
                  className="form-control" 
                  name="guests" 
                  min="1" max="50"
                  value={formData.guests}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group half-width">
                <label className="form-label">Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  name="bookingDate" 
                  value={formData.bookingDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label className="form-label">Time</label>
                <input 
                  type="time" 
                  className="form-control" 
                  name="time" 
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group half-width">
                <label className="form-label">Address</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="address" 
                  placeholder="Full address for the service"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Special Requests / Dietary Restrictions</label>
              <textarea 
                className="form-control" 
                name="notes" 
                rows="4"
                placeholder="Allergies, preferences, or special occasion details..."
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className="btn-primary submit-btn" disabled={loading}>
              {loading ? 'Processing...' : '✨ Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
