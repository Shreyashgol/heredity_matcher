const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const pool = require('./config/db');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Heredity API Server - Family Health Tree');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});