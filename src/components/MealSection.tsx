import { FoodItem } from '@/data/foodDatabase';
import { FoodCard } from './FoodCard';
import { Badge } from '@/components/ui/badge';
import { Sun, Coffee, Moon, Cookie, Flame, Dumbbell } from 'lucide-react';

interface MealSectionProps {
  title: string;
  icon: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: FoodItem[];
  targetCalories: number;
}

const iconMap = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
  snack: Cookie
};

const colorMap = {
  breakfast: 'from-amber-500 to-orange-500',
  lunch: 'from-green-500 to-emerald-500',
  dinner: 'from-indigo-500 to-purple-500',
  snack: 'from-pink-500 to-rose-500'
};

export const MealSection = ({ title, icon, foods, targetCalories }: MealSectionProps) => {
  const Icon = iconMap[icon];
  const totalCalories = foods.reduce((sum, f) => sum + f.calories, 0);
  const totalProtein = foods.reduce((sum, f) => sum + f.protein, 0);
  
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorMap[icon]} text-white shadow-lg`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">
              Recommended: ~{targetCalories} kcal
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-500" />
            {totalCalories} kcal
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Dumbbell className="w-3 h-3 text-red-500" />
            {totalProtein}g protein
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {foods.map((food, index) => (
          <FoodCard key={food.id} food={food} index={index} />
        ))}
      </div>
    </section>
  );
};
