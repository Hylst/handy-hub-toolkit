
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
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    category: '',
    tags: '',
    dueDate: '',
    estimatedDuration: ''
  });

  // Fonction de décomposition IA corrigée
  const handleAIDecomposition = async (subtasks: SubtaskData[]) => {
    console.log(`🤖 Décomposition IA: ${subtasks.length} sous-tâches à créer`);
    setIsProcessingAI(true);
    
    try {
      const baseTask = {
        description: `Tâche parente: ${newTask.title}`,
        completed: false,
        priority: newTask.priority,
        category: newTask.category || 'Personnel',
        tags: [...newTask.tags.split(',').map(tag => tag.trim()).filter(Boolean), 'IA-générée'],
        dueDate: newTask.dueDate || undefined
      };

      let createdCount = 0;
      
      // Créer chaque sous-tâche individuellement
      for (const [index, subtask] of subtasks.entries()) {
        try {
          console.log(`📝 Création sous-tâche ${index + 1}/${subtasks.length}:`, subtask.title);
          
          const taskToCreate = {
            ...baseTask,
            title: subtask.title,
            description: subtask.description || `Sous-tâche ${index + 1} de: ${newTask.title}`,
            estimatedDuration: subtask.estimatedDuration,
            priority: subtask.priority || newTask.priority,
            tags: [...baseTask.tags, `étape-${subtask.order || index + 1}`]
          };

          const createdTask = await addTask(taskToCreate);
          
          if (createdTask) {
            createdCount++;
            console.log(`✅ Sous-tâche créée: ${createdTask.title}`);
          } else {
            console.error(`❌ Échec création sous-tâche: ${subtask.title}`);
          }
          
          // Petit délai entre les créations pour éviter les conflits
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.error(`❌ Erreur création sous-tâche ${index + 1}:`, error);
        }
      }

      console.log(`🎉 Décomposition terminée: ${createdCount}/${subtasks.length} tâches créées`);
      
      if (createdCount > 0) {
        resetForm();
      }
      
      return createdCount;
    } catch (error) {
      console.error('❌ Erreur globale décomposition IA:', error);
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
