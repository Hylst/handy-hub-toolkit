import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckSquare, Plus, AlertTriangle, RefreshCw } from 'lucide-react';
import { useTaskManagerEnhanced, Task } from '../hooks/useTaskManagerEnhanced';
import { DataImportExport } from '../../common/DataImportExport';
import { ToolInfoModal } from './ToolInfoModal';
import { TaskStats } from './TaskStats';
import { TaskFilters } from './TaskFilters';
import { KeywordAnalysis } from './KeywordAnalysis';
import { TaskForm } from './TaskForm';
import { TaskList } from './TaskList';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SubtaskData {
  title: string;
  description: string;
  estimatedDuration?: number;
  priority?: 'low' | 'medium' | 'high';
  order?: number;
}

export const TaskManagerEnhanced = () => {
  const {
    tasks,
    categories,
    stats,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    splitTaskIntoSubtasks,
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    filterPriority,
    setFilterPriority,
    filterStatus,
    setFilterStatus,
    isLoading,
    isOnline,
    isSyncing,
    lastSyncTime,
    exportData,
    importData,
    resetData,
    exportToGoogleTasks,
    exportToICalendar
  } = useTaskManagerEnhanced();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [keywordFilter, setKeywordFilter] = useState('');
  const [sortByKeywords, setSortByKeywords] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    category: '',
    tags: '',
    dueDate: '',
    estimatedDuration: ''
  });

  // Fonction de décomposition IA avec gestion d'erreur améliorée
  const handleAIDecomposition = async (subtasks: SubtaskData[]) => {
    console.log(`🤖 Décomposition IA: ${subtasks.length} sous-tâches à créer`);
    setIsProcessingAI(true);
    setLastError(null);
    
    try {
      if (!subtasks || subtasks.length === 0) {
        throw new Error('Aucune sous-tâche à créer');
      }

      const baseTask = {
        description: `Tâche parente: ${newTask.title}`,
        completed: false,
        priority: newTask.priority,
        category: newTask.category || 'Personnel',
        tags: [...newTask.tags.split(',').map(tag => tag.trim()).filter(Boolean), 'IA-générée'],
        dueDate: newTask.dueDate || undefined
      };

      let createdCount = 0;
      const errors: string[] = [];
      
      // Créer chaque sous-tâche avec retry
      for (const [index, subtask] of subtasks.entries()) {
        try {
          console.log(`📝 Création sous-tâche ${index + 1}/${subtasks.length}:`, subtask.title);
          
          const taskToCreate = {
            ...baseTask,
            title: subtask.title?.trim() || `Sous-tâche ${index + 1}`,
            description: subtask.description?.trim() || `Sous-tâche ${index + 1} de: ${newTask.title}`,
            estimatedDuration: subtask.estimatedDuration || 30,
            priority: subtask.priority || newTask.priority,
            tags: [...baseTask.tags, `étape-${subtask.order || index + 1}`]
          };

          // Validation des données
          if (taskToCreate.title.length < 3) {
            throw new Error(`Titre trop court: "${taskToCreate.title}"`);
          }

          const createdTask = await addTask(taskToCreate);
          
          if (createdTask) {
            createdCount++;
            console.log(`✅ Sous-tâche créée: ${createdTask.title}`);
          } else {
            errors.push(`Échec création: ${taskToCreate.title}`);
          }
          
          // Délai entre les créations pour éviter les conflits
          if (index < subtasks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
          
        } catch (error) {
          const errorMsg = `Erreur création sous-tâche ${index + 1}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`;
          console.error(`❌ ${errorMsg}`);
          errors.push(errorMsg);
        }
      }

      console.log(`🎉 Décomposition terminée: ${createdCount}/${subtasks.length} tâches créées`);
      
      if (createdCount > 0) {
        resetForm();
        
        if (errors.length > 0) {
          setLastError(`${createdCount} tâches créées, ${errors.length} erreurs: ${errors.slice(0, 2).join(', ')}`);
        }
      } else {
        throw new Error(`Aucune sous-tâche créée. Erreurs: ${errors.slice(0, 3).join(', ')}`);
      }
      
      return createdCount;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erreur inconnue lors de la décomposition';
      console.error('❌ Erreur globale décomposition IA:', errorMsg);
      setLastError(errorMsg);
      return 0;
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    const taskData = {
      title: newTask.title,
      description: newTask.description,
      completed: false,
      priority: newTask.priority,
      category: newTask.category || 'Personnel',
      tags: newTask.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      dueDate: newTask.dueDate || undefined,
      estimatedDuration: newTask.estimatedDuration ? parseInt(newTask.estimatedDuration) : undefined
    };

    const created = await addTask(taskData);
    if (created) {
      resetForm();
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask || !newTask.title.trim()) return;

    await updateTask(editingTask.id, {
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      category: newTask.category,
      tags: newTask.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      dueDate: newTask.dueDate || undefined,
      estimatedDuration: newTask.estimatedDuration ? parseInt(newTask.estimatedDuration) : undefined
    });

    resetForm();
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      category: task.category,
      tags: task.tags.join(', '),
      dueDate: task.dueDate || '',
      estimatedDuration: task.estimatedDuration?.toString() || ''
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setEditingTask(null);
    setShowAddForm(false);
    setLastError(null);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      tags: '',
      dueDate: '',
      estimatedDuration: ''
    });
  };

  const handleSplitTask = async () => {
    if (editingTask) {
      const success = await splitTaskIntoSubtasks(editingTask);
      if (success) {
        resetForm();
      }
    }
  };

  // Chargement avec indicateur amélioré
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Chargement des tâches...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Initialisation du gestionnaire de données
            </p>
          </div>
        </div>
      </div>
    );
  }

  const filteredTasks = tasks.filter(task => {
    const matchesKeyword = !keywordFilter || 
      task.tags.some(tag => tag.toLowerCase().includes(keywordFilter.toLowerCase())) ||
      task.title.toLowerCase().includes(keywordFilter.toLowerCase());
    return matchesKeyword;
  });

  const sortedTasks = sortByKeywords ? 
    [...filteredTasks].sort((a, b) => {
      const aKeywords = a.tags.length + a.title.split(' ').length;
      const bKeywords = b.tags.length + b.title.split(' ').length;
      return bKeywords - aKeywords;
    }) : filteredTasks;

  return (
    <div className="space-y-4 lg:space-y-6">
      <Card className="shadow-lg border-2">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50">
          <CardTitle className="flex items-center justify-between text-lg lg:text-xl">
            <div className="flex items-center gap-3">
              <CheckSquare className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-600" />
              Gestionnaire de Tâches Avancé
              {isSyncing && <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />}
              {!isOnline && <AlertTriangle className="w-4 h-4 text-orange-500" />}
            </div>
            <ToolInfoModal toolType="tasks" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 lg:space-y-6 p-4 lg:p-6">
          {/* Alerte d'erreur */}
          {lastError && (
            <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/50">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <AlertDescription className="text-orange-700 dark:text-orange-300">
                {lastError}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setLastError(null)}
                  className="ml-2 h-auto p-0 text-orange-600 hover:text-orange-800"
                >
                  ✕
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Statistiques */}
          <TaskStats stats={stats} />

          <Separator />

          {/* Filtres */}
          <TaskFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            keywordFilter={keywordFilter}
            setKeywordFilter={setKeywordFilter}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            sortByKeywords={sortByKeywords}
            setSortByKeywords={setSortByKeywords}
            categories={categories}
          />

          {/* Analyse des mots-clés */}
          <KeywordAnalysis 
            tasks={tasks} 
            onKeywordClick={setKeywordFilter}
          />

          {/* Bouton d'ajout */}
          <Button 
            onClick={() => {
              setShowAddForm(!showAddForm);
              if (showAddForm) {
                resetForm();
              }
            }}
            className="w-full sm:w-auto"
            disabled={isProcessingAI}
          >
            <Plus className="w-4 h-4 mr-2" />
            {showAddForm ? 'Annuler' : 'Nouvelle tâche'}
          </Button>

          {/* Formulaire d'ajout/édition */}
          {showAddForm && (
            <TaskForm
              isEditing={!!editingTask}
              editingTask={editingTask}
              newTask={newTask}
              setNewTask={setNewTask}
              categories={categories}
              onSubmit={editingTask ? handleUpdateTask : handleAddTask}
              onSplit={editingTask ? handleSplitTask : undefined}
              onAIDecompose={handleAIDecomposition}
            />
          )}

          {/* Liste des tâches */}
          <TaskList
            tasks={sortedTasks}
            searchTerm={searchTerm}
            keywordFilter={keywordFilter}
            filterCategory={filterCategory}
            filterPriority={filterPriority}
            filterStatus={filterStatus}
            onToggle={toggleTask}
            onEdit={startEdit}
            onDelete={deleteTask}
          />

          {/* Message si aucune tâche */}
          {sortedTasks.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <CheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">
                Aucune tâche trouvée
              </h3>
              <p className="text-gray-400 mb-4">
                {tasks.length === 0 ? 'Créez votre première tâche pour commencer' : 'Aucune tâche ne correspond aux filtres actuels'}
              </p>
              {tasks.length === 0 && (
                <Button onClick={() => setShowAddForm(true)} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une tâche
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import/Export avec formats spécialisés */}
      <DataImportExport
        onExport={exportData}
        onImport={importData}
        onReset={resetData}
        isOnline={isOnline}
        isSyncing={isSyncing}
        lastSyncTime={lastSyncTime}
        toolName="Tâches"
        onExportGoogleTasks={exportToGoogleTasks}
        onExportICalendar={exportToICalendar}
      />
    </div>
  );
};
