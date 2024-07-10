// movieRoutes.js
const express = require('express');

const router = express.Router();

// Route to get movie recommendations
router.post('/recommendations', (req, res) => {
  const { userPreferences } = req.body;

  // Example: Replace this with actual recommendation logic
  const recommendations = [
    { title: 'Inception', genre: 'Sci-Fi', rating: 8.8 },
    { title: 'The Dark Knight', genre: 'Action', rating: 9.0 }
  ];

  res.status(200).json(recommendations);
});

// Route to get filters
router.get('/filters', (req, res) => {
  const filters = {
    genres: ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'],
    ratings: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  };

  res.status(200).json(filters);
});

module.exports = router;
