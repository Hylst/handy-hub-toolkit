
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Activity, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface HealthMetric {
  id: string;
  type: 'blood_pressure' | 'heart_rate' | 'blood_sugar' | 'temperature';
  value: string;
  timestamp: string;
  notes?: string;
}

interface HealthMetricsProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const HealthMetrics = ({ data, onDataChange }: HealthMetricsProps) => {
  const [metrics, setMetrics] = useState<HealthMetric[]>(data.metrics || []);
  const [newMetric, setNewMetric] = useState({
    type: 'blood_pressure' as const,
    value: '',
    notes: ''
  });

  useEffect(() => {
    onDataChange({
      metrics,
      lastUpdated: new Date().toISOString()
    });
  }, [metrics]);

  const addMetric = () => {
    if (!newMetric.value) {
      toast({
        title: "Erreur",
        description: "Veuillez renseigner une valeur",
        variant: "destructive"
      });
      return;
    }

    const metric: HealthMetric = {
      id: crypto.randomUUID(),
      type: newMetric.type,
      value: newMetric.value,
      notes: newMetric.notes || undefined,
      timestamp: new Date().toISOString()
    };

    setMetrics([metric, ...metrics]);
    setNewMetric({ type: 'blood_pressure', value: '', notes: '' });

    toast({
      title: "Métrique ajoutée",
      description: "Votre mesure a été enregistrée",
    });
  };

  const metricTypes = [
    { value: 'blood_pressure', label: 'Tension artérielle', unit: 'mmHg', icon: '🩺' },
    { value: 'heart_rate', label: 'Fréquence cardiaque', unit: 'bpm', icon: '❤️' },
    { value: 'blood_sugar', label: 'Glycémie', unit: 'mg/dL', icon: '🩸' },
    { value: 'temperature', label: 'Température', unit: '°C', icon: '🌡️' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Nouvelle mesure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select 
              value={newMetric.type}
              onChange={(e) => setNewMetric({...newMetric, type: e.target.value as any})}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {metricTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
            <Input
              placeholder={`Valeur (${metricTypes.find(t => t.value === newMetric.type)?.unit})`}
              value={newMetric.value}
              onChange={(e) => setNewMetric({...newMetric, value: e.target.value})}
            />
          </div>
          <Input
            placeholder="Notes (optionnel)"
            value={newMetric.notes}
            onChange={(e) => setNewMetric({...newMetric, notes: e.target.value})}
          />
          <Button onClick={addMetric} className="w-full">
            Ajouter la mesure
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Historique des mesures</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              Aucune mesure enregistrée
            </p>
          ) : (
            <div className="space-y-3">
              {metrics.map((metric) => {
                const metricType = metricTypes.find(t => t.value === metric.type);
                return (
                  <div key={metric.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          {metricType?.icon} {metricType?.label}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(metric.timestamp).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{metric.value} {metricType?.unit}</div>
                        {metric.notes && <div className="text-xs text-gray-500">{metric.notes}</div>}
                      </div>
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
