
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Scissors, Sparkles, Calendar, Tag, AlertCircle, Clock } from 'lucide-react';
import { useLLMManager } from '../hooks/useLLMManager';
import { Task } from '../hooks/useTaskManagerEnhanced';

interface SubtaskData {
  title: string;
  description: string;
  estimatedDuration?: number;
}

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
  categories: string[];
  onSubmit: () => void;
  onSplit?: () => void;
  onAIDecompose: (subtasks: SubtaskData[]) => void;
}

export const TaskForm = ({
  isEditing,
  editingTask,
  newTask,
  setNewTask,
  categories,
  onSubmit,
  onSplit,
  onAIDecompose
}: TaskFormProps) => {
  const [isDecomposing, setIsDecomposing] = useState(false);
  const { decomposeTaskWithAI, isLoading: isLLMLoading } = useLLMManager();

  const handleAIDecompose = async () => {
    if (!newTask.title.trim()) return;

    setIsDecomposing(true);
    try {
      const result = await decomposeTaskWithAI({
        taskTitle: newTask.title,
        taskDescription: newTask.description,
        tags: newTask.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        priority: newTask.priority,
        category: newTask.category,
        estimatedDuration: newTask.estimatedDuration ? parseInt(newTask.estimatedDuration) : undefined
      });
      
      if (result.success && result.subtasks.length > 0) {
        await onAIDecompose(result.subtasks);
      }
    } catch (error) {
      console.error('Erreur décomposition IA:', error);
    } finally {
      setIsDecomposing(false);
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
        {/* Titre */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Titre *
          </label>
          <Input
            placeholder="Titre de la tâche..."
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="border-blue-200 focus:border-blue-400"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <Textarea
            placeholder="Description détaillée... (utilisez des listes avec - ou 1. pour faciliter la division)"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="min-h-20 border-blue-200 focus:border-blue-400"
          />
        </div>

        {/* Ligne 1: Priorité et Catégorie */}
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
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Catégorie
            </label>
            <Select value={newTask.category} onValueChange={(value) => setNewTask({ ...newTask, category: value })}>
              <SelectTrigger className="border-blue-200 focus:border-blue-400">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Personnel">Personnel</SelectItem>
                <SelectItem value="Travail">Travail</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
                <SelectItem value="Projet">Projet</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Ligne 2: Tags et Date d'échéance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <Tag className="w-4 h-4" />
              Tags (séparés par des virgules)
            </label>
            <Input
              placeholder="tag1, tag2, tag3..."
              value={newTask.tags}
              onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>

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
        </div>

        {/* Durée estimée */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Durée estimée (minutes)
          </label>
          <Input
            type="number"
            min="1"
            placeholder="Ex: 60 pour 1 heure"
            value={newTask.estimatedDuration}
            onChange={(e) => setNewTask({ ...newTask, estimatedDuration: e.target.value })}
            className="border-blue-200 focus:border-blue-400"
          />
        </div>

        <Separator />

        {/* Boutons d'action */}
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={onSubmit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isEditing ? 'Mettre à jour' : 'Ajouter'}
          </Button>

          {isEditing && onSplit && (
            <Button 
              variant="outline" 
              onClick={onSplit}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              <Scissors className="w-4 h-4 mr-2" />
              Diviser
            </Button>
          )}

          <Button 
            variant="outline" 
            onClick={handleAIDecompose}
            disabled={isDecomposing || isLLMLoading || !newTask.title.trim()}
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isDecomposing ? 'Décomposition...' : 'IA Décomposer'}
          </Button>
        </div>

        {/* Note sur la configuration LLM */}
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 rounded">
          💡 Pour configurer vos clés API LLM, accédez aux <strong>Paramètres</strong> via le menu latéral.
        </div>
      </CardContent>
    </Card>
  );
};
