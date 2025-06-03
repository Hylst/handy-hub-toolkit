
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Scale, TrendingUp, Target } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  notes?: string;
}

interface WeightTrackerProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const WeightTracker = ({ data, onDataChange }: WeightTrackerProps) => {
  const [entries, setEntries] = useState<WeightEntry[]>(data.entries || []);
  const [targetWeight, setTargetWeight] = useState(data.targetWeight || '');
  const [currentWeight, setCurrentWeight] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    onDataChange({
      entries,
      targetWeight,
      lastUpdated: new Date().toISOString()
    });
  }, [entries, targetWeight]);

  const addEntry = () => {
    if (!currentWeight) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir votre poids",
        variant: "destructive"
      });
      return;
    }

    const entry: WeightEntry = {
      id: crypto.randomUUID(),
      weight: parseFloat(currentWeight),
      date: new Date().toISOString().split('T')[0],
      notes: notes || undefined
    };

    setEntries([entry, ...entries]);
    setCurrentWeight('');
    setNotes('');

    toast({
      title: "Poids enregistré",
      description: `${currentWeight}kg ajouté à votre suivi`,
    });
  };

  const getWeightTrend = () => {
    if (entries.length < 2) return null;
    const recent = entries.slice(0, 2);
    const diff = recent[0].weight - recent[1].weight;
    return {
      direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable',
      amount: Math.abs(diff)
    };
  };

  const trend = getWeightTrend();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Nouveau poids
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="number"
              step="0.1"
              placeholder="Poids (kg)"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
            />
            <Input
              placeholder="Notes (optionnel)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Button onClick={addEntry} className="w-full">
              Enregistrer
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="w-4 h-4" />
              Objectif
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="number"
              step="0.1"
              placeholder="Poids cible (kg)"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
            />
            {entries.length > 0 && targetWeight && (
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-sm">À perdre/gagner</div>
                <div className="text-lg font-bold">
                  {(entries[0].weight - parseFloat(targetWeight)).toFixed(1)}kg
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {entries.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Historique</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {entries.slice(0, 10).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div>
                    <div className="font-medium">{entry.weight}kg</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{entry.date}</div>
                  </div>
                  {entry.notes && <div className="text-sm text-gray-500">{entry.notes}</div>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
