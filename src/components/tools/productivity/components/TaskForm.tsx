
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Split, Sparkles, Settings } from 'lucide-react';
import { Task } from '../hooks/useTaskManagerEnhanced';
import { useLLMManager } from '../hooks/useLLMManager';
import { useState } from 'react';
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
  };
  setNewTask: (task: any) => void;
  categories: string[];
  onSubmit: () => void;
  onSplit?: () => void;
  onAIDecompose?: (subtasks: string[]) => void;
  onShowLLMSettings?: () => void;
}

export const TaskForm = ({
  isEditing,
  editingTask,
  newTask,
  setNewTask,
  categories,
  onSubmit,
  onSplit,
  onAIDecompose,
  onShowLLMSettings
}: TaskFormProps) => {
  const { toast } = useToast();
  const { decomposeTaskWithAI, isLoading: isAILoading, hasConfiguredProvider } = useLLMManager();
  const [isDecomposing, setIsDecomposing] = useState(false);

  const handleAIDecompose = async () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Titre requis",
        description: "Veuillez saisir un titre de tâche pour la décomposition IA",
        variant: "destructive",
      });
      return;
    }

    if (!hasConfiguredProvider) {
      toast({
        title: "Configuration requise",
        description: "Veuillez configurer une clé API LLM pour utiliser l'IA",
        variant: "destructive",
      });
      if (onShowLLMSettings) {
        onShowLLMSettings();
      }
      return;
    }

    setIsDecomposing(true);
    try {
      const result = await decomposeTaskWithAI({
        taskTitle: newTask.title,
        taskDescription: newTask.description,
        context: `Catégorie: ${newTask.category}, Priorité: ${newTask.priority}`
      });

      if (result.success && result.subtasks.length > 0) {
        toast({
          title: "Décomposition réussie",
          description: `${result.subtasks.length} sous-tâches générées`,
        });
        
        if (onAIDecompose) {
          onAIDecompose(result.subtasks);
        }
      } else {
        toast({
          title: "Décomposition échouée",
          description: result.error || "Impossible de décomposer la tâche",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur décomposition IA:', error);
      toast({
        title: "Erreur IA",
        description: "Une erreur est survenue lors de la décomposition",
        variant: "destructive",
      });
    } finally {
      setIsDecomposing(false);
    }
  };

  return (
    <Card className="border-2 border-emerald-200 dark:border-emerald-800">
      <CardContent className="p-4 space-y-4">
        <Input
          placeholder="Titre de la tâche *"
          value={newTask.title}
          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
        />
        <Textarea
          placeholder="Description (optionnel) - Une ligne par sous-tâche pour découper manuellement"
          value={newTask.description}
          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({...newTask, priority: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">🟢 Basse</SelectItem>
              <SelectItem value="medium">🟡 Moyenne</SelectItem>
              <SelectItem value="high">🔴 Haute</SelectItem>
            </SelectContent>
          </Select>
          <Select value={newTask.category} onValueChange={(value) => setNewTask({...newTask, category: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
          />
        </div>
        <Input
          placeholder="Tags (séparés par des virgules)"
          value={newTask.tags}
          onChange={(e) => setNewTask({...newTask, tags: e.target.value})}
        />
        
        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={onSubmit}
            disabled={!newTask.title.trim()}
            className="flex-1"
          >
            {isEditing ? 'Mettre à jour' : 'Ajouter'} la tâche
          </Button>
          
          {/* Décomposition manuelle */}
          {isEditing && editingTask && newTask.description && onSplit && (
            <Button
              variant="outline"
              onClick={onSplit}
            >
              <Split className="w-4 h-4 mr-2" />
              Découper
            </Button>
          )}
          
          {/* Décomposition IA */}
          <Button
            variant="outline"
            onClick={handleAIDecompose}
            disabled={isDecomposing || isAILoading}
            className="relative"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isDecomposing ? 'Analyse IA...' : 'Décomposer IA'}
          </Button>
          
          {/* Paramètres LLM */}
          {onShowLLMSettings && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowLLMSettings}
              title="Configurer les modèles LLM"
            >
              <Settings className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Aide contextuelle */}
        {!hasConfiguredProvider && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700">
              💡 <strong>Décomposition IA disponible !</strong> Configurez une clé API LLM pour décomposer automatiquement vos tâches complexes en sous-tâches actionnables.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
