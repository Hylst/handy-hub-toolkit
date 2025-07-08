
import { useState, useCallback, useEffect } from 'react';
import { useRobustDataManager } from '@/hooks/useRobustDataManager';
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
  estimatedDuration?: number;
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
  categories: [
    'Travail', 'Personnel', 'Projets', 'Urgent', 'Formation',
    'Santé & Bien-être', 'Finance', 'Maison & Famille', 'Créatif',
    'Voyage', 'Technologie', 'Sport & Fitness'
  ],
  stats: { totalTasks: 0, completedTasks: 0, pendingTasks: 0, highPriorityTasks: 0 }
};

export const useTaskManager = () => {
  const { toast } = useToast();
  const { saveData, loadData, deleteData } = useRobustDataManager();
  
  const [tasksData, setTasksData] = useState<TasksData>(defaultTasksData);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const calculateStats = useCallback((tasks: Task[]) => ({
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.completed).length,
    pendingTasks: tasks.filter(t => !t.completed).length,
    highPriorityTasks: tasks.filter(t => t.priority === 'high' && !t.completed).length
  }), []);

  const loadTasks = useCallback(async () => {
    try {
      const data = await loadData('productivity-tasks');
      if (data?.tasks && Array.isArray(data.tasks)) {
        const stats = calculateStats(data.tasks);
        setTasksData({ ...defaultTasksData, ...data, stats });
      } else {
        setTasksData(defaultTasksData);
      }
    } catch (error) {
      console.error('❌ Erreur chargement:', error);
      setTasksData(defaultTasksData);
    }
  }, [loadData, calculateStats]);

  const saveTasks = useCallback(async (newData: TasksData, optimisticUpdate = true) => {
    try {
      const dataWithStats = {
        ...newData,
        stats: calculateStats(newData.tasks),
        lastModified: new Date().toISOString(),
        version: '3.0.0'
      };
      
      // Mise à jour optimiste immédiate
      if (optimisticUpdate) {
        setTasksData(dataWithStats);
      }
      
      const success = await saveData('productivity-tasks', dataWithStats);
      
      if (success) {
        console.log(`✅ ${dataWithStats.tasks.length} tâches sauvegardées`);
        // Confirmation de la mise à jour
        if (!optimisticUpdate) {
          setTasksData(dataWithStats);
        }
        return true;
      }
      throw new Error('Échec sauvegarde');
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      // Rollback en cas d'erreur
      if (optimisticUpdate) {
        await loadTasks();
      }
      return false;
    }
  }, [calculateStats, saveData, loadTasks]);

  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task | null> => {
    try {
      if (!taskData.title?.trim()) throw new Error('Titre requis');

      const newTask: Task = {
        ...taskData,
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: taskData.title.trim(),
        description: taskData.description?.trim() || '',
        tags: Array.isArray(taskData.tags) ? taskData.tags.filter(tag => tag.trim()) : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const newTasksData = {
        ...tasksData,
        tasks: [...tasksData.tasks, newTask]
      };

      const success = await saveTasks(newTasksData);
      
      if (success) {
        toast({
          title: "Tâche ajoutée",
          description: `"${newTask.title}" a été ajoutée`,
        });
        return newTask;
      }
      throw new Error('Échec sauvegarde');
    } catch (error) {
      console.error('❌ Erreur ajout:', error);
      toast({
        title: "Erreur d'ajout",
        description: error instanceof Error ? error.message : "Impossible d'ajouter la tâche",
        variant: "destructive",
      });
      return null;
    }
  }, [tasksData, saveTasks, toast]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasksData.tasks.map(task =>
      task.id === taskId
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    );
    await saveTasks({ ...tasksData, tasks: updatedTasks });
  }, [tasksData, saveTasks]);

  const deleteTask = useCallback(async (taskId: string) => {
    const filteredTasks = tasksData.tasks.filter(task => task.id !== taskId);
    await saveTasks({ ...tasksData, tasks: filteredTasks });
  }, [tasksData, saveTasks]);

  const toggleTask = useCallback(async (taskId: string) => {
    const task = tasksData.tasks.find(t => t.id === taskId);
    if (task) {
      await updateTask(taskId, { completed: !task.completed });
    }
  }, [tasksData.tasks, updateTask]);

  // Chargement initial
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      await loadTasks();
      setIsLoading(false);
    };
    initializeData();
  }, [loadTasks]);

  // Filtrage des tâches
  const filteredTasks = tasksData.tasks.filter(task => {
    const matchesSearch = !searchTerm || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
  };
};
