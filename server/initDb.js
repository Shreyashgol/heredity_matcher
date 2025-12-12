const pool = require('./config/db');

const createTables = async () => {
  try {
    // Enable ltree extension
    await pool.query('CREATE EXTENSION IF NOT EXISTS ltree;');

    // Create Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create People Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS people (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        birth_date DATE,
        gender VARCHAR(10),
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Create Relationships Table (Adjacency List for Graph)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS relationships (
        id SERIAL PRIMARY KEY,
        parent_id INTEGER REFERENCES people(id) ON DELETE CASCADE,
        child_id INTEGER REFERENCES people(id) ON DELETE CASCADE,
        type VARCHAR(20) CHECK (type IN ('Father', 'Mother')),
        UNIQUE(parent_id, child_id)
      );
    `);

    // Create Conditions Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS conditions (
        id SERIAL PRIMARY KEY,
        person_id INTEGER REFERENCES people(id) ON DELETE CASCADE,
        condition_name VARCHAR(100) NOT NULL,
        diagnosed_date DATE
      );
    `);

    console.log('✅ Database tables created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating database tables:', err);
    process.exit(1);
  }
};

createTables();
