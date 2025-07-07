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
  const { saveData, loadData, deleteData } = useDexieDB();
  
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

  // Chargement initial UNIQUE
  useEffect(() => {
    if (hasLoadedOnce) return; // Éviter les rechargements multiples
    
    const loadInitialData = async () => {
      try {
        console.log('🔄 Chargement initial des tâches...');
        const data = await loadData('productivity-tasks');
        if (data && data.tasks) {
          console.log(`✅ ${data.tasks.length} tâches chargées`);
          const stats = calculateStats(data.tasks);
          setTasksData({ ...data, stats });
        } else {
          console.log('📝 Utilisation des données par défaut');
          setTasksData(defaultTasksData);
        }
      } catch (error) {
        console.error('❌ Erreur chargement:', error);
        setTasksData(defaultTasksData);
      } finally {
        setIsLoading(false);
        setHasLoadedOnce(true);
      }
    };

    loadInitialData();
  }, [hasLoadedOnce, loadData, calculateStats]);

  // Sauvegarde optimisée
  const saveTasksData = useCallback(async (newData: TasksData) => {
    try {
      const dataWithStats = {
        ...newData,
        stats: calculateStats(newData.tasks)
      };
      
      console.log('💾 Sauvegarde de', dataWithStats.tasks.length, 'tâches');
      const success = await saveData('productivity-tasks', dataWithStats);
      
      if (success) {
        setTasksData(dataWithStats);
        console.log('✅ Tâches sauvegardées');
        return true;
      } else {
        throw new Error('Échec de la sauvegarde');
      }
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder les tâches",
        variant: "destructive",
      });
      return false;
    }
  }, [saveData, calculateStats, toast]);

  // Ajout de tâche corrigé
  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('➕ Ajout tâche:', taskData.title);
    
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Créer les nouvelles données
    const newTasksData = {
      ...tasksData,
      tasks: [...tasksData.tasks, newTask]
    };

    // Sauvegarder immédiatement
    const success = await saveTasksData(newTasksData);
    
    if (success) {
      console.log('✅ Tâche ajoutée:', newTask.title);
      return newTask;
    } else {
      console.error('❌ Échec ajout tâche');
      return null;
    }
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

  const splitTaskIntoSubtasks = useCallback(async (task: Task) => {
    try {
      // Si la description contient des lignes avec des puces ou des numéros, on les utilise
      let subtaskTitles: string[] = [];
      
      if (task.description) {
        // Chercher des patterns de liste (-, *, 1., 2., etc.)
        const lines = task.description.split('\n').filter(line => line.trim());
        const listItems = lines.filter(line => 
          /^[-*•]\s/.test(line.trim()) || // puces
          /^\d+\.\s/.test(line.trim()) || // numéros
          /^[a-zA-Z]\)\s/.test(line.trim()) // lettres
        );
        
        if (listItems.length > 0) {
          subtaskTitles = listItems.map(item => 
            item.replace(/^[-*•]\s|^\d+\.\s|^[a-zA-Z]\)\s/, '').trim()
          );
        } else {
          // Si pas de liste, diviser par phrases ou créer des sous-tâches génériques
          const sentences = task.description.split(/[.!?]+/).filter(s => s.trim().length > 10);
          if (sentences.length > 1) {
            subtaskTitles = sentences.map((sentence, index) => 
              `${task.title} - Étape ${index + 1}: ${sentence.trim().substring(0, 50)}...`
            );
          } else {
            // Créer des sous-tâches génériques
            subtaskTitles = [
              `${task.title} - Préparation`,
              `${task.title} - Exécution`,
              `${task.title} - Finalisation`
            ];
          }
        }
      } else {
        // Pas de description, créer des sous-tâches génériques
        subtaskTitles = [
          `${task.title} - Partie 1`,
          `${task.title} - Partie 2`
        ];
      }

      // Créer les sous-tâches
      for (let i = 0; i < subtaskTitles.length; i++) {
        await addTask({
          title: subtaskTitles[i],
          description: `Sous-tâche de: ${task.title}`,
          completed: false,
          priority: task.priority,
          category: task.category,
          tags: [...task.tags, 'sous-tâche'],
          dueDate: task.dueDate,
          estimatedDuration: task.estimatedDuration ? Math.round(task.estimatedDuration / subtaskTitles.length) : undefined
        });
      }

      toast({
        title: "Tâche divisée avec succès",
        description: `${subtaskTitles.length} sous-tâches créées à partir de "${task.title}"`,
      });

      return true;
    } catch (error) {
      console.error('Erreur lors de la division de la tâche:', error);
      toast({
        title: "Erreur de division",
        description: "Impossible de diviser la tâche",
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
