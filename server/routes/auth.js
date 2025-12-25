const express = require('express');
const router = express.Router();
const {register,login} = require('../controllers/authController');

const {verifyToken} = require('../middleware/middleware');
const {getCurrentUser} = require('../middleware/middleware')

router.post('/register', register);
router.post('/login', login);

router.get('/me', verifyToken, getCurrentUser);

module.exports = router;
