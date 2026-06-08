import React, { useState, useEffect } from 'react';
import './Chefs.css';

const Chefs = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback data with gender-appropriate real Indian faces from Unsplash
  const fallbackChefs = [
    {
      _id: 'f1',
      name: 'Chef Arjun Mehta',
      gender: 'male',
      experience: 12,
      aboutCook: 'Specializes in North Indian cuisine with a flair for Mughlai dishes. Has cooked for celebrity events across Delhi.',
      city: 'New Delhi',
      veg: true,
      nonVeg: true,
      starRating: 4.9,
      profilepic: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' // Real Indian male
    },
    {
      _id: 'f2',
      name: 'Chef Priya Sharma',
      gender: 'female',
      experience: 8,
      aboutCook: 'Expert in South Indian and Continental cuisine. Known for her innovative fusion dishes and healthy meal prep.',
      city: 'Mumbai',
      veg: true,
      nonVeg: false,
      starRating: 4.8,
      profilepic: 'https://images.unsplash.com/photo-1627885481745-0d70eb00970a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' // Real Indian female
    },
    {
      _id: 'f3',
      name: 'Chef Vikram Singh',
      gender: 'male',
      experience: 15,
      aboutCook: 'Award-winning chef with expertise in multi-cuisine cooking. Former head chef at 5-star hotel chains.',
      city: 'Bangalore',
      veg: true,
      nonVeg: true,
      starRating: 5.0,
      profilepic: 'https://images.unsplash.com/photo-1621350438157-19eb50e3001f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' // Real Indian male
    },
    {
      _id: 'f4',
      name: 'Chef Sneha Patel',
      gender: 'female',
      experience: 6,
      aboutCook: 'Passionate about Gujarati and Rajasthani cuisines. Creates authentic, home-style meals with a gourmet touch.',
      city: 'Ahmedabad',
      veg: true,
      nonVeg: false,
      starRating: 4.7,
      profilepic: 'https://images.unsplash.com/photo-1596495577660-f42f5341f238?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' // Real Indian female
    },
    {
      _id: 'f5',
      name: 'Chef Rahul Desai',
      gender: 'male',
      experience: 10,
      aboutCook: 'Trained in Italian and Mediterranean cuisine. Known for his pasta, risotto, and wood-fired pizzas.',
      city: 'Pune',
      veg: true,
      nonVeg: true,
      starRating: 4.6,
      profilepic: 'https://images.unsplash.com/photo-1566810237731-1e967a1da4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' // Real Indian male
    },
    {
      _id: 'f6',
      name: 'Chef Ananya Roy',
      gender: 'female',
      experience: 9,
      aboutCook: 'Bengali cuisine specialist with deep knowledge of traditional fish preparations and sweets. A true culinary artist.',
      city: 'Kolkata',
      veg: true,
      nonVeg: true,
      starRating: 4.8,
      profilepic: 'https://images.unsplash.com/photo-1608681283622-482103f1eb9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' // Real Indian female
    }
  ];

  // Fallback images by gender for DB chefs that don't have photos
  const maleFallbacks = [
    'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1621350438157-19eb50e3001f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1566810237731-1e967a1da4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  ];

  const femaleFallbacks = [
    'https://images.unsplash.com/photo-1627885481745-0d70eb00970a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1596495577660-f42f5341f238?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1608681283622-482103f1eb9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  ];

  const getChefImage = (chef, index) => {
    if (chef.profilepic) return chef.profilepic;
    if (chef.default_cook_image) return chef.default_cook_image;
    // Guess gender from name for DB chefs
    const femaleNames = ['priya', 'sneha', 'ananya', 'meera', 'kavita', 'ritu', 'neha', 'pooja', 'divya', 'sita', 'laxmi', 'rani'];
    const nameLC = (chef.name || '').toLowerCase();
    const isFemale = chef.gender === 'female' || femaleNames.some(n => nameLC.includes(n));
    const pool = isFemale ? femaleFallbacks : maleFallbacks;
    return pool[index % pool.length];
  };

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const response = await fetch('http://localhost:5000/chef/get');
        if (!response.ok) throw new Error('Failed to fetch chefs');
        const data = await response.json();
        const chefsArray = data.data || data.chefs || data || [];
        if (Array.isArray(chefsArray) && chefsArray.length > 0) {
          setChefs(chefsArray);
        } else {
          setChefs(fallbackChefs);
        }
      } catch (err) {
        console.error("Error fetching chefs:", err);
        setChefs(fallbackChefs);
      } finally {
        setLoading(false);
      }
    };

    fetchChefs();
  }, []);

  return (
    <div className="chefs-page page-wrapper">
      <div className="container">
        <header className="page-header fade-in">
          <h1 className="page-title">Meet Our Culinary Masters</h1>
          <p className="page-subtitle">
            Experience the finest dining with our world-class chefs, each bringing their unique flavors and passion to your table.
          </p>
        </header>

        {loading ? (
          <div className="spinner"></div>
        ) : (
          <div className="chefs-grid">
            {chefs.map((chef, index) => (
              <div 
                key={chef._id || index} 
                className="chef-card glass-card fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="chef-image-wrapper">
                  <img 
                    src={getChefImage(chef, index)} 
                    alt={chef.name || 'Chef'} 
                    className="chef-image"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = maleFallbacks[0];
                    }}
                  />
                  <div className="chef-overlay">
                    <span className="chef-specialty">{chef.city || 'Gourmet Cuisine'}</span>
                  </div>
                  {chef.starRating && (
                    <div className="chef-rating">⭐ {chef.starRating}</div>
                  )}
                </div>
                <div className="chef-info">
                  <h3 className="chef-name">{chef.name || 'Master Chef'}</h3>
                  <p className="chef-experience">{chef.experience ? `${chef.experience} Years Experience` : 'Expert Culinary Artist'}</p>
                  <div className="chef-tags">
                    {chef.veg && <span className="tag tag-veg">🥬 Veg</span>}
                    {chef.nonVeg && <span className="tag tag-nonveg">🍖 Non-Veg</span>}
                  </div>
                  <p className="chef-description">
                    {chef.aboutCook || chef.description || 'Passionate about creating unforgettable culinary experiences.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chefs;
