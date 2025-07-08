import { useState } from 'react';
import { useLLMManager } from './useLLMManager';
import { useToast } from '@/hooks/use-toast';
import { Task } from './useTaskManager';

interface SubtaskData {
  title: string;
  description: string;
  estimatedDuration?: number;
  priority?: 'low' | 'medium' | 'high';
  order?: number;
}

interface DecompositionTask {
  title: string;
  description: string;
  priority: Task['priority'];
  category: string;
  tags: string;
  dueDate?: string;
  estimatedDuration?: string;
}

export const useTaskDecomposition = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { decomposeTaskWithAI, hasConfiguredProvider } = useLLMManager();
  const { toast } = useToast();

  const decomposeWithAI = async (
    taskData: DecompositionTask,
    onTaskCreate: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task | null>
  ) => {
    if (!hasConfiguredProvider) {
      toast({
        title: "Configuration requise",
        description: "Configurez une clé API LLM dans les paramètres",
        variant: "destructive",
      });
      return { success: false, count: 0 };
    }

    setIsProcessing(true);
    try {
      console.log('🧠 Décomposition IA:', taskData.title);
      
      const result = await decomposeTaskWithAI({
        taskTitle: taskData.title.trim(),
        taskDescription: taskData.description.trim(),
        tags: taskData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        priority: taskData.priority,
        category: taskData.category || 'Personnel',
        estimatedDuration: taskData.estimatedDuration ? parseInt(taskData.estimatedDuration) : undefined,
        context: `Catégorie: ${taskData.category}, Tags: ${taskData.tags}`
      });
      
      if (!result.success || !result.subtasks.length) {
        throw new Error(result.error || "Aucune sous-tâche générée");
      }

      console.log(`✅ ${result.subtasks.length} sous-tâches générées`);
      
      // Création séquentielle avec délai pour éviter les conflits
      const createdTasks: Task[] = [];
      const baseTask = {
        description: `Sous-tâche de: ${taskData.title}`,
        completed: false,
        priority: taskData.priority,
        category: taskData.category || 'Personnel',
        tags: [...taskData.tags.split(',').map(tag => tag.trim()).filter(Boolean), 'IA-générée'],
        dueDate: taskData.dueDate || undefined
      };

      for (const [index, subtask] of result.subtasks.entries()) {
        try {
          const taskToCreate = {
            ...baseTask,
            title: subtask.title?.trim() || `Sous-tâche ${index + 1}`,
            description: subtask.description?.trim() || baseTask.description,
            estimatedDuration: subtask.estimatedDuration || 30,
            priority: subtask.priority || taskData.priority,
            tags: [...baseTask.tags, `étape-${subtask.order || index + 1}`]
          };

          const createdTask = await onTaskCreate(taskToCreate);
          if (createdTask) {
            createdTasks.push(createdTask);
            console.log(`✅ Sous-tâche ${index + 1}/${result.subtasks.length} créée`);
          }
          
          // Délai entre créations
          if (index < result.subtasks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        } catch (error) {
          console.error(`❌ Erreur sous-tâche ${index + 1}:`, error);
        }
      }

      const successCount = createdTasks.length;
      
      if (successCount > 0) {
        toast({
          title: "Décomposition réussie",
          description: `${successCount} sous-tâches créées`,
        });
      }

      return { success: successCount > 0, count: successCount };
    } catch (error) {
      console.error('❌ Erreur décomposition:', error);
      toast({
        title: "Erreur de décomposition",
        description: error instanceof Error ? error.message : "Erreur inconnue",
        variant: "destructive",
      });
      return { success: false, count: 0 };
    } finally {
      setIsProcessing(false);
    }
  };

  const splitTask = async (
    task: Task,
    onTaskCreate: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task | null>
  ) => {
    try {
      console.log('✂️ Division manuelle:', task.title);
      
      let subtaskTitles: string[] = [];
      
      if (task.description) {
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
          subtaskTitles = [
            `${task.title} - Préparation`,
            `${task.title} - Exécution`,
            `${task.title} - Finalisation`
          ];
        }
      } else {
        subtaskTitles = [
          `${task.title} - Phase 1`,
          `${task.title} - Phase 2`,
          `${task.title} - Phase 3`
        ];
      }

      const createdSubtasks: Task[] = [];
      for (const [i, title] of subtaskTitles.entries()) {
        const subtaskData = {
          title,
          description: `Sous-tâche générée de: ${task.title}`,
          completed: false,
          priority: task.priority,
          category: task.category,
          tags: [...task.tags, 'sous-tâche-auto', `étape-${i + 1}`],
          dueDate: task.dueDate,
          estimatedDuration: task.estimatedDuration ? 
            Math.round(task.estimatedDuration / subtaskTitles.length) : 
            30
        };

        const createdTask = await onTaskCreate(subtaskData);
        if (createdTask) {
          createdSubtasks.push(createdTask);
        }
      }

      if (createdSubtasks.length > 0) {
        toast({
          title: "Tâche divisée",
          description: `${createdSubtasks.length} sous-tâches créées`,
        });
        return true;
      }
      
      throw new Error('Aucune sous-tâche créée');
    } catch (error) {
      console.error('❌ Erreur division:', error);
      toast({
        title: "Erreur de division",
        description: error instanceof Error ? error.message : "Impossible de diviser",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    decomposeWithAI,
    splitTask,
    isProcessing,
    hasConfiguredProvider
  };
};