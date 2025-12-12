const pool = require('./config/db');

const resetDatabase = async () => {
  try {
    console.log('🗑️  Dropping existing tables...');
    
    // Drop tables in reverse order (due to foreign keys)
    await pool.query('DROP TABLE IF EXISTS conditions CASCADE;');
    await pool.query('DROP TABLE IF EXISTS relationships CASCADE;');
    await pool.query('DROP TABLE IF EXISTS people CASCADE;');
    await pool.query('DROP TABLE IF EXISTS users CASCADE;');
    
    console.log('✅ Tables dropped successfully!');
    console.log('📝 Creating new tables...');
    
    // Enable ltree extension
    await pool.query('CREATE EXTENSION IF NOT EXISTS ltree;');

    // Create Users Table
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create People Table
    await pool.query(`
      CREATE TABLE people (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        birth_date DATE,
        gender VARCHAR(10),
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Create Relationships Table
    await pool.query(`
      CREATE TABLE relationships (
        id SERIAL PRIMARY KEY,
        parent_id INTEGER REFERENCES people(id) ON DELETE CASCADE,
        child_id INTEGER REFERENCES people(id) ON DELETE CASCADE,
        type VARCHAR(20) CHECK (type IN ('Father', 'Mother')),
        UNIQUE(parent_id, child_id)
      );
    `);

    // Create Conditions Table
    await pool.query(`
      CREATE TABLE conditions (
        id SERIAL PRIMARY KEY,
        person_id INTEGER REFERENCES people(id) ON DELETE CASCADE,
        condition_name VARCHAR(100) NOT NULL,
        diagnosed_date DATE
      );
    `);

    console.log('✅ Database reset successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error resetting database:', err);
    process.exit(1);
  }
};

resetDatabase();
