
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckSquare, Plus, AlertTriangle } from 'lucide-react';
import { useTaskManager, Task } from '../hooks/useTaskManager';
import { DataImportExport } from '../../common/DataImportExport';
import { ToolInfoModal } from './ToolInfoModal';
import { TaskStats } from './TaskStats';
import { TaskFilters } from './TaskFilters';
import { KeywordAnalysis } from './KeywordAnalysis';
import { TaskFormSimplified } from './TaskFormSimplified';
import { TaskList } from './TaskList';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const TaskManagerEnhanced = () => {
  const {
    tasks,
    categories,
    stats,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    filterPriority,
    setFilterPriority,
    filterStatus,
    setFilterStatus,
    isLoading,
    loadTasks
  } = useTaskManager();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [keywordFilter, setKeywordFilter] = useState('');
  const [sortByKeywords, setSortByKeywords] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    category: '',
    tags: '',
    dueDate: '',
    estimatedDuration: ''
  });

  const handleSuccess = async () => {
    // Réinitialiser filtres et formulaire
    setSearchTerm('');
    setFilterCategory('all');
    setFilterPriority('all');
    setFilterStatus('all');
    setKeywordFilter('');
    setSortByKeywords(false);
    resetForm();
    
    // Recharger les données
    setTimeout(async () => {
      await loadTasks();
    }, 500);
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

    await addTask(taskData);
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

  const handleToggleTask = async (taskId: string) => {
    await toggleTask(taskId);
    setTimeout(() => loadTasks(), 200);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    setTimeout(() => loadTasks(), 200);
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
            </div>
            <ToolInfoModal toolType="tasks" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 lg:space-y-6 p-4 lg:p-6">

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
          >
            <Plus className="w-4 h-4 mr-2" />
            {showAddForm ? 'Annuler' : 'Nouvelle tâche'}
          </Button>

          {/* Formulaire d'ajout/édition */}
          {showAddForm && (
            <TaskFormSimplified
              isEditing={!!editingTask}
              editingTask={editingTask}
              newTask={newTask}
              setNewTask={setNewTask}
              onSubmit={editingTask ? handleUpdateTask : handleAddTask}
              onTaskCreate={addTask}
              onSuccess={handleSuccess}
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
            onToggle={handleToggleTask}
            onEdit={startEdit}
            onDelete={handleDeleteTask}
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

      {/* Import/Export */}
      <div className="text-center text-sm text-gray-500">
        Fonctionnalités d'import/export disponibles dans les paramètres
      </div>
    </div>
  );
};
