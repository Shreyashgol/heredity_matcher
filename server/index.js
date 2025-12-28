const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

// console.log('✓ CORS configured');

app.use(express.json());

const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const path = require('path');

// console.log('✓ Routes imported');

// Serve static files from reports directory (public access for PDF downloads)
app.use('/reports', express.static(path.join(__dirname, 'reports')));

app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Heredity API Server - Family Health Tree',
    status: 'running',
    version: '1.0.0'
  });
});


app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: err.message });
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`✓ Server running on http://localhost:${port}`);
  console.log(`✓ Auth routes: http://localhost:${port}/api/auth/*`);
  console.log(`✓ API routes: http://localhost:${port}/api/*`);
});