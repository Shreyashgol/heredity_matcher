const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await pool.query(
          'SELECT * FROM users WHERE google_id = $1',
          [profile.id]
        );

        if (existingUser.rows.length > 0) {
          return done(null, existingUser.rows[0]);
        }

        const emailUser = await pool.query(
          'SELECT * FROM users WHERE email = $1',
          [profile.emails[0].value]
        );

        if (emailUser.rows.length > 0) {
          await pool.query(
            'UPDATE users SET google_id = $1 WHERE id = $2',
            [profile.id, emailUser.rows[0].id]
          );
          return done(null, emailUser.rows[0]);
        }

        const newUser = await pool.query(
          'INSERT INTO users (email, name, google_id) VALUES ($1, $2, $3) RETURNING *',
          [profile.emails[0].value, profile.displayName, profile.id]
        );

        return done(null, newUser.rows[0]);
      } catch (error) {
        console.error('Error in Google Strategy:', error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, user.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
