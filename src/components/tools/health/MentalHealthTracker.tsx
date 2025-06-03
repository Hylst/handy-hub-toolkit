
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Heart, Smile, MessageCircle, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MoodEntry {
  id: string;
  mood: 1 | 2 | 3 | 4 | 5;
  energy: 1 | 2 | 3 | 4 | 5;
  stress: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  gratitude?: string;
  timestamp: string;
}

interface MentalHealthTrackerProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const MentalHealthTracker = ({ data, onDataChange }: MentalHealthTrackerProps) => {
  const [entries, setEntries] = useState<MoodEntry[]>(data.entries || []);
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [energy, setEnergy] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [stress, setStress] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [notes, setNotes] = useState('');
  const [gratitude, setGratitude] = useState('');

  useEffect(() => {
    onDataChange({
      entries,
      lastUpdated: new Date().toISOString()
    });
  }, [entries]);

  const addEntry = () => {
    const newEntry: MoodEntry = {
      id: crypto.randomUUID(),
      mood,
      energy,
      stress,
      notes: notes.trim() || undefined,
      gratitude: gratitude.trim() || undefined,
      timestamp: new Date().toISOString()
    };

    setEntries([newEntry, ...entries]);
    
    // Reset form
    setMood(3);
    setEnergy(3);
    setStress(3);
    setNotes('');
    setGratitude('');

    toast({
      title: "État mental enregistré",
      description: "Votre entrée a été ajoutée à votre journal",
    });
  };

  const getMoodEmoji = (value: number) => {
    const emojis = ['😢', '😕', '😐', '😊', '😄'];
    return emojis[value - 1];
  };

  const getEnergyEmoji = (value: number) => {
    const emojis = ['🔋⚪', '🔋🟡', '🔋🟡🟡', '🔋🟢🟢', '🔋🟢🟢🟢'];
    return emojis[value - 1];
  };

  const getStressEmoji = (value: number) => {
    const emojis = ['😌', '😊', '😐', '😰', '😵'];
    return emojis[value - 1];
  };

  const getAverage = (key: keyof Pick<MoodEntry, 'mood' | 'energy' | 'stress'>) => {
    if (entries.length === 0) return 0;
    const total = entries.reduce((sum, entry) => sum + entry[key], 0);
    return total / entries.length;
  };

  const recentEntries = entries.slice(0, 7);

  return (
    <div className="space-y-6">
      {/* Current State Input */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Comment vous sentez-vous maintenant ?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mood */}
          <div>
            <label className="text-sm font-medium mb-3 block">Humeur</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  onClick={() => setMood(value as any)}
                  variant={mood === value ? "default" : "outline"}
                  className="flex-1 text-2xl h-16"
                >
                  {getMoodEmoji(value)}
                </Button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Très triste</span>
              <span>Très heureux</span>
            </div>
          </div>

          {/* Energy */}
          <div>
            <label className="text-sm font-medium mb-3 block">Énergie</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  onClick={() => setEnergy(value as any)}
                  variant={energy === value ? "default" : "outline"}
                  className="flex-1 text-lg h-16"
                >
                  {getEnergyEmoji(value)}
                </Button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Épuisé</span>
              <span>Très énergique</span>
            </div>
          </div>

          {/* Stress */}
          <div>
            <label className="text-sm font-medium mb-3 block">Niveau de stress</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  onClick={() => setStress(value as any)}
                  variant={stress === value ? "default" : "outline"}
                  className="flex-1 text-2xl h-16"
                >
                  {getStressEmoji(value)}
                </Button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Très détendu</span>
              <span>Très stressé</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium mb-2 block">Notes personnelles (optionnel)</label>
            <Textarea
              placeholder="Comment s'est passée votre journée ? Qu'est-ce qui vous préoccupe ?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Gratitude */}
          <div>
            <label className="text-sm font-medium mb-2 block">Pour quoi êtes-vous reconnaissant aujourd'hui ?</label>
            <Textarea
              placeholder="3 choses pour lesquelles vous êtes reconnaissant..."
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              rows={2}
            />
          </div>

          <Button onClick={addEntry} className="w-full">
            <Heart className="w-4 h-4 mr-2" />
            Enregistrer mon état
          </Button>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Smile className="w-4 h-4" />
              Humeur moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl mb-2">{getMoodEmoji(Math.round(getAverage('mood')))}</div>
              <div className="text-lg font-bold">{getAverage('mood').toFixed(1)}/5</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {entries.length} entrée{entries.length > 1 ? 's' : ''}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Énergie moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl mb-2">{getEnergyEmoji(Math.round(getAverage('energy')))}</div>
              <div className="text-lg font-bold">{getAverage('energy').toFixed(1)}/5</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Stress moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl mb-2">{getStressEmoji(Math.round(getAverage('stress')))}</div>
              <div className="text-lg font-bold">{getAverage('stress').toFixed(1)}/5</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Entries */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Journal récent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {recentEntries.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                Aucune entrée dans votre journal
              </p>
            ) : (
              recentEntries.map((entry) => (
                <div key={entry.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">
                      {format(new Date(entry.timestamp), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                    </span>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {getMoodEmoji(entry.mood)} Humeur: {entry.mood}/5
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        🔋 Énergie: {entry.energy}/5
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        😰 Stress: {entry.stress}/5
                      </Badge>
                    </div>
                  </div>
                  
                  {entry.notes && (
                    <div className="mb-2">
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Notes :</div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">{entry.notes}</div>
                    </div>
                  )}
                  
                  {entry.gratitude && (
                    <div>
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Gratitude :</div>
                      <div className="text-sm text-green-700 dark:text-green-300">🙏 {entry.gratitude}</div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">💡 Conseils bien-être</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h5 className="font-medium">Pour améliorer votre humeur :</h5>
              <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <li>• Pratiquez la méditation 10min/jour</li>
                <li>• Sortez prendre l'air et la lumière</li>
                <li>• Contactez un proche</li>
                <li>• Écoutez de la musique que vous aimez</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Pour réduire le stress :</h5>
              <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <li>• Exercices de respiration profonde</li>
                <li>• Organisez votre journée</li>
                <li>• Limitez la caféine</li>
                <li>• Pratiquez une activité relaxante</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
