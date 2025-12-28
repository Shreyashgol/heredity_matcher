-- Add google_id column to users table for OAuth
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;

-- Make password optional (for Google OAuth users)
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- Create index for faster Google ID lookups
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
