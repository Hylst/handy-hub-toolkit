
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Droplets, Plus, Minus, RotateCcw, Trophy, Target } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format, isToday, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

interface WaterEntry {
  id: string;
  amount: number;
  timestamp: string;
  type: 'water' | 'tea' | 'coffee' | 'juice' | 'other';
}

interface WaterTrackerProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const WaterTracker = ({ data, onDataChange }: WaterTrackerProps) => {
  const [dailyGoal, setDailyGoal] = useState(data.dailyGoal || 2000);
  const [entries, setEntries] = useState<WaterEntry[]>(data.entries || []);
  const [quickAmount, setQuickAmount] = useState(250);
  const [customAmount, setCustomAmount] = useState('');

  useEffect(() => {
    onDataChange({
      dailyGoal,
      entries,
      lastUpdated: new Date().toISOString()
    });
  }, [dailyGoal, entries]);

  const todayEntries = entries.filter(entry => 
    isToday(new Date(entry.timestamp))
  );

  const todayTotal = todayEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const progressPercentage = Math.min((todayTotal / dailyGoal) * 100, 100);
  const remaining = Math.max(dailyGoal - todayTotal, 0);

  const addWater = (amount: number, type: 'water' | 'tea' | 'coffee' | 'juice' | 'other' = 'water') => {
    const newEntry: WaterEntry = {
      id: crypto.randomUUID(),
      amount,
      timestamp: new Date().toISOString(),
      type
    };

    setEntries([...entries, newEntry]);
    
    toast({
      title: "Hydratation enregistrée",
      description: `${amount}ml ajoutés à votre suivi`,
    });

    // Vérifier si l'objectif est atteint
    if (todayTotal + amount >= dailyGoal && todayTotal < dailyGoal) {
      toast({
        title: "🎉 Objectif atteint !",
        description: "Félicitations ! Vous avez atteint votre objectif d'hydratation quotidien.",
      });
    }
  };

  const removeLastEntry = () => {
    const lastTodayEntry = todayEntries[todayEntries.length - 1];
    if (lastTodayEntry) {
      setEntries(entries.filter(entry => entry.id !== lastTodayEntry.id));
      toast({
        title: "Entrée supprimée",
        description: `${lastTodayEntry.amount}ml retiré de votre suivi`,
      });
    }
  };

  const resetDay = () => {
    const nonTodayEntries = entries.filter(entry => 
      !isToday(new Date(entry.timestamp))
    );
    setEntries(nonTodayEntries);
    toast({
      title: "Journée réinitialisée",
      description: "Votre suivi d'hydratation d'aujourd'hui a été remis à zéro",
    });
  };

  const getRecommendedAmount = () => {
    return "2-2.5L pour un adulte moyen";
  };

  const getHydrationStatus = () => {
    if (progressPercentage >= 100) return { status: "Excellente hydratation", color: "text-green-600", emoji: "🏆" };
    if (progressPercentage >= 75) return { status: "Bonne hydratation", color: "text-blue-600", emoji: "💧" };
    if (progressPercentage >= 50) return { status: "Hydratation modérée", color: "text-yellow-600", emoji: "⚡" };
    if (progressPercentage >= 25) return { status: "Hydratation faible", color: "text-orange-600", emoji: "⚠️" };
    return { status: "Déshydratation", color: "text-red-600", emoji: "🚨" };
  };

  const quickAmounts = [125, 250, 330, 500, 750, 1000];
  const drinkTypes = [
    { type: 'water', label: 'Eau', emoji: '💧', color: 'bg-blue-100 text-blue-700' },
    { type: 'tea', label: 'Thé', emoji: '🍵', color: 'bg-green-100 text-green-700' },
    { type: 'coffee', label: 'Café', emoji: '☕', color: 'bg-amber-100 text-amber-700' },
    { type: 'juice', label: 'Jus', emoji: '🧃', color: 'bg-orange-100 text-orange-700' },
    { type: 'other', label: 'Autre', emoji: '🥤', color: 'bg-purple-100 text-purple-700' }
  ];

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Droplets className="w-5 h-5 text-blue-600" />
              Hydratation aujourd'hui
              <span className="text-sm font-normal">{getHydrationStatus().emoji}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{todayTotal}ml</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">/ {dailyGoal}ml</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex justify-between text-sm">
              <span className={getHydrationStatus().color}>
                {getHydrationStatus().status}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {remaining > 0 ? `${remaining}ml restants` : 'Objectif atteint !'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="w-4 h-4" />
              Objectif quotidien
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              type="number"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(parseInt(e.target.value) || 2000)}
              placeholder="Objectif (ml)"
            />
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Recommandé : {getRecommendedAmount()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Add */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Ajouter rapidement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
            {quickAmounts.map(amount => (
              <Button
                key={amount}
                onClick={() => addWater(amount)}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                {amount}ml
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Quantité personnalisée"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={() => {
                if (customAmount) {
                  addWater(parseInt(customAmount));
                  setCustomAmount('');
                }
              }}
              disabled={!customAmount}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Drink Types */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Par type de boisson</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {drinkTypes.map(drink => (
              <Button
                key={drink.type}
                onClick={() => addWater(quickAmount, drink.type as any)}
                variant="outline"
                size="sm"
                className={`flex flex-col items-center gap-1 h-auto py-3 ${drink.color}`}
              >
                <span className="text-lg">{drink.emoji}</span>
                <span className="text-xs">{drink.label}</span>
                <span className="text-xs">{quickAmount}ml</span>
              </Button>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <label className="text-sm">Quantité :</label>
              <Input
                type="number"
                value={quickAmount}
                onChange={(e) => setQuickAmount(parseInt(e.target.value) || 250)}
                className="w-20 h-8"
              />
              <span className="text-sm text-gray-600">ml</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions & History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={removeLastEntry}
              variant="outline"
              size="sm"
              className="w-full"
              disabled={todayEntries.length === 0}
            >
              <Minus className="w-4 h-4 mr-2" />
              Annuler dernière entrée
            </Button>
            
            <Button
              onClick={resetDay}
              variant="outline"
              size="sm"
              className="w-full text-red-600 border-red-200"
              disabled={todayEntries.length === 0}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Réinitialiser la journée
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Historique aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {todayEntries.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  Aucune entrée aujourd'hui
                </p>
              ) : (
                todayEntries.slice().reverse().map((entry) => {
                  const drinkType = drinkTypes.find(d => d.type === entry.type);
                  return (
                    <div key={entry.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
                      <div className="flex items-center gap-2">
                        <span>{drinkType?.emoji || '💧'}</span>
                        <span className="text-sm font-medium">{entry.amount}ml</span>
                        <Badge variant="outline" className="text-xs">{drinkType?.label || 'Eau'}</Badge>
                      </div>
                      <span className="text-xs text-gray-500">
                        {format(new Date(entry.timestamp), 'HH:mm')}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
