import { FoodItem } from '@/data/foodDatabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Flame, Dumbbell, Wheat, Droplets } from 'lucide-react';

interface FoodCardProps {
  food: FoodItem;
  index: number;
}

export const FoodCard = ({ food, index }: FoodCardProps) => {
  return (
    <Card 
      className="overflow-hidden bg-card card-shadow hover:shadow-xl transition-all duration-300 animate-slide-up border-0"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <Badge 
            variant={food.type === 'veg' ? 'default' : 'destructive'}
            className={food.type === 'veg' ? 'bg-primary' : 'bg-orange-500'}
          >
            {food.type === 'veg' ? '🥬 Veg' : '🍗 Non-Veg'}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-bold text-lg text-foreground line-clamp-1">{food.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{food.description}</p>

        {/* Nutrition Grid */}
        <div className="grid grid-cols-4 gap-2 py-3 border-t border-b border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-orange-500">
              <Flame className="w-3 h-3" />
              <span className="text-xs font-semibold">{food.calories}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">kcal</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-red-500">
              <Dumbbell className="w-3 h-3" />
              <span className="text-xs font-semibold">{food.protein}g</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Protein</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-amber-500">
              <Wheat className="w-3 h-3" />
              <span className="text-xs font-semibold">{food.carbs}g</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Carbs</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-500">
              <Droplets className="w-3 h-3" />
              <span className="text-xs font-semibold">{food.fat}g</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Fat</span>
          </div>
        </div>

        {/* Benefits */}
        <div className="flex flex-wrap gap-1">
          {food.benefits.slice(0, 3).map((benefit, i) => (
            <Badge key={i} variant="outline" className="text-[10px] border-primary/30 text-primary">
              {benefit}
            </Badge>
          ))}
        </div>

        {/* Order Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
            onClick={() => window.open(food.swiggyUrl, '_blank')}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Swiggy
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            onClick={() => window.open(food.zomatoUrl, '_blank')}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Zomato
          </Button>
        </div>
      </div>
    </Card>
  );
};
