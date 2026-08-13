import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackServices = [
    {
      _id: '1',
      servicename: 'Personal Chef',
      slug: 'personal',
      description: 'Enjoy restaurant-quality meals in the comfort of your own home. Our chefs handle everything from grocery shopping to cooking and cleanup.',
      icon: '👨‍🍳'
    },
    {
      _id: '2',
      servicename: 'Event Catering',
      slug: 'catering',
      description: 'Make your special occasions unforgettable with bespoke menus crafted specifically for your event, whether it is a wedding or corporate gathering.',
      icon: '🎉'
    },
    {
      _id: '3',
      servicename: 'Meal Prep Weekly',
      slug: 'mealprep',
      description: 'Stay healthy and save time with our customized weekly meal prep service, delivered fresh to your door.',
      icon: '🥗'
    },
    {
      _id: '4',
      servicename: 'Monthly Cook',
      slug: 'monthly',
      description: 'Hire a trained cook on a monthly subscription basis for daily home-cooked meals. No more worrying about everyday cooking!',
      icon: '📅'
    },
    {
      _id: '5',
      servicename: 'Chef for Party',
      slug: 'party',
      description: 'Hosting a get-together? Get multi-cuisine expert chefs to handle the food while you enjoy with your guests.',
      icon: '🥂'
    },
    {
      _id: '6',
      servicename: 'Diet & Nutrition Chef',
      slug: 'diet',
      description: 'Health-focused meal plans prepared by chefs trained in nutritional cooking. Perfect for weight management and special diets.',
      icon: '🥑'
    }
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/ser/get`);
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        } else {
          setServices(fallbackServices);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const icons = ['👨‍🍳', '🎉', '🥗', '📅', '🥂', '🥑', '🍽️', '✨'];
  const slugMap = { 'Personal Chef': 'personal', 'Event Catering': 'catering', 'Meal Prep Weekly': 'mealprep', 'Monthly Cook': 'monthly', 'Chef for Party': 'party', 'Diet & Nutrition Chef': 'diet' };

  return (
    <div className="services-page page-wrapper">
      <div className="container">
        <header className="page-header fade-in">
          <h1 className="page-title">Our Premium Services</h1>
          <p className="page-subtitle">
            Tailored culinary experiences designed to elevate your lifestyle and events.
          </p>
        </header>

        {loading ? (
          <div className="spinner"></div>
        ) : (
          <div className="services-grid">
            {services.map((service, index) => {
              const name = service.servicename || service.title || service.name || '';
              const slug = service.slug || slugMap[name] || 'personal';
              return (
                <div 
                  key={service._id || index} 
                  className="service-card glass-card fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="service-icon">{service.icon || icons[index % icons.length]}</div>
                  <h3 className="service-title">{name}</h3>
                  <p className="service-description">{service.description}</p>
                  <Link to={`/booking?service=${slug}`} className="btn-outline service-btn">Book Now</Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
