import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not found. Please set environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface FoodItem {
  id?: string;
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
  swiggyUrl?: string;
  zomatoUrl?: string;
  description?: string;
  benefits?: string;
}

export const getFilteredFoods = async (
  category: string,
  dietType: 'veg' | 'non-veg' | 'both',
  maxPrice: number
): Promise<FoodItem[]> => {
  try {
    console.log(`Fetching foods: category=${category}, dietType=${dietType}, maxPrice=${maxPrice}`);
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

    console.log(`Fetched ${data?.length || 0} foods for category ${category}`);
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
    console.log(`Fetching all foods for category: ${category}`);
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .eq('category', category)
      .order('id');

    if (error) {
      console.error('Error fetching foods by category:', error);
      return [];
    }

    console.log(`Fetched ${data?.length || 0} foods for category ${category} (fallback)`);
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

export const calculateBMR = (
  weight: number,
  height: number,
  age: number,
  sex: 'male' | 'female'
): number => {
  if (sex === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
};

export const calculateTDEE = (bmr: number, activityLevel: string): number => {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very-active': 1.9
  };
  return bmr * (multipliers[activityLevel] || 1.2);
};

export const adjustCaloriesForGoal = (tdee: number, goal: string): number => {
  switch (goal) {
    case 'lose':
      return tdee - 500;
    case 'gain':
      return tdee + 300;
    default:
      return tdee;
  }
};
