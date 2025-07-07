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
  estimatedDuration?: number; // Durée estimée en minutes
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
  const { saveData, loadData, deleteData } = useRobustDataManager();
  
  const [tasksData, setTasksData] = useState<TasksData>(defaultTasksData);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
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

  // Chargement initial avec retry et délai
  useEffect(() => {
    if (hasLoadedOnce) return;
    
    const loadInitialData = async () => {
      try {
        console.log('🔄 Chargement initial des tâches...');
        
        // Ajouter un délai pour éviter les conflits de chargement
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const data = await loadData('productivity-tasks');
        if (data && data.tasks && Array.isArray(data.tasks)) {
          console.log(`✅ ${data.tasks.length} tâches chargées depuis le stockage`);
          const stats = calculateStats(data.tasks);
          setTasksData({ 
            ...defaultTasksData,
            ...data, 
            stats 
          });
        } else {
          console.log('📝 Initialisation avec données par défaut');
          setTasksData(defaultTasksData);
        }
      } catch (error) {
        console.error('❌ Erreur chargement initial:', error);
        setTasksData(defaultTasksData);
        toast({
          title: "Problème de chargement",
          description: "Utilisation des données par défaut",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setHasLoadedOnce(true);
      }
    };

    loadInitialData();
  }, [hasLoadedOnce, loadData, calculateStats, toast]);

  // Sauvegarde robuste avec retry
  const saveTasksData = useCallback(async (newData: TasksData, retryCount = 0): Promise<boolean> => {
    try {
      const dataWithStats = {
        ...newData,
        stats: calculateStats(newData.tasks),
        lastModified: new Date().toISOString(),
        version: '2.3.0'
      };
      
      console.log(`💾 Tentative sauvegarde ${retryCount + 1}: ${dataWithStats.tasks.length} tâches`);
      
      const success = await saveData('productivity-tasks', dataWithStats);
      
      if (success) {
        setTasksData(dataWithStats);
        console.log('✅ Sauvegarde réussie');
        return true;
      } else {
        throw new Error('Échec de la sauvegarde');
      }
    } catch (error) {
      console.error(`❌ Erreur sauvegarde (tentative ${retryCount + 1}):`, error);
      
      // Retry jusqu'à 2 fois
      if (retryCount < 2) {
        console.log(`🔄 Nouvelle tentative dans 1 seconde...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return saveTasksData(newData, retryCount + 1);
      }
      
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder les tâches après plusieurs tentatives",
        variant: "destructive",
      });
      return false;
    }
  }, [saveData, calculateStats, toast]);

  // Ajout de tâche avec validation renforcée
  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task | null> => {
    try {
      // Validation des données
      if (!taskData.title?.trim()) {
        throw new Error('Le titre de la tâche est requis');
      }

      if (taskData.title.length > 200) {
        throw new Error('Le titre de la tâche est trop long (max 200 caractères)');
      }

      console.log('➕ Ajout tâche:', taskData.title);
      
      const newTask: Task = {
        ...taskData,
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: taskData.title.trim(),
        description: taskData.description?.trim() || '',
        tags: Array.isArray(taskData.tags) ? taskData.tags.filter(tag => tag.trim()) : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Créer les nouvelles données
      const newTasksData = {
        ...tasksData,
        tasks: [...tasksData.tasks, newTask]
      };

      // Sauvegarder avec retry
      const success = await saveTasksData(newTasksData);
      
      if (success) {
        console.log('✅ Tâche ajoutée avec succès:', newTask.title);
        toast({
          title: "Tâche ajoutée",
          description: `"${newTask.title}" a été ajoutée avec succès`,
        });
        return newTask;
      } else {
        throw new Error('Échec de la sauvegarde');
      }
    } catch (error) {
      console.error('❌ Erreur ajout tâche:', error);
      toast({
        title: "Erreur d'ajout",
        description: error instanceof Error ? error.message : "Impossible d'ajouter la tâche",
        variant: "destructive",
      });
      return null;
    }
  }, [tasksData, saveTasksData, toast]);

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

  const splitTaskIntoSubtasks = useCallback(async (task: Task) => {
    try {
      console.log('✂️ Division de la tâche:', task.title);
      
      let subtaskTitles: string[] = [];
      
      if (task.description) {
        // Chercher des patterns de liste
        const lines = task.description.split('\n').filter(line => line.trim());
        const listItems = lines.filter(line => 
          /^[-*•]\s/.test(line.trim()) || 
          /^\d+\.\s/.test(line.trim()) || 
          /^[a-zA-Z]\)\s/.test(line.trim())
        );
        
        if (listItems.length > 0) {
          subtaskTitles = listItems.map(item => 
            item.replace(/^[-*•]\s|^\d+\.\s|^[a-zA-Z]\)\s/, '').trim()
          );
        } else {
          // Si pas de liste, créer des étapes génériques
          subtaskTitles = [
            `${task.title} - Préparation`,
            `${task.title} - Recherche et analyse`,
            `${task.title} - Développement/Exécution`,
            `${task.title} - Test et validation`,
            `${task.title} - Finalisation`
          ];
        }
      } else {
        // Pas de description, créer des sous-tâches génériques
        subtaskTitles = [
          `${task.title} - Phase 1`,
          `${task.title} - Phase 2`,
          `${task.title} - Phase 3`
        ];
      }

      // Créer les sous-tâches avec validation
      const createdSubtasks: Task[] = [];
      for (let i = 0; i < subtaskTitles.length; i++) {
        const subtaskData = {
          title: subtaskTitles[i],
          description: `Sous-tâche générée automatiquement à partir de: ${task.title}`,
          completed: false,
          priority: task.priority,
          category: task.category,
          tags: [...task.tags, 'sous-tâche-auto', `étape-${i + 1}`],
          dueDate: task.dueDate,
          estimatedDuration: task.estimatedDuration ? 
            Math.round(task.estimatedDuration / subtaskTitles.length) : 
            Math.round(30 + Math.random() * 30)
        };

        const createdTask = await addTask(subtaskData);
        if (createdTask) {
          createdSubtasks.push(createdTask);
        }
      }

      if (createdSubtasks.length > 0) {
        toast({
          title: "Tâche divisée avec succès",
          description: `${createdSubtasks.length} sous-tâches créées à partir de "${task.title}"`,
        });
        return true;
      } else {
        throw new Error('Aucune sous-tâche n\'a pu être créée');
      }
    } catch (error) {
      console.error('❌ Erreur division de tâche:', error);
      toast({
        title: "Erreur de division",
        description: error instanceof Error ? error.message : "Impossible de diviser la tâche",
        variant: "destructive",
      });
      return false;
    }
  }, [addTask, toast]);

  // Export vers format Google Tasks
  const exportToGoogleTasks = useCallback(() => {
    try {
      const googleTasksFormat = tasksData.tasks.map(task => ({
        title: task.title,
        notes: task.description || '',
        status: task.completed ? 'completed' : 'needsAction',
        due: task.dueDate ? new Date(task.dueDate).toISOString() : undefined
      }));

      const blob = new Blob([JSON.stringify(googleTasksFormat, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `google-tasks-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Export Google Tasks réussi",
        description: "Tâches exportées au format Google Tasks",
      });
    } catch (error) {
      console.error('Erreur export Google Tasks:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter vers Google Tasks",
        variant: "destructive",
      });
    }
  }, [tasksData.tasks, toast]);

  // Export vers format iCalendar
  const exportToICalendar = useCallback(() => {
    try {
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Outils Pratiques//Gestionnaire de Tâches//FR',
        ...tasksData.tasks.map(task => [
          'BEGIN:VTODO',
          `UID:${task.id}@outils-pratiques.com`,
          `SUMMARY:${task.title}`,
          task.description ? `DESCRIPTION:${task.description}` : '',
          `STATUS:${task.completed ? 'COMPLETED' : 'NEEDS-ACTION'}`,
          `PRIORITY:${task.priority === 'high' ? '1' : task.priority === 'medium' ? '5' : '9'}`,
          task.dueDate ? `DUE:${new Date(task.dueDate).toISOString().replace(/[-:]/g, '').split('.')[0]}Z` : '',
          `CATEGORIES:${task.category}`,
          'END:VTODO'
        ].filter(Boolean)).flat(),
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tasks-${new Date().toISOString().split('T')[0]}.ics`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Export iCalendar réussi",
        description: "Tâches exportées au format iCalendar",
      });
    } catch (error) {
      console.error('Erreur export iCalendar:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter vers iCalendar",
        variant: "destructive",
      });
    }
  }, [tasksData.tasks, toast]);

  // Export/Import simplifiés
  const exportData = useCallback(() => {
    try {
      const dataToExport = {
        tool: 'productivity-tasks',
        version: "2.3.0",
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

  // Filtrage optimisé avec gestion d'erreurs
  const filteredTasks = tasksData.tasks.filter(task => {
    try {
      const matchesSearch = !searchTerm || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(task.tags) && task.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      
      const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'completed' && task.completed) ||
                           (filterStatus === 'pending' && !task.completed);

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    } catch (error) {
      console.warn('⚠️ Erreur filtrage tâche:', task.id, error);
      return false;
    }
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
    isOnline: true,
    isSyncing: false,
    lastSyncTime: new Date().toISOString(),
    exportData,
    importData,
    resetData,
    exportToGoogleTasks,
    exportToICalendar
  };
};
