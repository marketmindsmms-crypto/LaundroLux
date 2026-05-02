const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { phone, password } = req.body;
  // Mock login for MVP
  res.json({ 
    success: true, 
    token: 'mock-jwt-token',
    user: { id: 'uuid-arjun', name: 'Arjun', phone, tier: 'Platinum' } 
  });
});

module.exports = router;
