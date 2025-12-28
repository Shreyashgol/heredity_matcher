const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('./config/passport');

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://heredity-matcher-ihp.vercel.app',
  'http://localhost:3000',
  process.env.CLIENT_URL 
].filter(Boolean); 

console.log('Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const { verifyToken } = require('./middleware/middleware');
const path = req


// Serve static files from reports directory (public access for PDF downloads)
// Must be BEFORE /api routes to avoid authentication middleware
app.use('/api/reports', express.static(path.join(__dirname, 'reports')));

app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);


app.get('/api/test-auth', (req, res) => {
  const authHeader = req.headers.authorization;
  res.json({
    hasAuthHeader: !!authHeader,
    authHeader: authHeader ? authHeader.substring(0, 30) + '...' : 'none',
    headers: Object.keys(req.headers),
    origin: req.headers.origin || 'none',
    referer: req.headers.referer || 'none',
    jwtSecretConfigured: !!process.env.JWT_SECRET,
    jwtSecretLength: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0,
    clientUrlConfigured: !!process.env.CLIENT_URL,
    clientUrl: process.env.CLIENT_URL || 'not set'
  });
});


app.get('/api/test-protected', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: 'Authentication successful!',
    userId: req.user.userId,
    userEmail: req.user.email
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