
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Moon, Sun, Clock, TrendingUp, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format, startOfDay, differenceInHours, differenceInMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SleepEntry {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number; // en minutes
  quality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  sleepLatency?: number; // temps pour s'endormir en minutes
  nightWakings?: number;
}

interface SleepTrackerProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const SleepTracker = ({ data, onDataChange }: SleepTrackerProps) => {
  const [entries, setEntries] = useState<SleepEntry[]>(data.entries || []);
  const [bedtime, setBedtime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [quality, setQuality] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [notes, setNotes] = useState('');
  const [sleepLatency, setSleepLatency] = useState('');
  const [nightWakings, setNightWakings] = useState('');

  useEffect(() => {
    onDataChange({
      entries,
      lastUpdated: new Date().toISOString()
    });
  }, [entries]);

  const calculateDuration = (bedtime: string, wakeTime: string) => {
    if (!bedtime || !wakeTime) return 0;
    
    const today = new Date();
    const bedtimeDate = new Date(today.toDateString() + ' ' + bedtime);
    let wakeTimeDate = new Date(today.toDateString() + ' ' + wakeTime);
    
    // Si l'heure de réveil est avant l'heure de coucher, c'est le lendemain
    if (wakeTimeDate < bedtimeDate) {
      wakeTimeDate.setDate(wakeTimeDate.getDate() + 1);
    }
    
    return differenceInMinutes(wakeTimeDate, bedtimeDate);
  };

  const addSleepEntry = () => {
    if (!bedtime || !wakeTime) {
      toast({
        title: "Erreur",
        description: "Veuillez renseigner l'heure de coucher et de réveil",
        variant: "destructive"
      });
      return;
    }

    const duration = calculateDuration(bedtime, wakeTime);
    
    if (duration <= 0) {
      toast({
        title: "Erreur",
        description: "La durée de sommeil doit être positive",
        variant: "destructive"
      });
      return;
    }

    const newEntry: SleepEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      bedtime,
      wakeTime,
      duration,
      quality,
      notes: notes.trim() || undefined,
      sleepLatency: sleepLatency ? parseInt(sleepLatency) : undefined,
      nightWakings: nightWakings ? parseInt(nightWakings) : undefined
    };

    setEntries([newEntry, ...entries]);
    
    // Reset form
    setBedtime('');
    setWakeTime('');
    setQuality(3);
    setNotes('');
    setSleepLatency('');
    setNightWakings('');

    toast({
      title: "Sommeil enregistré",
      description: `${Math.floor(duration / 60)}h${duration % 60 > 0 ? duration % 60 + 'm' : ''} de sommeil ajouté`,
    });
  };

  const getAverageSleep = () => {
    if (entries.length === 0) return 0;
    const totalMinutes = entries.reduce((sum, entry) => sum + entry.duration, 0);
    return totalMinutes / entries.length;
  };

  const getAverageQuality = () => {
    if (entries.length === 0) return 0;
    const totalQuality = entries.reduce((sum, entry) => sum + entry.quality, 0);
    return totalQuality / entries.length;
  };

