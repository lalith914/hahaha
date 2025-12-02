import { useMemo } from 'react';
import { MealSection } from './MealSection';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Target, Flame, Dumbbell, TrendingUp } from 'lucide-react';
import {
  foodDatabase,
  getFilteredFoods,
  calculateBMR,
  calculateTDEE,
  adjustCaloriesForGoal
} from '@/data/foodDatabase';

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
  const { dailyCalories, mealCalories, meals } = useMemo(() => {
    const bmr = calculateBMR(userData.weight, userData.height, userData.age, userData.sex);
    const tdee = calculateTDEE(bmr, userData.activityLevel);
    const targetCalories = Math.round(adjustCaloriesForGoal(tdee, userData.goal));

    const mealDistribution = {
      breakfast: 0.25,
      lunch: 0.35,
      dinner: 0.25,
      snack: 0.15
    };

    const mealCalories = {
      breakfast: Math.round(targetCalories * mealDistribution.breakfast),
      lunch: Math.round(targetCalories * mealDistribution.lunch),
      dinner: Math.round(targetCalories * mealDistribution.dinner),
      snack: Math.round(targetCalories * mealDistribution.snack)
    };

    const perMealBudget = userData.budget / 4;

    const selectBestFoods = (category: 'breakfast' | 'lunch' | 'dinner' | 'snack', targetCal: number) => {
      const available = getFilteredFoods(category, userData.dietPreference, perMealBudget * 1.5);
      
      // Sort by nutritional value (protein/calorie ratio) and pick diverse options
      const sorted = [...available].sort((a, b) => {
        const scoreA = (a.protein * 2 + a.fiber) / (a.calories / 100);
        const scoreB = (b.protein * 2 + b.fiber) / (b.calories / 100);
        return scoreB - scoreA;
      });

      // Select foods that sum up close to target calories
      const selected: typeof available = [];
      let currentCalories = 0;

      for (const food of sorted) {
        if (currentCalories + food.calories <= targetCal * 1.2 && selected.length < 4) {
          selected.push(food);
          currentCalories += food.calories;
        }
        if (currentCalories >= targetCal * 0.8 && selected.length >= 2) break;
      }

      return selected.length > 0 ? selected : sorted.slice(0, 3);
    };

    return {
      dailyCalories: targetCalories,
      mealCalories,
      meals: {
        breakfast: selectBestFoods('breakfast', mealCalories.breakfast),
        lunch: selectBestFoods('lunch', mealCalories.lunch),
        dinner: selectBestFoods('dinner', mealCalories.dinner),
        snack: selectBestFoods('snack', mealCalories.snack)
      }
    };
  }, [userData]);

  const totalStats = useMemo(() => {
    const allFoods = [...meals.breakfast, ...meals.lunch, ...meals.dinner, ...meals.snack];
    return {
      calories: allFoods.reduce((sum, f) => sum + f.calories, 0),
      protein: allFoods.reduce((sum, f) => sum + f.protein, 0),
      carbs: allFoods.reduce((sum, f) => sum + f.carbs, 0),
      fat: allFoods.reduce((sum, f) => sum + f.fat, 0),
      fiber: allFoods.reduce((sum, f) => sum + f.fiber, 0),
      cost: allFoods.reduce((sum, f) => sum + f.price, 0)
    };
  }, [meals]);

  const goalText = {
    lose: 'Weight Loss',
    maintain: 'Maintenance',
    gain: 'Weight Gain'
  }[userData.goal] || 'Healthy Eating';

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
