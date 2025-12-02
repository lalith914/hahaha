import { useState } from 'react';
import { DietForm } from '@/components/DietForm';
import { DietPlan } from '@/components/DietPlan';
import { Card } from '@/components/ui/card';
import { Utensils, Heart, Leaf } from 'lucide-react';

interface UserData {
  age: number;
  sex: 'male' | 'female';
  weight: number;
  height: number;
  activityLevel: string;
  goal: string;
  dietPreference: 'veg' | 'non-veg' | 'both';
  budget: number;
}

const Index = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleFormSubmit = (data: UserData) => {
    setUserData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="container max-w-6xl mx-auto">
        {!userData ? (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Section */}
            <header className="text-center space-y-4 py-8">
              <div className="flex justify-center gap-2 mb-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
                <div className="p-2 rounded-full bg-accent/20">
                  <Heart className="w-6 h-6 text-accent-foreground" />
                </div>
                <div className="p-2 rounded-full bg-primary/10">
                  <Utensils className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold gradient-text">
                Indian Diet Planner
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Get your personalized meal plan based on your goals and budget.
                Order directly from Swiggy & Zomato!
              </p>
            </header>

            {/* Form Card */}
            <Card className="p-6 md:p-8 bg-card card-shadow border-0 max-w-3xl mx-auto">
              <DietForm onSubmit={handleFormSubmit} />
            </Card>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-8">
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🥗</span>
                </div>
                <h3 className="font-semibold text-foreground">100+ Healthy Foods</h3>
                <p className="text-sm text-muted-foreground">Curated Indian dishes with full nutrition info</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="font-semibold text-foreground">Direct Ordering</h3>
                <p className="text-sm text-muted-foreground">Order from Swiggy & Zomato instantly</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-semibold text-foreground">Personalized Plans</h3>
                <p className="text-sm text-muted-foreground">Based on your goals & budget</p>
              </div>
            </div>
          </div>
        ) : (
          <DietPlan userData={userData} onBack={() => setUserData(null)} />
        )}
      </div>
    </main>
  );
};

export default Index;
