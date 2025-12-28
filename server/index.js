const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('./config/passport');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'https://heredity-matcher-c9sd.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// console.log('✓ CORS configured');

app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const path = require('path');

// console.log('✓ Routes imported');

// Serve static files from reports directory (public access for PDF downloads)
// Must be BEFORE /api routes to avoid authentication middleware
app.use('/api/reports', express.static(path.join(__dirname, 'reports')));

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