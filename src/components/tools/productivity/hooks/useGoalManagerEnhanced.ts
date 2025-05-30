
import { useState, useCallback } from 'react';
import { useOfflineDataManager } from '@/hooks/useOfflineDataManager';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  type: 'personal' | 'professional' | 'health' | 'learning' | 'financial';
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  progress: number; // 0-100
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  startDate: string;
  targetDate: string;
  completedDate?: string;
  milestones: Milestone[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  targetDate?: string;
  completedDate?: string;
}

interface GoalsData {
  goals: Goal[];
  categories: string[];
  stats: {
    totalGoals: number;
    activeGoals: number;
    completedGoals: number;
    averageProgress: number;
    onTrackGoals: number;
    overdueGoals: number;
  };
}

const defaultGoalsData: GoalsData = {
  goals: [],
  categories: ['Personnel', 'Professionnel', 'Santé', 'Apprentissage', 'Financier'],
  stats: {
    totalGoals: 0,
    activeGoals: 0,
    completedGoals: 0,
    averageProgress: 0,
    onTrackGoals: 0,
    overdueGoals: 0
  }
};

export const useGoalManagerEnhanced = () => {
  const {
    data: goalsData,
    setData: setGoalsData,
    isLoading,
    isOnline,
    isSyncing,
    lastSyncTime,
    exportData,
    importData,
    resetData
  } = useOfflineDataManager<GoalsData>({
    toolName: 'productivity-goals',
    defaultData: defaultGoalsData
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Calculer les statistiques
  const updateStats = useCallback((goals: Goal[]) => {
    const activeGoals = goals.filter(g => g.status === 'active');
    const completedGoals = goals.filter(g => g.status === 'completed');
    const today = new Date().toISOString().split('T')[0];
    
    const overdueGoals = activeGoals.filter(g => g.targetDate < today);
    const onTrackGoals = activeGoals.filter(g => {
      const timeElapsed = (new Date().getTime() - new Date(g.startDate).getTime());
      const totalTime = (new Date(g.targetDate).getTime() - new Date(g.startDate).getTime());
      const expectedProgress = Math.min((timeElapsed / totalTime) * 100, 100);
      return g.progress >= expectedProgress * 0.8; // On track if 80% of expected progress
    });

    const averageProgress = activeGoals.length > 0 
      ? activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length 
      : 0;

    return {
      totalGoals: goals.length,
      activeGoals: activeGoals.length,
      completedGoals: completedGoals.length,
      averageProgress: Math.round(averageProgress),
      onTrackGoals: onTrackGoals.length,
      overdueGoals: overdueGoals.length
    };
  }, []);

  // Ajouter un objectif
  const addGoal = useCallback(async (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: Date.now().toString(),
      milestones: goalData.milestones || [],
      tags: goalData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newGoals = [...(goalsData?.goals || []), newGoal];
    const newStats = updateStats(newGoals);

    await setGoalsData({
      ...goalsData,
      goals: newGoals,
      stats: newStats
    });
  }, [goalsData, setGoalsData, updateStats]);

  // Mettre à jour un objectif
  const updateGoal = useCallback(async (goalId: string, updates: Partial<Goal>) => {
    const newGoals = (goalsData?.goals || []).map(goal =>
      goal.id === goalId
        ? { ...goal, ...updates, updatedAt: new Date().toISOString() }
        : goal
    );

    const newStats = updateStats(newGoals);

    await setGoalsData({
      ...goalsData,
      goals: newGoals,
      stats: newStats
    });
  }, [goalsData, setGoalsData, updateStats]);

  // Supprimer un objectif
  const deleteGoal = useCallback(async (goalId: string) => {
    const newGoals = (goalsData?.goals || []).filter(goal => goal.id !== goalId);
    const newStats = updateStats(newGoals);

    await setGoalsData({
      ...goalsData,
      goals: newGoals,
      stats: newStats
    });
  }, [goalsData, setGoalsData, updateStats]);

  // Mettre à jour le progrès
  const updateProgress = useCallback(async (goalId: string, progress: number, currentValue?: number) => {
    const updates: Partial<Goal> = { 
      progress: Math.min(Math.max(progress, 0), 100),
      currentValue
    };

    if (progress >= 100) {
      updates.status = 'completed';
      updates.completedDate = new Date().toISOString();
    }

    await updateGoal(goalId, updates);
  }, [updateGoal]);

  // Ajouter un milestone
  const addMilestone = useCallback(async (goalId: string, milestone: Omit<Milestone, 'id'>) => {
    const goal = goalsData?.goals.find(g => g.id === goalId);
    if (goal) {
      const newMilestone: Milestone = {
        ...milestone,
        id: Date.now().toString()
      };
      
      await updateGoal(goalId, {
        milestones: [...goal.milestones, newMilestone]
      });
    }
  }, [goalsData?.goals, updateGoal]);

  // Basculer un milestone
  const toggleMilestone = useCallback(async (goalId: string, milestoneId: string) => {
    const goal = goalsData?.goals.find(g => g.id === goalId);
    if (goal) {
      const updatedMilestones = goal.milestones.map(m =>
        m.id === milestoneId
          ? { 
              ...m, 
              completed: !m.completed,
              completedDate: !m.completed ? new Date().toISOString() : undefined
            }
          : m
      );
      
      // Calculer le progrès automatique basé sur les milestones
      const completedMilestones = updatedMilestones.filter(m => m.completed).length;
      const totalMilestones = updatedMilestones.length;
      const milestoneProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : goal.progress;
      
      await updateGoal(goalId, {
        milestones: updatedMilestones,
        progress: Math.max(goal.progress, milestoneProgress)
      });
    }
  }, [goalsData?.goals, updateGoal]);

  // Filtrer les objectifs
  const filteredGoals = (goalsData?.goals || []).filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || goal.type === filterType;
    const matchesStatus = filterStatus === 'all' || goal.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || goal.priority === filterPriority;

    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  return {
    goals: filteredGoals,
    allGoals: goalsData?.goals || [],
    categories: goalsData?.categories || [],
    stats: goalsData?.stats || defaultGoalsData.stats,
    addGoal,
    updateGoal,
    deleteGoal,
    updateProgress,
    addMilestone,
    toggleMilestone,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    isLoading,
    isOnline,
    isSyncing,
    lastSyncTime,
    exportData,
    importData,
    resetData
  };
};
