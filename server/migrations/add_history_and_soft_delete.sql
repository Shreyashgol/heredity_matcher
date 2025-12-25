-- Add soft delete and history tracking columns

-- Add deleted_at column for soft deletes
ALTER TABLE people ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE relationships ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE conditions ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

-- Add updated_at column for tracking changes
ALTER TABLE people ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE relationships ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE conditions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create history table for audit trail
CREATE TABLE IF NOT EXISTS activity_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'CALCULATE_RISK'
  entity_type VARCHAR(50) NOT NULL, -- 'PERSON', 'RELATIONSHIP', 'CONDITION', 'REPORT'
  entity_id INTEGER,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster history queries
CREATE INDEX IF NOT EXISTS idx_activity_history_user_id ON activity_history(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_history_created_at ON activity_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_people_deleted_at ON people(deleted_at);
CREATE INDEX IF NOT EXISTS idx_relationships_deleted_at ON relationships(deleted_at);
CREATE INDEX IF NOT EXISTS idx_conditions_deleted_at ON conditions(deleted_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_people_updated_at ON people;
CREATE TRIGGER update_people_updated_at BEFORE UPDATE ON people
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_relationships_updated_at ON relationships;
CREATE TRIGGER update_relationships_updated_at BEFORE UPDATE ON relationships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_conditions_updated_at ON conditions;
CREATE TRIGGER update_conditions_updated_at BEFORE UPDATE ON conditions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
