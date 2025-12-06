-- Create the foods table for Nutri-Order
CREATE TABLE IF NOT EXISTS foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('breakfast', 'lunch', 'dinner', 'snack')),
  type VARCHAR(20) NOT NULL CHECK (type IN ('veg', 'non-veg')),
  calories INTEGER NOT NULL,
  protein DECIMAL(5, 2) NOT NULL,
  carbs DECIMAL(5, 2) NOT NULL,
  fat DECIMAL(5, 2) NOT NULL,
  fiber DECIMAL(5, 2) NOT NULL,
  price INTEGER NOT NULL,
  image TEXT NOT NULL,
  swiggy_url TEXT,
  zomato_url TEXT,
  description TEXT,
  benefits TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_foods_category ON foods(category);
CREATE INDEX idx_foods_type ON foods(type);
CREATE INDEX idx_foods_price ON foods(price);

-- Insert sample data
INSERT INTO foods (name, category, type, calories, protein, carbs, fat, fiber, price, image, description, benefits) VALUES
('Idli Sambar', 'breakfast', 'veg', 180, 6, 32, 3, 4, 60, 'https://images.unsplash.com/photo-1585238341710-4913d3a3a554?w=500&h=400&fit=crop&q=85', 'Soft steamed rice cakes with nutritious lentil soup', 'Low calorie,Easy to digest,Rich in protein'),
('Poha', 'breakfast', 'veg', 250, 5, 45, 6, 3, 50, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', 'Flattened rice with peanuts and curry leaves', 'Iron rich,Quick energy,Light on stomach'),
('Upma', 'breakfast', 'veg', 220, 6, 35, 7, 4, 55, 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400', 'Savory semolina porridge with vegetables', 'High fiber,Complex carbs,Filling'),
('Masala Dosa', 'breakfast', 'veg', 320, 8, 50, 10, 3, 80, 'https://images.unsplash.com/photo-1585238341710-4913d3a3a554?w=500&h=400&fit=crop&q=85', 'Crispy rice crepe with spiced potato filling', 'Probiotic,Good protein,Energy boost'),
('Aloo Paratha with Curd', 'breakfast', 'veg', 380, 10, 52, 15, 4, 70, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', 'Indian flatbread with potato filling and yogurt', 'High energy,Protein rich,Satisfying'),
('Egg Curry', 'breakfast', 'non-veg', 280, 14, 8, 22, 1, 100, 'https://images.unsplash.com/photo-1585238341710-4913d3a3a554?w=500', 'Spiced eggs in gravy', 'High protein,Good fat,Vitamin D'),
('Chicken Curry with Rice', 'lunch', 'non-veg', 450, 32, 48, 12, 2, 180, 'https://images.unsplash.com/photo-1585238341710-4913d3a3a554?w=500', 'Tender chicken in aromatic spices', 'High protein,Iron rich,Balanced meal'),
('Dal Rice', 'lunch', 'veg', 380, 12, 62, 5, 6, 90, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', 'Lentils with steamed rice', 'Complete protein,High fiber,Affordable'),
('Paneer Tikka Masala', 'lunch', 'veg', 420, 28, 32, 18, 3, 150, 'https://images.unsplash.com/photo-1585238341710-4913d3a3a554?w=500', 'Cottage cheese in creamy tomato sauce', 'High calcium,Good protein,Creamy'),
('Fish Curry', 'lunch', 'non-veg', 280, 35, 8, 12, 1, 200, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', 'Fresh fish in coconut curry', 'Omega 3,High protein,Healthy fats'),
('Biryani', 'lunch', 'non-veg', 550, 28, 68, 16, 3, 220, 'https://images.unsplash.com/photo-1585238341710-4913d3a3a554?w=500', 'Fragrant rice with meat and spices', 'Complete meal,Flavorful,Filling'),
('Chole Bhature', 'lunch', 'veg', 520, 16, 74, 14, 8, 85, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', 'Chickpeas curry with fried bread', 'High fiber,Protein rich,Traditional'),
('Vegetable Soup', 'snack', 'veg', 120, 4, 18, 3, 3, 40, 'https://images.unsplash.com/photo-1585238341710-4913d3a3a554?w=500', 'Warm vegetable broth', 'Low calorie,Hydrating,Healthy'),
('Samosa (2pc)', 'snack', 'veg', 280, 6, 32, 14, 2, 50, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', 'Fried pastry with spiced filling', 'Tasty,Satisfying,Quick snack'),
('Grilled Chicken Breast', 'dinner', 'non-veg', 280, 42, 0, 12, 0, 180, 'https://images.unsplash.com/photo-1585238341710-4913d3a3a554?w=500', 'Lean grilled chicken', 'High protein,Low carb,Healthy'),
('Tandoori Chicken', 'dinner', 'non-veg', 320, 40, 8, 14, 1, 200, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', 'Spiced yogurt marinated chicken', 'High protein,Flavorful,Healthy'),
('Vegetable Stir Fry with Rice', 'dinner', 'veg', 350, 10, 56, 8, 6, 110, 'https://images.unsplash.com/photo-1585238341710-4913d3a3a554?w=500', 'Mixed vegetables with steamed rice', 'Low fat,High fiber,Nutritious'),
('Roti with Sabzi', 'dinner', 'veg', 280, 8, 44, 7, 5, 70, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', 'Indian flatbread with vegetable curry', 'Simple,Filling,Traditional');
