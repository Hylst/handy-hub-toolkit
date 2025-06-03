
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Apple, Plus, Target, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface NutritionEntry {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  timestamp: string;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface NutritionTrackerProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const NutritionTracker = ({ data, onDataChange }: NutritionTrackerProps) => {
  const [entries, setEntries] = useState<NutritionEntry[]>(data.entries || []);
  const [goals, setGoals] = useState({
    calories: data.goals?.calories || 2000,
    proteins: data.goals?.proteins || 150,
    carbs: data.goals?.carbs || 250,
    fats: data.goals?.fats || 80
  });

  useEffect(() => {
    onDataChange({
      entries,
      goals,
      lastUpdated: new Date().toISOString()
    });
  }, [entries, goals]);

  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [proteins, setProteins] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [meal, setMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');

  const todayEntries = entries.filter(entry => 
    new Date(entry.timestamp).toDateString() === new Date().toDateString()
  );

  const todayTotals = todayEntries.reduce((totals, entry) => ({
    calories: totals.calories + entry.calories,
    proteins: totals.proteins + entry.proteins,
    carbs: totals.carbs + entry.carbs,
    fats: totals.fats + entry.fats
  }), { calories: 0, proteins: 0, carbs: 0, fats: 0 });

  const addEntry = () => {
    if (!foodName || !calories) {
      toast({
        title: "Erreur",
        description: "Veuillez renseigner au moins le nom et les calories",
        variant: "destructive"
      });
      return;
    }

    const newEntry: NutritionEntry = {
      id: crypto.randomUUID(),
      name: foodName,
      calories: parseFloat(calories),
      proteins: parseFloat(proteins) || 0,
      carbs: parseFloat(carbs) || 0,
      fats: parseFloat(fats) || 0,
      meal,
      timestamp: new Date().toISOString()
    };

    setEntries([newEntry, ...entries]);
    
    // Reset form
    setFoodName('');
    setCalories('');
    setProteins('');
    setCarbs('');
    setFats('');

    toast({
      title: "Aliment ajouté",
      description: `${foodName} ajouté à votre suivi nutritionnel`,
    });
  };

  const getMealIcon = (mealType: string) => {
    const icons = {
      breakfast: '🥐',
      lunch: '🍽️',
      dinner: '🍽️',
      snack: '🍎'
    };
    return icons[mealType as keyof typeof icons] || '🍽️';
  };

  const getMealLabel = (mealType: string) => {
    const labels = {
      breakfast: 'Petit-déjeuner',
      lunch: 'Déjeuner', 
      dinner: 'Dîner',
      snack: 'Collation'
    };
    return labels[mealType as keyof typeof labels] || 'Repas';
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{todayTotals.calories}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">/ {goals.calories} kcal</div>
            <Progress value={(todayTotals.calories / goals.calories) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Protéines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{todayTotals.proteins.toFixed(1)}g</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">/ {goals.proteins}g</div>
            <Progress value={(todayTotals.proteins / goals.proteins) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Glucides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{todayTotals.carbs.toFixed(1)}g</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">/ {goals.carbs}g</div>
            <Progress value={(todayTotals.carbs / goals.carbs) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Lipides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{todayTotals.fats.toFixed(1)}g</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">/ {goals.fats}g</div>
            <Progress value={(todayTotals.fats / goals.fats) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Goals Setting */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="w-4 h-4" />
            Objectifs nutritionnels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Calories (kcal)</label>
              <Input
                type="number"
                value={goals.calories}
                onChange={(e) => setGoals({...goals, calories: parseInt(e.target.value) || 2000})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Protéines (g)</label>
              <Input
                type="number"
                value={goals.proteins}
                onChange={(e) => setGoals({...goals, proteins: parseInt(e.target.value) || 150})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Glucides (g)</label>
              <Input
                type="number"
                value={goals.carbs}
                onChange={(e) => setGoals({...goals, carbs: parseInt(e.target.value) || 250})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Lipides (g)</label>
              <Input
                type="number"
                value={goals.fats}
                onChange={(e) => setGoals({...goals, fats: parseInt(e.target.value) || 80})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Food */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ajouter un aliment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Nom de l'aliment</label>
              <Input
                placeholder="Pomme, riz, saumon..."
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Repas</label>
              <select 
                value={meal} 
                onChange={(e) => setMeal(e.target.value as any)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="breakfast">Petit-déjeuner</option>
                <option value="lunch">Déjeuner</option>
                <option value="dinner">Dîner</option>
                <option value="snack">Collation</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Calories (kcal)</label>
              <Input
                type="number"
                placeholder="200"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Protéines (g)</label>
              <Input
                type="number"
                placeholder="20"
                value={proteins}
                onChange={(e) => setProteins(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Glucides (g)</label>
              <Input
                type="number"
                placeholder="30"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Lipides (g)</label>
              <Input
                type="number"
                placeholder="10"
                value={fats}
                onChange={(e) => setFats(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={addEntry} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter l'aliment
          </Button>
        </CardContent>
      </Card>

      {/* Today's Meals */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Repas d'aujourd'hui</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => {
              const mealEntries = todayEntries.filter(entry => entry.meal === mealType);
              const mealTotals = mealEntries.reduce((totals, entry) => ({
                calories: totals.calories + entry.calories,
                proteins: totals.proteins + entry.proteins,
                carbs: totals.carbs + entry.carbs,
                fats: totals.fats + entry.fats
              }), { calories: 0, proteins: 0, carbs: 0, fats: 0 });

              return (
                <div key={mealType} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{getMealIcon(mealType)}</span>
                    <h4 className="font-medium">{getMealLabel(mealType)}</h4>
                    <Badge variant="outline">
                      {mealTotals.calories} kcal
                    </Badge>
                  </div>
                  
                  {mealEntries.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Aucun aliment ajouté</p>
                  ) : (
                    <div className="space-y-2">
                      {mealEntries.map(entry => (
                        <div key={entry.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
                          <span className="text-sm font-medium">{entry.name}</span>
                          <div className="flex gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <span>{entry.calories}kcal</span>
                            <span>P:{entry.proteins.toFixed(1)}g</span>
                            <span>G:{entry.carbs.toFixed(1)}g</span>
                            <span>L:{entry.fats.toFixed(1)}g</span>
                          </div>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Total {getMealLabel(mealType).toLowerCase()}</span>
                          <div className="flex gap-2">
                            <span>{mealTotals.calories}kcal</span>
                            <span>P:{mealTotals.proteins.toFixed(1)}g</span>
                            <span>G:{mealTotals.carbs.toFixed(1)}g</span>
                            <span>L:{mealTotals.fats.toFixed(1)}g</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
