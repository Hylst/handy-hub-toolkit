
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckSquare, Plus } from 'lucide-react';
import { useTaskManagerEnhanced, Task } from '../hooks/useTaskManagerEnhanced';
import { DataImportExport } from '../../common/DataImportExport';
import { ToolInfoModal } from './ToolInfoModal';
import { TaskStats } from './TaskStats';
import { TaskFilters } from './TaskFilters';
import { KeywordAnalysis } from './KeywordAnalysis';
import { TaskForm } from './TaskForm';
import { TaskList } from './TaskList';

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
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    category: '',
    tags: '',
    dueDate: ''
  });

  const splitTaskIntoSubtasks = async (task: Task) => {
    const subtaskTitles = task.description?.split('\n').filter(line => line.trim()) || [
      `${task.title} - Partie 1`,
      `${task.title} - Partie 2`
    ];

    for (let i = 0; i < subtaskTitles.length; i++) {
      await addTask({
        title: subtaskTitles[i],
        description: `Sous-tâche de: ${task.title}`,
        completed: false,
        priority: task.priority,
        category: task.category,
        tags: [...task.tags, 'sous-tâche'],
        dueDate: task.dueDate
      });
    }
  };

  const handleAIDecomposition = async (subtasks: string[]) => {
    const baseTask = {
      description: `Tâche parente: ${newTask.title}`,
      completed: false,
      priority: newTask.priority,
      category: newTask.category || 'Personnel',
      tags: [...newTask.tags.split(',').map(tag => tag.trim()).filter(Boolean), 'IA-décomposée'],
      dueDate: newTask.dueDate || undefined
    };

    // Créer les sous-tâches
    for (const subtask of subtasks) {
      await addTask({
        ...baseTask,
        title: subtask.trim(),
      });
    }

    resetForm();
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    await addTask({
      title: newTask.title,
      description: newTask.description,
      completed: false,
      priority: newTask.priority,
      category: newTask.category || 'Personnel',
      tags: newTask.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      dueDate: newTask.dueDate || undefined
    });

    resetForm();
  };

  const handleUpdateTask = async () => {
    if (!editingTask || !newTask.title.trim()) return;

    await updateTask(editingTask.id, {
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      category: newTask.category,
      tags: newTask.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      dueDate: newTask.dueDate || undefined
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
      dueDate: task.dueDate || ''
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
      dueDate: ''
    });
  };

  const handleSplitTask = async () => {
    if (editingTask) {
      await splitTaskIntoSubtasks(editingTask);
      resetForm();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-500">Chargement des tâches...</p>
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
