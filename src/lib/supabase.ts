import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not found. Please set environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface FoodItem {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  type: 'veg' | 'non-veg';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  price: number;
  image: string;
  swiggy_url?: string;
  zomato_url?: string;
  description?: string;
  benefits?: string[];
}

export const getFilteredFoods = async (
  category: string,
  dietType: 'veg' | 'non-veg' | 'both',
  maxPrice: number
): Promise<FoodItem[]> => {
  try {
    let query = supabase
      .from('foods')
      .select('*')
      .eq('category', category);

    if (dietType !== 'both') {
      query = query.eq('type', dietType);
    }

    query = query.lte('price', maxPrice).order('id');

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching foods:', error);
      return [];
    }

    return (data || []) as FoodItem[];
  } catch (err) {
    console.error('Error in getFilteredFoods:', err);
    return [];
  }
};

export const getAllFoods = async (): Promise<FoodItem[]> => {
  try {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .order('id');

    if (error) {
      console.error('Error fetching all foods:', error);
      return [];
    }

    return (data || []) as FoodItem[];
  } catch (err) {
    console.error('Error in getAllFoods:', err);
    return [];
  }
};

export const getFoodsByCategory = async (
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack'
): Promise<FoodItem[]> => {
  try {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .eq('category', category)
      .order('id');

    if (error) {
      console.error('Error fetching foods by category:', error);
      return [];
    }

    return (data || []) as FoodItem[];
  } catch (err) {
    console.error('Error in getFoodsByCategory:', err);
    return [];
  }
};

export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
