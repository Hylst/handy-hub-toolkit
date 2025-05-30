
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Target, Plus, Search, Edit, Trash2, Trophy, Calendar, Flag, TrendingUp, CheckCircle, Circle, Users } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useGoalManagerEnhanced, Goal, Milestone } from '../hooks/useGoalManagerEnhanced';
import { DataImportExport } from '../../common/DataImportExport';

export const GoalManagerEnhanced = () => {
  const {
    goals,
    stats,
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
  } = useGoalManagerEnhanced();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    type: 'personal' as Goal['type'],
    priority: 'medium' as Goal['priority'],
    targetValue: '',
    currentValue: '',
    unit: '',
    startDate: new Date().toISOString().split('T')[0],
    targetDate: '',
    tags: ''
  });

  const [newMilestone, setNewMilestone] = useState({
    goalId: '',
    title: '',
    description: '',
    targetDate: ''
  });

  const handleAddGoal = async () => {
    if (!newGoal.title.trim() || !newGoal.targetDate) return;

    await addGoal({
      title: newGoal.title,
      description: newGoal.description,
      type: newGoal.type,
      priority: newGoal.priority,
      status: 'active',
      progress: 0,
      targetValue: newGoal.targetValue ? parseFloat(newGoal.targetValue) : undefined,
      currentValue: newGoal.currentValue ? parseFloat(newGoal.currentValue) : undefined,
      unit: newGoal.unit || undefined,
      startDate: newGoal.startDate,
      targetDate: newGoal.targetDate,
      milestones: [],
      tags: newGoal.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });

    resetForm();
  };

  const handleUpdateGoal = async () => {
    if (!editingGoal || !newGoal.title.trim() || !newGoal.targetDate) return;

    await updateGoal(editingGoal.id, {
      title: newGoal.title,
      description: newGoal.description,
      type: newGoal.type,
      priority: newGoal.priority,
      targetValue: newGoal.targetValue ? parseFloat(newGoal.targetValue) : undefined,
      currentValue: newGoal.currentValue ? parseFloat(newGoal.currentValue) : undefined,
      unit: newGoal.unit || undefined,
      startDate: newGoal.startDate,
      targetDate: newGoal.targetDate,
      tags: newGoal.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });

    resetForm();
  };

  const resetForm = () => {
    setNewGoal({
      title: '',
      description: '',
      type: 'personal',
      priority: 'medium',
      targetValue: '',
      currentValue: '',
      unit: '',
      startDate: new Date().toISOString().split('T')[0],
      targetDate: '',
      tags: ''
    });
    setShowAddForm(false);
    setEditingGoal(null);
  };

  const startEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setNewGoal({
      title: goal.title,
      description: goal.description || '',
      type: goal.type,
      priority: goal.priority,
      targetValue: goal.targetValue?.toString() || '',
      currentValue: goal.currentValue?.toString() || '',
      unit: goal.unit || '',
      startDate: goal.startDate,
      targetDate: goal.targetDate,
      tags: goal.tags.join(', ')
    });
    setShowAddForm(true);
  };

  const handleAddMilestone = async () => {
    if (!newMilestone.goalId || !newMilestone.title.trim()) return;

    await addMilestone(newMilestone.goalId, {
      title: newMilestone.title,
      description: newMilestone.description,
      completed: false,
      targetDate: newMilestone.targetDate || undefined
    });

    setNewMilestone({
      goalId: '',
      title: '',
      description: '',
      targetDate: ''
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'professional': return '💼';
      case 'health': return '🏃';
      case 'learning': return '📚';
      case 'financial': return '💰';
      default: return '🎯';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
    }
  };

  const getDaysRemaining = (targetDate: string) => {
    return differenceInDays(new Date(targetDate), new Date());
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-500">Chargement des objectifs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <Card className="shadow-lg border-2">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50">
          <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
            <Target className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
            Gestionnaire d'Objectifs Avancé
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 lg:space-y-6 p-4 lg:p-6">
          {/* Statistiques */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4">
            <div className="p-3 lg:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <h3 className="font-semibold text-blue-700 dark:text-blue-300 text-xs lg:text-sm">Total</h3>
              <p className="text-lg lg:text-2xl font-bold text-blue-600">{stats.totalGoals}</p>
            </div>
            <div className="p-3 lg:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <h3 className="font-semibold text-green-700 dark:text-green-300 text-xs lg:text-sm">Actifs</h3>
              <p className="text-lg lg:text-2xl font-bold text-green-600">{stats.activeGoals}</p>
            </div>
            <div className="p-3 lg:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
              <h3 className="font-semibold text-purple-700 dark:text-purple-300 text-xs lg:text-sm">Terminés</h3>
              <p className="text-lg lg:text-2xl font-bold text-purple-600">{stats.completedGoals}</p>
            </div>
            <div className="p-3 lg:p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
              <h3 className="font-semibold text-yellow-700 dark:text-yellow-300 text-xs lg:text-sm">Progrès Moy.</h3>
              <p className="text-lg lg:text-2xl font-bold text-yellow-600">{stats.averageProgress}%</p>
            </div>
            <div className="p-3 lg:p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg text-center">
              <h3 className="font-semibold text-teal-700 dark:text-teal-300 text-xs lg:text-sm">Sur la voie</h3>
              <p className="text-lg lg:text-2xl font-bold text-teal-600">{stats.onTrackGoals}</p>
            </div>
            <div className="p-3 lg:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
              <h3 className="font-semibold text-red-700 dark:text-red-300 text-xs lg:text-sm">En retard</h3>
              <p className="text-lg lg:text-2xl font-bold text-red-600">{stats.overdueGoals}</p>
            </div>
          </div>

          <Separator />

          {/* Recherche et filtres */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous types</SelectItem>
                <SelectItem value="personal">🎯 Personnel</SelectItem>
                <SelectItem value="professional">💼 Professionnel</SelectItem>
                <SelectItem value="health">🏃 Santé</SelectItem>
                <SelectItem value="learning">📚 Apprentissage</SelectItem>
                <SelectItem value="financial">💰 Financier</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="paused">En pause</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes priorités</SelectItem>
                <SelectItem value="high">🔴 Haute</SelectItem>
                <SelectItem value="medium">🟡 Moyenne</SelectItem>
                <SelectItem value="low">🟢 Basse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bouton d'ajout */}
          <Button 
            onClick={() => {
              setShowAddForm(!showAddForm);
              if (showAddForm) resetForm();
            }}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            {showAddForm ? 'Annuler' : 'Nouvel objectif'}
          </Button>

          {/* Formulaire d'ajout/édition */}
          {showAddForm && (
            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 space-y-4">
                <Input
                  placeholder="Titre de l'objectif *"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                />
                <Textarea
                  placeholder="Description (optionnel)"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <Select value={newGoal.type} onValueChange={(value: any) => setNewGoal({...newGoal, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">🎯 Personnel</SelectItem>
                      <SelectItem value="professional">💼 Professionnel</SelectItem>
                      <SelectItem value="health">🏃 Santé</SelectItem>
                      <SelectItem value="learning">📚 Apprentissage</SelectItem>
                      <SelectItem value="financial">💰 Financier</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={newGoal.priority} onValueChange={(value: any) => setNewGoal({...newGoal, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🟢 Basse</SelectItem>
                      <SelectItem value="medium">🟡 Moyenne</SelectItem>
                      <SelectItem value="high">🔴 Haute</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Unité (kg, €, heures...)"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Input
                    placeholder="Valeur cible"
                    type="number"
                    value={newGoal.targetValue}
                    onChange={(e) => setNewGoal({...newGoal, targetValue: e.target.value})}
                  />
                  <Input
                    placeholder="Valeur actuelle"
                    type="number"
                    value={newGoal.currentValue}
                    onChange={(e) => setNewGoal({...newGoal, currentValue: e.target.value})}
                  />
                  <Input
                    type="date"
                    value={newGoal.startDate}
                    onChange={(e) => setNewGoal({...newGoal, startDate: e.target.value})}
                  />
                  <Input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                  />
                </div>
                <Input
                  placeholder="Tags (séparés par des virgules)"
                  value={newGoal.tags}
                  onChange={(e) => setNewGoal({...newGoal, tags: e.target.value})}
                />
                <Button 
                  onClick={editingGoal ? handleUpdateGoal : handleAddGoal}
                  disabled={!newGoal.title.trim() || !newGoal.targetDate}
                  className="w-full"
                >
                  {editingGoal ? 'Mettre à jour' : 'Ajouter'} l'objectif
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Liste des objectifs */}
          <div className="space-y-4">
            {goals.length === 0 ? (
              <div className="text-center py-8 lg:py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <Target className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-2">
                  {searchTerm || filterType !== 'all' || filterStatus !== 'all' || filterPriority !== 'all'
                    ? 'Aucun objectif ne correspond aux filtres'
                    : 'Aucun objectif créé'
                  }
                </p>
                <p className="text-sm text-gray-500">
                  {searchTerm || filterType !== 'all' || filterStatus !== 'all' || filterPriority !== 'all'
                    ? 'Modifiez vos critères de recherche'
                    : 'Commencez par définir votre premier objectif'
                  }
                </p>
              </div>
            ) : (
              goals.map(goal => (
                <Card key={goal.id} className="border-2 hover:shadow-md transition-all">
                  <CardContent className="p-4 lg:p-6">
                    <div className="space-y-4">
                      {/* En-tête de l'objectif */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{getTypeIcon(goal.type)}</span>
                            <h4 className="font-semibold text-lg">{goal.title}</h4>
                          </div>
                          {goal.description && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{goal.description}</p>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getStatusColor(goal.status)}>{goal.status}</Badge>
                          <Badge className={getPriorityColor(goal.priority)}>{goal.priority}</Badge>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => startEdit(goal)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteGoal(goal.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Progrès */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Progrès: {goal.progress}%</span>
                          {goal.targetValue && goal.currentValue !== undefined && (
                            <span>{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                          )}
                        </div>
                        <Progress value={goal.progress} className="h-3" />
                      </div>

                      {/* Dates et informations */}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Échéance: {format(new Date(goal.targetDate), "dd/MM/yyyy", { locale: fr })}
                        </div>
                        {getDaysRemaining(goal.targetDate) >= 0 ? (
                          <div className="flex items-center gap-1 text-blue-600">
                            <TrendingUp className="w-3 h-3" />
                            {getDaysRemaining(goal.targetDate)} jours restants
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-600">
                            <Flag className="w-3 h-3" />
                            En retard de {Math.abs(getDaysRemaining(goal.targetDate))} jours
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {goal.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {goal.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Milestones */}
                      {goal.milestones.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-sm flex items-center gap-2">
                            <Trophy className="w-4 h-4" />
                            Étapes ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
                          </h5>
                          <div className="space-y-1">
                            {goal.milestones.map(milestone => (
                              <div key={milestone.id} className="flex items-center gap-2 text-sm">
                                <button onClick={() => toggleMilestone(goal.id, milestone.id)}>
                                  {milestone.completed ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-gray-400" />
                                  )}
                                </button>
                                <span className={milestone.completed ? 'line-through text-gray-500' : ''}>
                                  {milestone.title}
                                </span>
                                {milestone.targetDate && (
                                  <span className="text-xs text-gray-400 ml-auto">
                                    {format(new Date(milestone.targetDate), "dd/MM", { locale: fr })}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Import/Export */}
      <DataImportExport
        onExport={exportData}
        onImport={importData}
        onReset={resetData}
        isOnline={isOnline}
        isSyncing={isSyncing}
        lastSyncTime={lastSyncTime}
        toolName="Objectifs"
      />
    </div>
  );
};
