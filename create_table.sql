-- Create the foods table for Nutri-Order
DROP TABLE IF EXISTS foods;

CREATE TABLE foods (
  id TEXT PRIMARY KEY,
  name VARCHAR(500) NOT NULL,
  category VARCHAR(50) NOT NULL,
  type VARCHAR(20) NOT NULL,
  calories INTEGER NOT NULL,
  protein DECIMAL(10, 2) NOT NULL,
  carbs DECIMAL(10, 2) NOT NULL,
  fat DECIMAL(10, 2) NOT NULL,
  fiber DECIMAL(10, 2) NOT NULL,
  price INTEGER NOT NULL,
  image TEXT NOT NULL,
  swiggy_url TEXT,
  zomato_url TEXT,
  description TEXT,
  benefits TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_foods_category ON foods(category);
CREATE INDEX idx_foods_type ON foods(type);
CREATE INDEX idx_foods_price ON foods(price);

-- Enable Row Level Security (optional, for security)
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access
CREATE POLICY "Allow public read access"
  ON foods FOR SELECT
  USING (true);
