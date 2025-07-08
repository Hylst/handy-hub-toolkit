import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Scissors, Brain, Calendar, Tag, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { Task } from '../hooks/useTaskManager';
import { useTaskDecomposition } from '../hooks/useTaskDecomposition';
import { CategoryPresets } from './CategoryPresets';
import { useToast } from '@/hooks/use-toast';

interface TaskFormProps {
  isEditing: boolean;
  editingTask: Task | null;
  newTask: {
    title: string;
    description: string;
    priority: Task['priority'];
    category: string;
    tags: string;
    dueDate: string;
    estimatedDuration: string;
  };
  setNewTask: (task: any) => void;
  onSubmit: () => void;
  onSplit?: () => void;
  onTaskCreate: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task | null>;
  onSuccess?: () => void;
}

export const TaskFormSimplified = ({
  isEditing,
  editingTask,
  newTask,
  setNewTask,
  onSubmit,
  onSplit,
  onTaskCreate,
  onSuccess
}: TaskFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { decomposeWithAI, splitTask, isProcessing, hasConfiguredProvider } = useTaskDecomposition();
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!newTask.title.trim()) {
      errors.push('Le titre est obligatoire');
    } else if (newTask.title.trim().length < 3) {
      errors.push('Le titre doit contenir au moins 3 caractères');
    }
    
    if (newTask.estimatedDuration) {
      const duration = parseInt(newTask.estimatedDuration);
      if (isNaN(duration) || duration < 1 || duration > 1440) {
        errors.push('La durée doit être entre 1 et 1440 minutes');
      }
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Erreurs de validation",
        description: validationErrors.join(', '),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit();
      onSuccess?.();
    } catch (error) {
      console.error('❌ Erreur soumission:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder la tâche",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIDecompose = async () => {
    if (!validateForm()) return;

    const result = await decomposeWithAI(newTask, onTaskCreate);
    
    if (result.success) {
      // Réinitialiser les filtres et rafraîchir
      onSuccess?.();
      toast({
        title: "Décomposition terminée",
        description: `${result.count} sous-tâches créées avec succès`,
      });
    }
  };

  const handleSplit = async () => {
    if (!editingTask) return;
    
    const success = await splitTask(editingTask, onTaskCreate);
    if (success) {
      onSuccess?.();
    }
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-2 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
          <Plus className="w-5 h-5" />
          {isEditing ? 'Modifier la tâche' : 'Nouvelle tâche'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Erreurs de validation */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-800 mb-2">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">Erreurs à corriger :</span>
            </div>
            <ul className="text-sm text-red-700 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Titre */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Titre * <span className="text-xs text-gray-500">({newTask.title.length}/200)</span>
          </label>
          <Input
            placeholder="Titre de la tâche..."
            value={newTask.title}
            onChange={(e) => {
              setNewTask({ ...newTask, title: e.target.value });
              setValidationErrors([]);
            }}
            className="border-blue-200 focus:border-blue-400"
            maxLength={200}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Description <span className="text-xs text-gray-500">({newTask.description.length}/1000)</span>
          </label>
          <Textarea
            placeholder="Description détaillée pour une meilleure décomposition IA..."
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="min-h-20 border-blue-200 focus:border-blue-400"
            maxLength={1000}
          />
        </div>

        {/* Catégories avec couleurs */}
        <CategoryPresets 
          onCategorySelect={(category) => setNewTask({ ...newTask, category })}
          selectedCategory={newTask.category}
        />

        {/* Ligne 1: Priorité et Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Priorité
            </label>
            <Select value={newTask.priority} onValueChange={(value: Task['priority']) => setNewTask({ ...newTask, priority: value })}>
              <SelectTrigger className="border-blue-200 focus:border-blue-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Faible</Badge>
                </SelectItem>
                <SelectItem value="medium">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Moyenne</Badge>
                </SelectItem>
                <SelectItem value="high">
                  <Badge variant="secondary" className="bg-red-100 text-red-800">Élevée</Badge>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <Tag className="w-4 h-4" />
              Tags (séparés par des virgules)
            </label>
            <Input
              placeholder="urgent, important, projet..."
              value={newTask.tags}
              onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>
        </div>

        {/* Ligne 2: Date et Durée */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Date d'échéance
            </label>
            <Input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Durée estimée (minutes)
            </label>
            <Input
              type="number"
              min="1"
              max="1440"
              placeholder="120"
              value={newTask.estimatedDuration}
              onChange={(e) => setNewTask({ ...newTask, estimatedDuration: e.target.value })}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>
        </div>

        <Separator />

        {/* Boutons d'action */}
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || isProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sauvegarde...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                {isEditing ? 'Mettre à jour' : 'Ajouter'}
              </>
            )}
          </Button>

          {isEditing && onSplit && (
            <Button 
              variant="outline" 
              onClick={handleSplit}
              disabled={isSubmitting || isProcessing}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              <Scissors className="w-4 h-4 mr-2" />
              Diviser
            </Button>
          )}

          <Button 
            variant="outline" 
            onClick={handleAIDecompose}
            disabled={isProcessing || !newTask.title.trim() || !hasConfiguredProvider || isSubmitting}
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                IA en cours...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                IA Décomposer
              </>
            )}
          </Button>
        </div>

        {/* Info IA */}
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-4 h-4" />
            <strong>Décomposition IA intelligente</strong>
          </div>
          <p>• {hasConfiguredProvider ? '✅ API configurée' : '⚠️ Configurez vos clés API'}</p>
          <p>• L'IA créera 4-8 sous-tâches détaillées automatiquement</p>
        </div>
      </CardContent>
    </Card>
  );
};