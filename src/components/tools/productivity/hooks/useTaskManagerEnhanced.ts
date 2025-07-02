
import { useState, useCallback, useEffect } from 'react';
import { useDexieDB } from '@/hooks/useDexieDB';
import { useToast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  tags: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface TasksData {
  tasks: Task[];
  categories: string[];
  stats: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    highPriorityTasks: number;
  };
}

const defaultTasksData: TasksData = {
  tasks: [],
  categories: ['Travail', 'Personnel', 'Projets', 'Urgent'],
  stats: {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    highPriorityTasks: 0
  }
};

export const useTaskManagerEnhanced = () => {
  const { toast } = useToast();
  const { saveData, loadData, deleteData } = useDexieDB();
  
  const [tasksData, setTasksData] = useState<TasksData>(defaultTasksData);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Calculer les statistiques
  const calculateStats = useCallback((tasks: Task[]) => ({
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.completed).length,
    pendingTasks: tasks.filter(t => !t.completed).length,
    highPriorityTasks: tasks.filter(t => t.priority === 'high' && !t.completed).length
  }), []);

  // Chargement initial
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await loadData('productivity-tasks');
        if (data && data.tasks) {
          const stats = calculateStats(data.tasks);
          setTasksData({ ...data, stats });
        } else {
          setTasksData(defaultTasksData);
        }
      } catch (error) {
        console.error('Erreur chargement tâches:', error);
        setTasksData(defaultTasksData);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [loadData, calculateStats]);

  // Sauvegarde avec debounce
  const saveTasksData = useCallback(async (newData: TasksData) => {
    try {
      const dataWithStats = {
        ...newData,
        stats: calculateStats(newData.tasks)
      };
      
      await saveData('productivity-tasks', dataWithStats);
      setTasksData(dataWithStats);
      
      return true;
    } catch (error) {
      console.error('Erreur sauvegarde tâches:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder les tâches",
        variant: "destructive",
      });
      return false;
    }
  }, [saveData, calculateStats, toast]);

  // CRUD operations
  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveTasksData({
      ...tasksData,
      tasks: [...tasksData.tasks, newTask]
    });
  }, [tasksData, saveTasksData]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasksData.tasks.map(task =>
      task.id === taskId
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    );

    await saveTasksData({
      ...tasksData,
      tasks: updatedTasks
    });
  }, [tasksData, saveTasksData]);

  const deleteTask = useCallback(async (taskId: string) => {
    const filteredTasks = tasksData.tasks.filter(task => task.id !== taskId);
    
    await saveTasksData({
      ...tasksData,
      tasks: filteredTasks
    });
  }, [tasksData, saveTasksData]);

  const toggleTask = useCallback(async (taskId: string) => {
    const task = tasksData.tasks.find(t => t.id === taskId);
    if (task) {
      await updateTask(taskId, { completed: !task.completed });
    }
  }, [tasksData.tasks, updateTask]);

  const addCategory = useCallback(async (category: string) => {
    if (!tasksData.categories.includes(category)) {
      await saveTasksData({
        ...tasksData,
        categories: [...tasksData.categories, category]
      });
    }
  }, [tasksData, saveTasksData]);

  // Export/Import simplifiés
  const exportData = useCallback(() => {
    try {
      const dataToExport = {
        tool: 'productivity-tasks',
        version: "2.2.0",
        exportDate: new Date().toISOString(),
        data: tasksData
      };
      
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export réussi",
        description: "Tâches exportées avec succès",
      });
    } catch (error) {
      console.error('Erreur export:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les tâches",
        variant: "destructive",
      });
    }
  }, [tasksData, toast]);

  const importData = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const importObj = JSON.parse(text);
      
      if (!importObj.data || importObj.tool !== 'productivity-tasks') {
        throw new Error('Format de fichier incorrect');
      }
      
      await saveTasksData(importObj.data);
      
      toast({
        title: "Import réussi",
        description: "Tâches importées avec succès",
      });
      
      return true;
    } catch (error) {
      console.error('Erreur import:', error);
      toast({
        title: "Erreur d'import",
        description: "Format de fichier incorrect",
        variant: "destructive",
      });
      return false;
    }
  }, [saveTasksData, toast]);

  const resetData = useCallback(async () => {
    try {
      await deleteData('productivity-tasks');
      setTasksData(defaultTasksData);
      
      toast({
        title: "Données réinitialisées",
        description: "Toutes les tâches ont été supprimées",
      });
    } catch (error) {
      console.error('Erreur reset:', error);
    }
  }, [deleteData, toast]);

  // Filtrage optimisé
  const filteredTasks = tasksData.tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'completed' && task.completed) ||
                         (filterStatus === 'pending' && !task.completed);

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  return {
    tasks: filteredTasks,
    allTasks: tasksData.tasks,
    categories: tasksData.categories,
    stats: tasksData.stats,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    addCategory,
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    filterPriority,
    setFilterPriority,
    filterStatus,
    setFilterStatus,
    isLoading,
    isOnline: true,
    isSyncing: false,
    lastSyncTime: new Date().toISOString(),
    exportData,
    importData,
    resetData
  };
};
