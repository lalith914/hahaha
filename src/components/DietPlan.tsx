import { useMemo, useEffect, useState } from 'react';
import { MealSection } from './MealSection';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Target, Flame, Dumbbell, TrendingUp } from 'lucide-react';
import {
  calculateBMR,
  calculateTDEE,
  adjustCaloriesForGoal,
  getFilteredFoods,
  getFoodsByCategory,
  shuffleArray
} from '@/lib/supabase';

interface DietPlanProps {
  userData: {
    age: number;
    sex: 'male' | 'female';
    weight: number;
    height: number;
    activityLevel: string;
    goal: string;
    dietPreference: 'veg' | 'non-veg' | 'both';
    budget: number;
  };
  onBack: () => void;
}

export const DietPlan = ({ userData, onBack }: DietPlanProps) => {
  const [meals, setMeals] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyCalories, setDailyCalories] = useState(0);
  const [mealCalories, setMealCalories] = useState<any>(null);
  const [totalStats, setTotalStats] = useState<any>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    cost: 0
  });

  useEffect(() => {
    const generateDietPlan = async () => {
      try {
        setLoading(true);
        setError(null);

        const bmr = calculateBMR(userData.weight, userData.height, userData.age, userData.sex);
        const tdee = calculateTDEE(bmr, userData.activityLevel);
        const targetCalories = Math.round(adjustCaloriesForGoal(tdee, userData.goal));

        const mealDistribution = {
          breakfast: 0.25,
          lunch: 0.35,
          dinner: 0.25,
          snack: 0.15
        };

        const calculatedMealCalories = {
          breakfast: Math.round(targetCalories * mealDistribution.breakfast),
          lunch: Math.round(targetCalories * mealDistribution.lunch),
          dinner: Math.round(targetCalories * mealDistribution.dinner),
          snack: Math.round(targetCalories * mealDistribution.snack)
        };

        setDailyCalories(targetCalories);
        setMealCalories(calculatedMealCalories);

        const perMealBudget = userData.budget > 0 ? userData.budget / 4 : 1000; // Default to 1000 if no budget entered

        const selectBestFoods = async (
          category: 'breakfast' | 'lunch' | 'dinner' | 'snack',
          targetCal: number
        ) => {
          const available = await getFilteredFoods(category, userData.dietPreference, perMealBudget * 1.5);

          if (available.length === 0) {
            // Fallback: get foods without budget constraint
            const allFoodsInCategory = await getFoodsByCategory(category);
            if (userData.dietPreference !== 'both') {
              return allFoodsInCategory.filter(f => f.type === userData.dietPreference).slice(0, 3);
            }
            return allFoodsInCategory.slice(0, 3);
          }

          // Shuffle the available foods to get random variety
          const shuffled = shuffleArray(available);

          // Sort by nutritional value (protein/calorie ratio) but from the shuffled list
          const sorted = [...shuffled].sort((a, b) => {
            const scoreA = (a.protein * 2 + a.fiber) / (a.calories / 100);
            const scoreB = (b.protein * 2 + b.fiber) / (b.calories / 100);
            return scoreB - scoreA;
          });

          // Select foods that sum up close to target calories
          const selected = [];
          let currentCalories = 0;

          for (const food of sorted) {
            if (currentCalories + food.calories <= targetCal * 1.2 && selected.length < 4) {
              selected.push(food);
              currentCalories += food.calories;
            }
            if (currentCalories >= targetCal * 0.8 && selected.length >= 2) break;
          }

          // Shuffle the selected meals to show them in random order
          return selected.length > 0 ? shuffleArray(selected) : shuffleArray(sorted.slice(0, 3));
        };

        const [breakfast, lunch, dinner, snack] = await Promise.all([
          selectBestFoods('breakfast', calculatedMealCalories.breakfast),
          selectBestFoods('lunch', calculatedMealCalories.lunch),
          selectBestFoods('dinner', calculatedMealCalories.dinner),
          selectBestFoods('snack', calculatedMealCalories.snack)
        ]);

        const generatedMeals = { breakfast, lunch, dinner, snack };
        console.log('Generated meals:', generatedMeals);
        console.log('Breakfast:', breakfast.length, 'Lunch:', lunch.length, 'Dinner:', dinner.length, 'Snack:', snack.length);
        setMeals(generatedMeals);

        // Calculate total stats
        const allFoods = [...breakfast, ...lunch, ...dinner, ...snack];
        console.log('All foods:', allFoods);
        const stats = {
          calories: allFoods.reduce((sum: number, f: any) => sum + f.calories, 0),
          protein: allFoods.reduce((sum: number, f: any) => sum + f.protein, 0),
          carbs: allFoods.reduce((sum: number, f: any) => sum + f.carbs, 0),
          fat: allFoods.reduce((sum: number, f: any) => sum + f.fat, 0),
          fiber: allFoods.reduce((sum: number, f: any) => sum + f.fiber, 0),
          cost: allFoods.reduce((sum: number, f: any) => sum + f.price, 0)
        };
        console.log('Stats calculated:', stats);
        setTotalStats(stats);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error('Error generating diet plan:', errorMsg);
        setError(`Failed to generate diet plan: ${errorMsg}`);
        setMeals(null);
      } finally {
        setLoading(false);
      }
    };

    generateDietPlan();
  }, [userData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Generating your personalized diet plan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 p-6">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Card className="p-6 border-red-200 bg-red-50 dark:bg-red-900/20">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </Card>
      </div>
    );
  }

  if (!meals) {
    return (
      <div className="space-y-4 p-6">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No meals available. Please adjust your filters and try again.</p>
        </Card>
      </div>
    );
  }

  const goalText = {
    lose: 'Weight Loss',
    gain: 'Muscle Gain',
    maintain: 'Maintenance'
  }[userData.goal] || 'Personalized';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Summary Card */}
      <Card className="p-6 bg-card card-shadow border-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-primary" />
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {goalText} Plan
              </Badge>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              Your Personalized Diet Plan
            </h2>
            <p className="text-muted-foreground">
              Based on your profile • {userData.dietPreference === 'both' ? 'Veg & Non-Veg' : userData.dietPreference === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
              <Flame className="w-5 h-5 mx-auto text-orange-500 mb-1" />
              <div className="text-xl font-bold text-foreground">{dailyCalories}</div>
              <div className="text-xs text-muted-foreground">Target kcal</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
              <Dumbbell className="w-5 h-5 mx-auto text-red-500 mb-1" />
              <div className="text-xl font-bold text-foreground">{totalStats.protein}g</div>
              <div className="text-xs text-muted-foreground">Protein</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <TrendingUp className="w-5 h-5 mx-auto text-green-500 mb-1" />
              <div className="text-xl font-bold text-foreground">{totalStats.fiber}g</div>
              <div className="text-xs text-muted-foreground">Fiber</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <span className="text-xl">₹</span>
              <div className="text-xl font-bold text-foreground inline ml-1">{totalStats.cost}</div>
              <div className="text-xs text-muted-foreground">Est. Cost</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Meal Sections */}
      <MealSection
        title="Breakfast"
        icon="breakfast"
        foods={meals.breakfast}
        targetCalories={mealCalories.breakfast}
      />

      <MealSection
        title="Lunch"
        icon="lunch"
        foods={meals.lunch}
        targetCalories={mealCalories.lunch}
      />

      <MealSection
        title="Dinner"
        icon="dinner"
        foods={meals.dinner}
        targetCalories={mealCalories.dinner}
      />

      <MealSection
        title="Snacks"
        icon="snack"
        foods={meals.snack}
        targetCalories={mealCalories.snack}
      />

      {/* Tip Card */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-0">
        <h3 className="font-bold text-foreground mb-2">💡 Pro Tips</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Click on Swiggy or Zomato to order directly from the app</li>
          <li>• Mix and match items within the same calorie range</li>
          <li>• Stay hydrated - drink at least 8 glasses of water daily</li>
          <li>• Adjust portions based on your hunger and energy levels</li>
        </ul>
      </Card>
    </div>
  );
};
