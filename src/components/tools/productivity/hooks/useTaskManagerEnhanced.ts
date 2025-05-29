
import { useState, useCallback } from 'react';
import { useOfflineDataManager } from '@/hooks/useOfflineDataManager';

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
  const {
    data: tasksData,
    setData: setTasksData,
    isLoading,
    isOnline,
    isSyncing,
    lastSyncTime,
    exportData,
    importData,
    resetData
  } = useOfflineDataManager<TasksData>({
    toolName: 'productivity-tasks',
    defaultData: defaultTasksData
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Calculer les statistiques
  const updateStats = useCallback((tasks: Task[]) => {
    const stats = {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.completed).length,
      pendingTasks: tasks.filter(t => !t.completed).length,
      highPriorityTasks: tasks.filter(t => t.priority === 'high' && !t.completed).length
    };
    return stats;
  }, []);

  // Ajouter une tâche
  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newTasks = [...(tasksData?.tasks || []), newTask];
    const newStats = updateStats(newTasks);

    await setTasksData({
      ...tasksData,
      tasks: newTasks,
      stats: newStats
    });
  }, [tasksData, setTasksData, updateStats]);

  // Mettre à jour une tâche
  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    const newTasks = (tasksData?.tasks || []).map(task =>
      task.id === taskId
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    );

    const newStats = updateStats(newTasks);

    await setTasksData({
      ...tasksData,
      tasks: newTasks,
      stats: newStats
    });
  }, [tasksData, setTasksData, updateStats]);

  // Supprimer une tâche
  const deleteTask = useCallback(async (taskId: string) => {
    const newTasks = (tasksData?.tasks || []).filter(task => task.id !== taskId);
    const newStats = updateStats(newTasks);

    await setTasksData({
      ...tasksData,
      tasks: newTasks,
      stats: newStats
    });
  }, [tasksData, setTasksData, updateStats]);

  // Basculer le statut d'une tâche
  const toggleTask = useCallback(async (taskId: string) => {
    const task = tasksData?.tasks.find(t => t.id === taskId);
    if (task) {
      await updateTask(taskId, { completed: !task.completed });
    }
  }, [tasksData?.tasks, updateTask]);

  // Ajouter une catégorie
  const addCategory = useCallback(async (category: string) => {
    if (!tasksData?.categories.includes(category)) {
      await setTasksData({
        ...tasksData,
        categories: [...(tasksData?.categories || []), category]
      });
    }
  }, [tasksData, setTasksData]);

  // Filtrer les tâches
  const filteredTasks = (tasksData?.tasks || []).filter(task => {
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
    allTasks: tasksData?.tasks || [],
    categories: tasksData?.categories || [],
    stats: tasksData?.stats || defaultTasksData.stats,
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
    isOnline,
    isSyncing,
    lastSyncTime,
    exportData,
    importData,
    resetData
  };
};
