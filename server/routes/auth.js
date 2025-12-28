const express = require('express');
const router = express.Router();
const {register,login} = require('../controllers/authController');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const client_url = process.env.CLIENT_URL;

const {verifyToken} = require('../middleware/middleware');
const {getCurrentUser} = require('../middleware/middleware')

router.post('/register', register);
router.post('/login', login);

router.get('/me', verifyToken, getCurrentUser);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${client_url}/login?error=auth_failed`,
    session: false 
  }),
  (req, res) => {
    try {
      const token = jwt.sign(
        { userId: req.user.id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Redirect to frontend with token
      res.redirect(`${client_url}/login?token=${token}&user=${encodeURIComponent(JSON.stringify({
        id: req.user.id,
        email: req.user.email,
        name: req.user.name
      }))}`);
    } catch (error) {
      console.error('Error in Google callback:', error);
      res.redirect(`${client_url}/login?error=token_generation_failed`);
    }
  }
);

module.exports = router;
