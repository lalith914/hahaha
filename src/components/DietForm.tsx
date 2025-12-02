import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DietFormData {
  age: number;
  sex: 'male' | 'female';
  weight: number;
  height: number;
  activityLevel: string;
  goal: string;
  dietPreference: 'veg' | 'non-veg' | 'both';
  budget: number;
}

interface DietFormProps {
  onSubmit: (data: DietFormData) => void;
}

export const DietForm = ({ onSubmit }: DietFormProps) => {
  const [formData, setFormData] = useState<DietFormData>({
    age: 0,
    sex: 'male',
    weight: 0,
    height: 0,
    activityLevel: '',
    goal: '',
    dietPreference: 'both',
    budget: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.activityLevel && formData.goal) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age" className="text-foreground font-medium">Age</Label>
          <Input
            id="age"
            type="number"
            min={15}
            max={100}
            placeholder="Enter age (15-100)"
            value={formData.age || ''}
            onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
            className="h-12 bg-card border-border focus:border-primary"
          />
        </div>

        {/* Sex */}
        <div className="space-y-2">
          <Label className="text-foreground font-medium">Sex</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="toggle"
              data-active={formData.sex === 'male'}
              onClick={() => setFormData({ ...formData, sex: 'male' })}
              className="flex-1 h-12"
            >
              Male
            </Button>
            <Button
              type="button"
              variant="toggle"
              data-active={formData.sex === 'female'}
              onClick={() => setFormData({ ...formData, sex: 'female' })}
              className="flex-1 h-12"
            >
              Female
            </Button>
          </div>
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <Label htmlFor="weight" className="text-foreground font-medium">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            min={30}
            max={200}
            placeholder="Enter weight (30-200 kg)"
            value={formData.weight || ''}
            onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
            className="h-12 bg-card border-border focus:border-primary"
          />
        </div>

        {/* Height */}
        <div className="space-y-2">
          <Label htmlFor="height" className="text-foreground font-medium">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            min={120}
            max={250}
            placeholder="Enter height (120-250 cm)"
            value={formData.height || ''}
            onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
            className="h-12 bg-card border-border focus:border-primary"
          />
        </div>

        {/* Activity Level */}
        <div className="space-y-2">
          <Label className="text-foreground font-medium">Activity Level</Label>
          <Select
            value={formData.activityLevel}
            onValueChange={(value) => setFormData({ ...formData, activityLevel: value })}
          >
            <SelectTrigger className="h-12 bg-card border-border">
              <SelectValue placeholder="Select activity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="very-active">Very Active</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Goal */}
        <div className="space-y-2">
          <Label className="text-foreground font-medium">Goal</Label>
          <Select
            value={formData.goal}
            onValueChange={(value) => setFormData({ ...formData, goal: value })}
          >
            <SelectTrigger className="h-12 bg-card border-border">
              <SelectValue placeholder="Select goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lose">Lose Weight</SelectItem>
              <SelectItem value="maintain">Maintain Weight</SelectItem>
              <SelectItem value="gain">Gain Weight</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Diet Preference */}
        <div className="space-y-2">
          <Label className="text-foreground font-medium">Diet Preference</Label>
          <div className="flex gap-2">
            {(['veg', 'non-veg', 'both'] as const).map((pref) => (
              <Button
                key={pref}
                type="button"
                variant="toggle"
                data-active={formData.dietPreference === pref}
                onClick={() => setFormData({ ...formData, dietPreference: pref })}
                className="flex-1 h-12 text-sm"
              >
                {pref === 'veg' ? 'Veg' : pref === 'non-veg' ? 'Non-Veg' : 'Both'}
              </Button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <Label htmlFor="budget" className="text-foreground font-medium">Daily Budget (₹)</Label>
          <Input
            id="budget"
            type="number"
            min={100}
            max={5000}
            placeholder="Enter budget (₹100-5000)"
            value={formData.budget || ''}
            onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
            className="h-12 bg-card border-border focus:border-primary"
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="gradient"
        size="xl"
        className="w-full mt-8"
        disabled={!formData.activityLevel || !formData.goal}
      >
        Generate My Diet Plan
      </Button>
    </form>
  );
};
