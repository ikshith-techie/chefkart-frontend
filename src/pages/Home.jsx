import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <h1>Professional Home Cooks,<br/>On Demand.</h1>
          <p>Book a verified chef for your daily meals, house parties, or special events.</p>
          <div className="hero-buttons">
            <Link to="/booking" className="btn-primary">Book a Chef Now</Link>
            <Link to="/services" className="btn-outline">Explore Services</Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="services-overview">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid">
            
            <div className="service-card">
              <div className="service-icon">👨‍🍳</div>
              <h3>Chefit - One Time</h3>
              <p>Book a professional cook for a single meal session. Perfect for lazy weekends.</p>
              <Link to="/booking?service=personal" className="service-link">Book Now &rarr;</Link>
            </div>

            <div className="service-card">
              <div className="service-icon">🎉</div>
              <h3>Chef for Party</h3>
              <p>Hosting a get-together? Get multi-cuisine expert chefs to handle the food.</p>
              <Link to="/booking?service=party" className="service-link">Book Now &rarr;</Link>
            </div>

            <div className="service-card">
              <div className="service-icon">📅</div>
              <h3>Monthly Cook</h3>
              <p>Hire a trained cook on a monthly subscription basis for daily home-cooked meals.</p>
              <Link to="/booking?service=monthly" className="service-link">Book Now &rarr;</Link>
            </div>

          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose ChefKart?</h2>
          <div className="features-grid">
            <div className="feature">
              <h4>🛡️ Verified Professionals</h4>
              <p>All our chefs undergo strict background checks and identity verification.</p>
            </div>
            <div className="feature">
              <h4>🎓 Trained Experts</h4>
              <p>Chefs are trained in hygiene, safety protocols, and multi-cuisine cooking.</p>
            </div>
            <div className="feature">
              <h4>⚡ Quick Arrival</h4>
              <p>Book instantly and track your assigned chef right to your doorstep.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
