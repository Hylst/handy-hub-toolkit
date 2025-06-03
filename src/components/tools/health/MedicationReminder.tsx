
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Timer, Plus, Pill, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate?: string;
  notes?: string;
}

interface MedicationReminderProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const MedicationReminder = ({ data, onDataChange }: MedicationReminderProps) => {
  const [medications, setMedications] = useState<Medication[]>(data.medications || []);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    time: ''
  });

  useEffect(() => {
    onDataChange({
      medications,
      lastUpdated: new Date().toISOString()
    });
  }, [medications]);

  const addMedication = () => {
    if (!newMed.name || !newMed.dosage || !newMed.time) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    const medication: Medication = {
      id: crypto.randomUUID(),
      name: newMed.name,
      dosage: newMed.dosage,
      frequency: newMed.frequency,
      times: [newMed.time],
      startDate: new Date().toISOString().split('T')[0]
    };

    setMedications([...medications, medication]);
    setNewMed({ name: '', dosage: '', frequency: 'daily', time: '' });

    toast({
      title: "Médicament ajouté",
      description: `${newMed.name} ajouté à vos rappels`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ajouter un médicament
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Nom du médicament"
              value={newMed.name}
              onChange={(e) => setNewMed({...newMed, name: e.target.value})}
            />
            <Input
              placeholder="Dosage (ex: 500mg)"
              value={newMed.dosage}
              onChange={(e) => setNewMed({...newMed, dosage: e.target.value})}
            />
            <Input
              type="time"
              value={newMed.time}
              onChange={(e) => setNewMed({...newMed, time: e.target.value})}
            />
            <select 
              value={newMed.frequency}
              onChange={(e) => setNewMed({...newMed, frequency: e.target.value})}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="daily">Quotidien</option>
              <option value="twice">2x par jour</option>
              <option value="thrice">3x par jour</option>
              <option value="weekly">Hebdomadaire</option>
            </select>
          </div>
          <Button onClick={addMedication} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter le médicament
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Mes médicaments</CardTitle>
        </CardHeader>
        <CardContent>
          {medications.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              Aucun médicament enregistré
            </p>
          ) : (
            <div className="space-y-3">
              {medications.map((med) => (
                <div key={med.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{med.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {med.dosage} - {med.frequency}
                      </div>
                    </div>
                    <Badge variant="outline">
                      <Pill className="w-3 h-3 mr-1" />
                      {med.times[0]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
