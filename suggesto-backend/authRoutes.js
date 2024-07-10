// authRoutes.js
const express = require('express');
const admin = require('./firebase');

const router = express.Router();

// Verify user token
router.post('/verifyToken', async (req, res) => {
  const token = req.body.token;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    res.status(200).send(decodedToken);
  } catch (error) {
    res.status(401).send('Invalid Token');
  }
});

// Add other authentication routes as needed

module.exports = router;
