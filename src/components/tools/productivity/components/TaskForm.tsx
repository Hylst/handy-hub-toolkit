import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Scissors, Brain, Calendar, Tag, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { useLLMManager } from '../hooks/useLLMManager';
import { Task } from '../hooks/useTaskManagerEnhanced';
import { useToast } from '@/hooks/use-toast';

interface SubtaskData {
  title: string;
  description: string;
  estimatedDuration?: number;
  priority?: 'low' | 'medium' | 'high';
  order?: number;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { decomposeTaskWithAI, isLoading: isLLMLoading, hasConfiguredProvider } = useLLMManager();
  const { toast } = useToast();

  // Catégories enrichies et uniques
  const enrichedCategories = [
    'Personnel',
    'Travail', 
    'Projets',
    'Urgent',
    'Formation',
    'Santé & Bien-être',
    'Finance',
    'Maison & Famille',
    'Créatif',
    'Voyage',
    'Technologie',
    'Sport & Fitness',
    'Administration',
    'Achats',
    'Événements',
    'Maintenance',
    'Recherche',
    'Communication'
  ];

  // Fusionner et dédupliquer les catégories
  const allCategories = Array.from(new Set([...enrichedCategories, ...categories]));

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!newTask.title.trim()) {
      errors.push('Le titre est obligatoire');
    } else if (newTask.title.trim().length < 3) {
      errors.push('Le titre doit contenir au moins 3 caractères');
    } else if (newTask.title.length > 200) {
      errors.push('Le titre ne peut pas dépasser 200 caractères');
    }
    
    if (newTask.description && newTask.description.length > 1000) {
      errors.push('La description ne peut pas dépasser 1000 caractères');
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
      console.log('✅ Soumission du formulaire réussie');
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
    if (!validateForm()) {
      toast({
        title: "Formulaire invalide",
        description: "Corrigez les erreurs avant de décomposer",
        variant: "destructive",
      });
      return;
    }

    if (!hasConfiguredProvider) {
      toast({
        title: "Configuration requise",
        description: "Veuillez configurer une clé API LLM dans les paramètres",
        variant: "destructive",
      });
      return;
    }

    setIsDecomposing(true);
    try {
      console.log('🧠 Démarrage de la décomposition IA pour:', newTask.title);
      
      const result = await decomposeTaskWithAI({
        taskTitle: newTask.title.trim(),
        taskDescription: newTask.description.trim(),
        tags: newTask.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        priority: newTask.priority,
        category: newTask.category || 'Personnel',
        estimatedDuration: newTask.estimatedDuration ? parseInt(newTask.estimatedDuration) : undefined,
        context: `Catégorie: ${newTask.category || 'Non définie'}, Tags: ${newTask.tags || 'Aucun'}`
      });
      
      if (result.success && result.subtasks.length > 0) {
        console.log(`✅ ${result.subtasks.length} sous-tâches générées par l'IA`);
        
        toast({
          title: "Décomposition réussie",
          description: `${result.subtasks.length} sous-tâches vont être créées`,
        });
        
        // Appeler la fonction de décomposition avec les sous-tâches
        await onAIDecompose(result.subtasks);
      } else {
        throw new Error(result.error || "L'IA n'a pas pu décomposer cette tâche");
      }
    } catch (error) {
      console.error('❌ Erreur décomposition IA:', error);
      toast({
        title: "Erreur de décomposition",
        description: error instanceof Error ? error.message : "Une erreur s'est produite",
        variant: "destructive",
      });
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

        {/* Titre avec validation */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Titre * 
            <span className="text-xs text-gray-500">
              ({newTask.title.length}/200)
            </span>
          </label>
          <Input
            placeholder="Titre de la tâche... (ex: Créer une présentation marketing)"
            value={newTask.title}
            onChange={(e) => {
              setNewTask({ ...newTask, title: e.target.value });
              setValidationErrors([]);
            }}
            className={`border-blue-200 focus:border-blue-400 ${
              validationErrors.some(e => e.includes('titre')) ? 'border-red-300' : ''
            }`}
            autoComplete="off"
            name="task-title"
            maxLength={200}
          />
        </div>

        {/* Description avec validation */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
            <span className="text-xs text-gray-500">
              ({newTask.description.length}/1000)
            </span>
          </label>
          <Textarea
            placeholder="Description détaillée... Plus c'est détaillé, mieux l'IA pourra décomposer la tâche en sous-étapes logiques."
            value={newTask.description}
            onChange={(e) => {
              setNewTask({ ...newTask, description: e.target.value });
              setValidationErrors([]);
            }}
            className="min-h-20 border-blue-200 focus:border-blue-400"
            autoComplete="off"
            name="task-description"
            maxLength={1000}
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
                {allCategories.map(cat => (
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
              placeholder="important, urgent, projet..."
              value={newTask.tags}
              onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
              className="border-blue-200 focus:border-blue-400"
              autoComplete="off"
              name="task-tags"
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
              autoComplete="off"
              name="task-due-date"
            />
          </div>
        </div>

        {/* Durée estimée avec validation */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Durée estimée (minutes)
          </label>
          <Input
            type="number"
            min="1"
            max="1440"
            placeholder="Ex: 120 pour 2 heures"
            value={newTask.estimatedDuration}
            onChange={(e) => {
              setNewTask({ ...newTask, estimatedDuration: e.target.value });
              setValidationErrors([]);
            }}
            className={`border-blue-200 focus:border-blue-400 ${
              validationErrors.some(e => e.includes('durée')) ? 'border-red-300' : ''
            }`}
            autoComplete="off"
            name="task-duration"
          />
        </div>

        <Separator />

        {/* Boutons d'action */}
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || isDecomposing}
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
              onClick={onSplit}
              disabled={isSubmitting || isDecomposing}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              <Scissors className="w-4 h-4 mr-2" />
              Diviser
            </Button>
          )}

          <Button 
            variant="outline" 
            onClick={handleAIDecompose}
            disabled={isDecomposing || isLLMLoading || !newTask.title.trim() || !hasConfiguredProvider || isSubmitting}
            className="border-purple-300 text-purple-700 hover:bg-purple-50 disabled:opacity-50"
          >
            {isDecomposing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                IA en cours...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                IA Décomposer (4-8 sous-tâches)
              </>
            )}
          </Button>
        </div>

        {/* Informations sur la configuration LLM */}
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg space-y-1">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            <strong>Décomposition IA ultra-intelligente</strong>
          </div>
          <p>• L'IA analysera votre tâche et créera 4 à 8 sous-tâches détaillées et ordonnées</p>
          <p>• Plus votre description est précise, meilleure sera la décomposition</p>
          <p>• Toutes les sous-tâches seront automatiquement sauvegardées individuellement</p>
          <p>• {hasConfiguredProvider ? '✅ API configurée et prête' : '⚠️ Configurez vos clés API dans les Paramètres'}</p>
        </div>
      </CardContent>
    </Card>
  );
};
