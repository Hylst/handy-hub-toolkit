
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Scale, TrendingUp, Target } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useOptimizedDataManager } from '@/hooks/useOptimizedDataManager';

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  notes?: string;
}

interface WeightData {
  entries: WeightEntry[];
  targetWeight: string;
  lastUpdated: string;
}

interface WeightTrackerProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const WeightTracker = ({ data: propData, onDataChange }: WeightTrackerProps) => {
  // Utiliser le nouveau gestionnaire de données optimisé
  const {
    data: managedData,
    setData: setManagedData,
    isLoading,
    hasChanges,
    exportData,
    importData,
    resetData
  } = useOptimizedDataManager<WeightData>({
    toolName: 'weight-tracker',
    defaultData: {
      entries: [],
      targetWeight: '',
      lastUpdated: new Date().toISOString()
    },
    autoSave: true,
    syncInterval: 30000
  });

  const [currentWeight, setCurrentWeight] = useState('');
  const [notes, setNotes] = useState('');

  // Synchroniser avec les props pour compatibilité
  useEffect(() => {
    if (propData && Object.keys(propData).length > 0) {
      setManagedData(propData);
    }
  }, [propData, setManagedData]);

  // Notifier les changements pour compatibilité
  useEffect(() => {
    onDataChange(managedData);
  }, [managedData, onDataChange]);

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

    const newData = {
      ...managedData,
      entries: [entry, ...managedData.entries],
      lastUpdated: new Date().toISOString()
    };

    setManagedData(newData);
    setCurrentWeight('');
    setNotes('');

    toast({
      title: "Poids enregistré",
      description: `${currentWeight}kg ajouté à votre suivi`,
    });
  };

  const updateTargetWeight = (newTarget: string) => {
    const newData = {
      ...managedData,
      targetWeight: newTarget,
      lastUpdated: new Date().toISOString()
    };
    setManagedData(newData);
  };

  const getWeightTrend = () => {
    if (managedData.entries.length < 2) return null;
    const recent = managedData.entries.slice(0, 2);
    const diff = recent[0].weight - recent[1].weight;
    return {
      direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable',
      amount: Math.abs(diff)
    };
  };

  const trend = getWeightTrend();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement des données...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Indicateur de changements */}
      {hasChanges && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
          💾 Sauvegarde automatique en cours...
        </div>
      )}

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
              value={managedData.targetWeight}
              onChange={(e) => updateTargetWeight(e.target.value)}
            />
            {managedData.entries.length > 0 && managedData.targetWeight && (
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-sm">À perdre/gagner</div>
                <div className="text-lg font-bold">
                  {(managedData.entries[0].weight - parseFloat(managedData.targetWeight)).toFixed(1)}kg
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tendance */}
      {trend && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className={`w-4 h-4 ${
                trend.direction === 'up' ? 'text-red-500' : 
                trend.direction === 'down' ? 'text-green-500' : 'text-gray-500'
              }`} />
              <span className="text-sm">
                {trend.direction === 'up' ? 'Augmentation' : 
                 trend.direction === 'down' ? 'Diminution' : 'Stable'} 
                de {trend.amount.toFixed(1)}kg
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {managedData.entries.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Historique</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {managedData.entries.slice(0, 10).map((entry) => (
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

      {/* Actions rapides */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2 justify-center">
            <Button size="sm" variant="outline" onClick={exportData}>
              📤 Export
            </Button>
            <Button size="sm" variant="outline" onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.json';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) importData(file);
              };
              input.click();
            }}>
              📥 Import
            </Button>
            <Button size="sm" variant="destructive" onClick={resetData}>
              🔄 Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
