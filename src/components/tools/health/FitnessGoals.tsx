
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  category: 'weight' | 'exercise' | 'nutrition' | 'habit';
}

interface FitnessGoalsProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const FitnessGoals = ({ data, onDataChange }: FitnessGoalsProps) => {
  const [goals, setGoals] = useState<Goal[]>(data.goals || []);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    unit: '',
    deadline: '',
    category: 'exercise' as const
  });

  useEffect(() => {
    onDataChange({
      goals,
      lastUpdated: new Date().toISOString()
    });
  }, [goals]);

  const addGoal = () => {
    if (!newGoal.title || !newGoal.target || !newGoal.deadline) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    const goal: Goal = {
      id: crypto.randomUUID(),
      title: newGoal.title,
      target: parseFloat(newGoal.target),
      current: 0,
      unit: newGoal.unit,
      deadline: newGoal.deadline,
      category: newGoal.category
    };

    setGoals([...goals, goal]);
    setNewGoal({ title: '', target: '', unit: '', deadline: '', category: 'exercise' });

    toast({
      title: "Objectif créé",
      description: `${newGoal.title} ajouté à vos objectifs`,
    });
  };

  const updateProgress = (goalId: string, value: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, current: Math.min(value, goal.target) }
        : goal
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nouvel objectif
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Titre de l'objectif"
              value={newGoal.title}
              onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
            />
            <select 
              value={newGoal.category}
              onChange={(e) => setNewGoal({...newGoal, category: e.target.value as any})}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="exercise">Exercice</option>
              <option value="weight">Poids</option>
              <option value="nutrition">Nutrition</option>
              <option value="habit">Habitude</option>
            </select>
            <Input
              type="number"
              placeholder="Objectif cible"
              value={newGoal.target}
              onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
            />
            <Input
              placeholder="Unité (kg, minutes, etc.)"
              value={newGoal.unit}
              onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
            />
            <Input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
            />
          </div>
          <Button onClick={addGoal} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Créer l'objectif
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Mes objectifs</CardTitle>
        </CardHeader>
        <CardContent>
          {goals.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              Aucun objectif défini
            </p>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => {
                const progress = (goal.current / goal.target) * 100;
                return (
                  <div key={goal.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{goal.title}</h4>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {goal.current}/{goal.target} {goal.unit}
                      </span>
                    </div>
                    <Progress value={progress} className="mb-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span>Échéance: {goal.deadline}</span>
                      <span>{progress.toFixed(0)}% accompli</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