  const getSleepRecommendations = () => {
    const avgSleep = getAverageSleep();
    const avgQuality = getAverageQuality();
    
    const recommendations = [];
    
    if (avgSleep < 420) { // moins de 7h
      recommendations.push("Essayez de dormir au moins 7-8 heures par nuit");
    }
    if (avgSleep > 540) { // plus de 9h
      recommendations.push("Vous dormez peut-être trop, 7-9h est généralement optimal");
    }
    if (avgQuality < 3) {
      recommendations.push("Votre qualité de sommeil semble faible, consultez un spécialiste");
    }
    
    return recommendations;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? mins.toString().padStart(2, '0') + 'm' : ''}`;
  };

  const getQualityLabel = (quality: number) => {
    const labels = {
      1: { label: "Très mauvais", color: "text-red-600", emoji: "😴" },
      2: { label: "Mauvais", color: "text-orange-600", emoji: "😔" },
      3: { label: "Moyen", color: "text-yellow-600", emoji: "😐" },
      4: { label: "Bon", color: "text-green-600", emoji: "😊" },
      5: { label: "Excellent", color: "text-blue-600", emoji: "😴✨" }
    };
    return labels[quality as keyof typeof labels];
  };

  const recentEntries = entries.slice(0, 7);
  const avgSleep = getAverageSleep();
  const avgQuality = getAverageQuality();

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Moyenne de sommeil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {avgSleep > 0 ? formatDuration(avgSleep) : '--'}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {entries.length} nuit{entries.length > 1 ? 's' : ''} enregistrée{entries.length > 1 ? 's' : ''}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Star className="w-4 h-4" />
              Qualité moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {avgQuality > 0 ? avgQuality.toFixed(1) : '--'}/5
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {avgQuality > 0 && getQualityLabel(Math.round(avgQuality)).label}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Tendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {entries.length >= 3 ? (
                <div>
                  <div className="text-lg font-bold text-purple-600">
                    {entries.slice(0, 3).reduce((sum, entry) => sum + entry.duration, 0) / 3 > avgSleep ? '↗️' : '↘️'}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    3 dernières nuits
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">Pas assez de données</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Sleep Entry */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Moon className="w-4 h-4" />
            Enregistrer le sommeil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Heure de coucher</label>
              <Input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Heure de réveil</label>
              <Input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Temps d'endormissement (min)</label>
              <Input
                type="number"
                placeholder="15"
                value={sleepLatency}
                onChange={(e) => setSleepLatency(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Réveils nocturnes</label>
              <Input
                type="number"
                placeholder="0"
                value={nightWakings}
                onChange={(e) => setNightWakings(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Qualité du sommeil</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  onClick={() => setQuality(rating as any)}
                  variant={quality === rating ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                >
                  {rating} {getQualityLabel(rating).emoji}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Notes (optionnel)</label>
            <Textarea
              placeholder="Comment vous sentez-vous ce matin ? Difficultés d'endormissement ? Rêves ?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {bedtime && wakeTime && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm">
                Durée estimée : <strong>{formatDuration(calculateDuration(bedtime, wakeTime))}</strong>
              </span>
            </div>
          )}

          <Button onClick={addSleepEntry} className="w-full">
            Enregistrer la nuit
          </Button>
        </CardContent>
      </Card>

      {/* Sleep History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Historique récent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentEntries.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                  Aucune donnée de sommeil enregistrée
                </p>
              ) : (
                recentEntries.map((entry) => (
                  <div key={entry.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {format(new Date(entry.date), 'dd/MM/yyyy', { locale: fr })}
                      </span>
                      <Badge variant="outline" className={getQualityLabel(entry.quality).color}>
                        {entry.quality}/5 {getQualityLabel(entry.quality).emoji}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <div>🌙 {entry.bedtime} → ☀️ {entry.wakeTime}</div>
                      <div>⏱️ {formatDuration(entry.duration)}</div>
                      {entry.sleepLatency && <div>😴 Endormissement : {entry.sleepLatency}min</div>}
                      {entry.nightWakings !== undefined && <div>🌃 Réveils : {entry.nightWakings}</div>}
                      {entry.notes && <div className="italic">💭 {entry.notes}</div>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Recommandations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getSleepRecommendations().length > 0 ? (
                getSleepRecommendations().map((rec, index) => (
                  <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                      💡 {rec}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="text-sm text-green-800 dark:text-green-200">
                    ✅ Votre sommeil semble dans les normes recommandées !
                  </div>
                </div>
              )}

              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="font-medium">Conseils généraux :</div>
                <ul className="space-y-1 ml-4">
                  <li>• Dormez 7-9 heures par nuit</li>
                  <li>• Maintenez un horaire régulier</li>
                  <li>• Évitez les écrans 1h avant le coucher</li>
                  <li>• Gardez la chambre fraîche et sombre</li>
                  <li>• Évitez la caféine après 14h</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
