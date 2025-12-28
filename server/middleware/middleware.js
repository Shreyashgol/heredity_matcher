const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // Enhanced debug logging
    console.log('=== TOKEN VERIFICATION DEBUG ===');
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    console.log('Auth Header Present:', !!authHeader);
    console.log('Auth Header Value:', authHeader ? authHeader.substring(0, 30) + '...' : 'NONE');
    console.log('All Headers:', Object.keys(req.headers).join(', '));
    console.log('Origin:', req.headers.origin || 'NO ORIGIN');
    console.log('Referer:', req.headers.referer || 'NO REFERER');
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
    
    if (!authHeader) {
      console.log('❌ REJECTED: No authorization header');
      return res.status(401).json({
        success: false,
        error: 'No authorization header provided',
        debug: {
          headers: Object.keys(req.headers),
          url: req.url,
          method: req.method
        }
      });
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      console.log('❌ REJECTED: No token in authorization header');
      return res.status(401).json({
        success: false,
        error: 'No token provided in authorization header',
        debug: {
          authHeader: authHeader.substring(0, 20)
        }
      });
    }

    console.log('Token length:', token.length);
    console.log('Token starts with:', token.substring(0, 20) + '...');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified successfully');
    console.log('User ID:', decoded.userId);
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ Token verification error:', error.message);
    console.error('Error name:', error.name);
    console.error('Error stack:', error.stack);
    
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
      details: error.message,
      errorType: error.name,
      debug: {
        jwtSecretExists: !!process.env.JWT_SECRET,
        tokenLength: req.headers.authorization ? req.headers.authorization.split(' ')[1]?.length : 0
      }
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user'
    });
  }
};

module.exports = {verifyToken,getCurrentUser}