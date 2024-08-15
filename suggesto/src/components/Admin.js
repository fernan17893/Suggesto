// src/components/Admin.js

import React from 'react';
import { fetchAndStoreMovies } from '../services/tmdbService';

const Admin = () => {
  const handleFetchAndStoreMovies = async () => {
    await fetchAndStoreMovies();
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Admin Panel</h2>
      <button onClick={handleFetchAndStoreMovies}>Fetch and Store Movies</button>
    </div>
  );
};

export default Admin;
