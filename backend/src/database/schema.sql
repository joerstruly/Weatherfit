-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  location VARCHAR(100),
  zip_code VARCHAR(10),
  notification_time TIME DEFAULT '07:00',
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  notification_enabled BOOLEAN DEFAULT true,
  fcm_token TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Clothing Items Table
CREATE TABLE IF NOT EXISTS clothing_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  item_type VARCHAR(50) NOT NULL, -- shirt, pants, dress, jacket, shoes, accessory
  color_primary VARCHAR(50),
  color_secondary VARCHAR(50),
  style VARCHAR(50), -- casual, formal, sporty, business
  pattern VARCHAR(50), -- solid, striped, floral, plaid
  weather_suitability JSONB, -- {"warm": true, "cool": false, "cold": false, "rainy": true}
  formality_level INTEGER CHECK (formality_level >= 1 AND formality_level <= 5),
  ai_description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_clothing_items_user_id ON clothing_items(user_id);
CREATE INDEX IF NOT EXISTS idx_clothing_items_active ON clothing_items(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_clothing_items_type ON clothing_items(item_type);

-- Outfit History Table
CREATE TABLE IF NOT EXISTS outfit_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  outfit_date DATE NOT NULL,
  clothing_items UUID[] NOT NULL, -- Array of clothing_item ids
  weather_conditions JSONB,
  was_worn BOOLEAN DEFAULT NULL, -- NULL means not yet decided
  user_feedback VARCHAR(20), -- loved, liked, neutral, disliked
  reasoning TEXT, -- AI's explanation for the outfit
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_outfit_history_user_id ON outfit_history(user_id);
CREATE INDEX IF NOT EXISTS idx_outfit_history_date ON outfit_history(user_id, outfit_date DESC);

-- Upload Sessions Table (for tracking photo upload batches)
CREATE TABLE IF NOT EXISTS upload_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
  photo_urls TEXT[],
  items_extracted INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_upload_sessions_user_id ON upload_sessions(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
