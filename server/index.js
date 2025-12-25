const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

console.log('🔧 Configuring CORS...');

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

console.log('✓ CORS configured');

// Body parser
app.use(express.json());

// Import routes
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

console.log('✓ Routes imported');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

console.log('✓ Routes mounted');

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Heredity API Server - Family Health Tree', status: 'running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: err.message });
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log('');
  console.log('========================================');
  console.log(`✓ Server running on http://localhost:${port}`);
  console.log(`✓ CORS enabled for all origins`);
  console.log(`✓ Auth routes: http://localhost:${port}/api/auth/*`);
  console.log(`✓ API routes: http://localhost:${port}/api/*`);
  console.log('========================================');
  console.log('');
});