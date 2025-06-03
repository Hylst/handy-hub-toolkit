
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dumbbell, Clock, Zap, Target, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format, isToday, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Exercise {
  id: string;
  name: string;
  category: string;
  duration: number; // en minutes
  intensity: 'low' | 'moderate' | 'high';
  calories?: number;
  notes?: string;
  timestamp: string;
}

interface ExerciseTrackerProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const ExerciseTracker = ({ data, onDataChange }: ExerciseTrackerProps) => {
  const [exercises, setExercises] = useState<Exercise[]>(data.exercises || []);
  const [weeklyGoal, setWeeklyGoal] = useState(data.weeklyGoal || 150); // minutes par semaine
  const [exerciseName, setExerciseName] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [calories, setCalories] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    onDataChange({
      exercises,
      weeklyGoal,
      lastUpdated: new Date().toISOString()
    });
  }, [exercises, weeklyGoal]);

  const exerciseCategories = [
    { value: 'cardio', label: 'Cardio', emoji: '🏃', color: 'bg-red-100 text-red-700' },
    { value: 'strength', label: 'Musculation', emoji: '💪', color: 'bg-blue-100 text-blue-700' },
    { value: 'flexibility', label: 'Flexibilité', emoji: '🧘', color: 'bg-purple-100 text-purple-700' },
    { value: 'sports', label: 'Sports', emoji: '⚽', color: 'bg-green-100 text-green-700' },
    { value: 'walking', label: 'Marche', emoji: '🚶', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'swimming', label: 'Natation', emoji: '🏊', color: 'bg-cyan-100 text-cyan-700' },
    { value: 'cycling', label: 'Vélo', emoji: '🚴', color: 'bg-orange-100 text-orange-700' },
    { value: 'other', label: 'Autre', emoji: '🏋️', color: 'bg-gray-100 text-gray-700' }
  ];

  const intensityLevels = [
    { value: 'low', label: 'Faible', multiplier: 1, color: 'text-green-600' },
    { value: 'moderate', label: 'Modérée', multiplier: 1.5, color: 'text-yellow-600' },
    { value: 'high', label: 'Élevée', multiplier: 2, color: 'text-red-600' }
  ];

  const calculateCalories = (duration: number, intensity: string, category: string) => {
    // Estimations basiques des calories brûlées par minute selon l'activité
    const baseMET = {
      cardio: 8,
      strength: 6,
      flexibility: 3,
      sports: 7,
      walking: 4,
      swimming: 8,
      cycling: 6,
      other: 5
    };

    const intensityMultiplier = {
      low: 0.8,
      moderate: 1.0,
      high: 1.3
    };

    // Estimation pour une personne de 70kg
    const met = baseMET[category as keyof typeof baseMET] || 5;
    const multiplier = intensityMultiplier[intensity as keyof typeof intensityMultiplier] || 1;
    
    return Math.round(met * multiplier * duration * 1.2); // 1.2 = facteur de conversion approximatif
  };

  const addExercise = () => {
    if (!exerciseName || !category || !duration) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const durationNum = parseInt(duration);
    const estimatedCalories = calories ? parseInt(calories) : calculateCalories(durationNum, intensity, category);

    const newExercise: Exercise = {
      id: crypto.randomUUID(),
      name: exerciseName,
      category,
      duration: durationNum,
      intensity,
      calories: estimatedCalories,
      notes: notes.trim() || undefined,
      timestamp: new Date().toISOString()
    };

    setExercises([newExercise, ...exercises]);
    
    // Reset form
    setExerciseName('');
    setCategory('');
    setDuration('');
    setIntensity('moderate');
    setCalories('');
    setNotes('');

    toast({
      title: "Exercice enregistré",
      description: `${exerciseName} (${durationNum}min) ajouté`,
    });
  };

  const deleteExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
    toast({
      title: "Exercice supprimé",
      description: "L'exercice a été retiré de votre historique",
    });
  };

  const todayExercises = exercises.filter(ex => isToday(new Date(ex.timestamp)));
  const todayDuration = todayExercises.reduce((sum, ex) => sum + ex.duration, 0);
  const todayCalories = todayExercises.reduce((sum, ex) => sum + (ex.calories || 0), 0);

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const weeklyExercises = exercises.filter(ex => {
    const exDate = new Date(ex.timestamp);
    return exDate >= weekStart && exDate <= weekEnd;
  });
  const weeklyDuration = weeklyExercises.reduce((sum, ex) => sum + ex.duration, 0);
  const weeklyProgress = Math.min((weeklyDuration / weeklyGoal) * 100, 100);

  const getCategoryInfo = (categoryValue: string) => {
    return exerciseCategories.find(cat => cat.value === categoryValue) || exerciseCategories[exerciseCategories.length - 1];
  };

  const getIntensityInfo = (intensityValue: string) => {
    return intensityLevels.find(int => int.value === intensityValue) || intensityLevels[1];
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{todayDuration}min</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {todayExercises.length} activité{todayExercises.length > 1 ? 's' : ''}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Calories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{todayCalories}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">brûlées aujourd'hui</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="w-4 h-4" />
              Objectif hebdo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-600">{weeklyDuration}/{weeklyGoal}min</div>
            <Progress value={weeklyProgress} className="mt-2" />
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {weeklyProgress.toFixed(0)}% de l'objectif
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total exercices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{exercises.length}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">exercices enregistrés</div>
          </CardContent>
        </Card>
      </div>

      {/* Goal Setting */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Objectif hebdomadaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                type="number"
                value={weeklyGoal}
                onChange={(e) => setWeeklyGoal(parseInt(e.target.value) || 150)}
                placeholder="Minutes par semaine"
              />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Recommandé : 150min/semaine (OMS)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Exercise */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ajouter un exercice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Nom de l'exercice</label>
              <Input
                placeholder="Course, natation, yoga..."
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Catégorie</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {exerciseCategories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        <span>{cat.emoji}</span>
                        <span>{cat.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Durée (minutes)</label>
              <Input
                type="number"
                placeholder="30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Intensité</label>
              <Select value={intensity} onValueChange={(value: any) => setIntensity(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {intensityLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      <span className={level.color}>{level.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Calories (optionnel)</label>
              <Input
                type="number"
                placeholder="Auto-calculé"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Notes (optionnel)</label>
            <Input
              placeholder="Distance, poids utilisé, ressenti..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {exerciseName && category && duration && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm">
                Calories estimées : <strong>{calculateCalories(parseInt(duration) || 0, intensity, category)} kcal</strong>
              </span>
            </div>
          )}

          <Button onClick={addExercise} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter l'exercice
          </Button>
        </CardContent>
      </Card>

      {/* Exercise History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Historique des exercices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {exercises.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                Aucun exercice enregistré
              </p>
            ) : (
              exercises.map((exercise) => {
                const categoryInfo = getCategoryInfo(exercise.category);
                const intensityInfo = getIntensityInfo(exercise.intensity);
                
                return (
                  <div key={exercise.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{categoryInfo.emoji}</span>
                          <span className="font-medium">{exercise.name}</span>
                          <Badge variant="outline" className={categoryInfo.color}>
                            {categoryInfo.label}
                          </Badge>
                          <Badge variant="outline" className={intensityInfo.color}>
                            {intensityInfo.label}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <div className="flex items-center gap-4">
                            <span>⏱️ {exercise.duration}min</span>
                            <span>🔥 {exercise.calories}kcal</span>
                            <span>📅 {format(new Date(exercise.timestamp), 'dd/MM/yyyy HH:mm', { locale: fr })}</span>
                          </div>
                          {exercise.notes && (
                            <div className="italic">💭 {exercise.notes}</div>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => deleteExercise(exercise.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
