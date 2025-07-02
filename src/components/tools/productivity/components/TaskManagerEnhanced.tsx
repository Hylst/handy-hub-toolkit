
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { CheckSquare, Plus, Search, Filter, Trash2, Edit, Calendar, Flag, Tag, Split, FileExport } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTaskManagerEnhanced, Task } from '../hooks/useTaskManagerEnhanced';
import { DataImportExport } from '../../common/DataImportExport';
import { ToolInfoModal } from './ToolInfoModal';

export const TaskManagerEnhanced = () => {
  const {
    tasks,
    categories,
    stats,
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

  // Analyser les mots-clés les plus fréquents
  const getKeywordFrequency = () => {
    const keywords: { [key: string]: number } = {};
    tasks.forEach(task => {
      task.tags.forEach(tag => {
        keywords[tag] = (keywords[tag] || 0) + 1;
      });
      // Analyser aussi les mots du titre
      task.title.toLowerCase().split(' ').forEach(word => {
        if (word.length > 3) {
          keywords[word] = (keywords[word] || 0) + 1;
        }
      });
    });
    return Object.entries(keywords)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
  };

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

  // Export vers format Google Tasks
  const exportToGoogleTasks = () => {
    const googleTasksFormat = tasks.map(task => ({
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
  };

  // Export vers format iCalendar
  const exportToICalendar = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Outils Pratiques//Gestionnaire de Tâches//FR',
      ...tasks.map(task => [
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

    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      tags: '',
      dueDate: ''
    });
    setShowAddForm(false);
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

    setEditingTask(null);
    setShowAddForm(false);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      default: return '🟢';
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <div className="p-3 lg:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <h3 className="font-semibold text-blue-700 dark:text-blue-300 text-sm lg:text-base">Total</h3>
              <p className="text-xl lg:text-2xl font-bold text-blue-600">{stats.totalTasks}</p>
            </div>
            <div className="p-3 lg:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <h3 className="font-semibold text-green-700 dark:text-green-300 text-sm lg:text-base">Terminées</h3>
              <p className="text-xl lg:text-2xl font-bold text-green-600">{stats.completedTasks}</p>
            </div>
            <div className="p-3 lg:p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
              <h3 className="font-semibold text-orange-700 dark:text-orange-300 text-sm lg:text-base">En cours</h3>
              <p className="text-xl lg:text-2xl font-bold text-orange-600">{stats.pendingTasks}</p>
            </div>
            <div className="p-3 lg:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
              <h3 className="font-semibold text-red-700 dark:text-red-300 text-sm lg:text-base">Urgentes</h3>
              <p className="text-xl lg:text-2xl font-bold text-red-600">{stats.highPriorityTasks}</p>
            </div>
          </div>

          <Separator />

          {/* Recherche et filtres avancés */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Input
              placeholder="Filtrer par mot-clé..."
              value={keywordFilter}
              onChange={(e) => setKeywordFilter(e.target.value)}
            />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
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
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="pending">En cours</SelectItem>
                <SelectItem value="completed">Terminées</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Options avancées */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={sortByKeywords ? "default" : "outline"}
              size="sm"
              onClick={() => setSortByKeywords(!sortByKeywords)}
            >
              <Tag className="w-4 h-4 mr-2" />
              Trier par mots-clés
            </Button>
            <Button variant="outline" size="sm" onClick={exportToGoogleTasks}>
              <FileExport className="w-4 h-4 mr-2" />
              Export Google Tasks
            </Button>
            <Button variant="outline" size="sm" onClick={exportToICalendar}>
              <Calendar className="w-4 h-4 mr-2" />
              Export iCalendar
            </Button>
          </div>

          {/* Mots-clés fréquents */}
          {getKeywordFrequency().length > 0 && (
            <Card className="bg-gray-50 dark:bg-gray-800/50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Mots-clés les plus fréquents</h4>
                <div className="flex flex-wrap gap-2">
                  {getKeywordFrequency().map(([keyword, count]) => (
                    <Badge
                      key={keyword}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => setKeywordFilter(keyword)}
                    >
                      {keyword} ({count})
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bouton d'ajout */}
          <Button 
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingTask(null);
              setNewTask({
                title: '',
                description: '',
                priority: 'medium',
                category: '',
                tags: '',
                dueDate: ''
              });
            }}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            {showAddForm ? 'Annuler' : 'Nouvelle tâche'}
          </Button>

          {/* Formulaire d'ajout/édition */}
          {showAddForm && (
            <Card className="border-2 border-emerald-200 dark:border-emerald-800">
              <CardContent className="p-4 space-y-4">
                <Input
                  placeholder="Titre de la tâche *"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
                <Textarea
                  placeholder="Description (optionnel) - Une ligne par sous-tâche pour découper"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({...newTask, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🟢 Basse</SelectItem>
                      <SelectItem value="medium">🟡 Moyenne</SelectItem>
                      <SelectItem value="high">🔴 Haute</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={newTask.category} onValueChange={(value) => setNewTask({...newTask, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
                <Input
                  placeholder="Tags (séparés par des virgules)"
                  value={newTask.tags}
                  onChange={(e) => setNewTask({...newTask, tags: e.target.value})}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={editingTask ? handleUpdateTask : handleAddTask}
                    disabled={!newTask.title.trim()}
                    className="flex-1"
                  >
                    {editingTask ? 'Mettre à jour' : 'Ajouter'} la tâche
                  </Button>
                  {editingTask && newTask.description && (
                    <Button
                      variant="outline"
                      onClick={() => splitTaskIntoSubtasks(editingTask)}
                    >
                      <Split className="w-4 h-4 mr-2" />
                      Découper
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Liste des tâches */}
          <div className="space-y-3">
            {sortedTasks.length === 0 ? (
              <div className="text-center py-8 lg:py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <CheckSquare className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-2">
                  {searchTerm || keywordFilter || filterCategory !== 'all' || filterPriority !== 'all' || filterStatus !== 'all'
                    ? 'Aucune tâche ne correspond aux filtres'
                    : 'Aucune tâche créée'
                  }
                </p>
                <p className="text-sm text-gray-500">
                  {searchTerm || keywordFilter || filterCategory !== 'all' || filterPriority !== 'all' || filterStatus !== 'all'
                    ? 'Modifiez vos critères de recherche'
                    : 'Commencez par ajouter votre première tâche'
                  }
                </p>
              </div>
            ) : (
              sortedTasks.map(task => (
                <Card key={task.id} className={`border-2 transition-all hover:shadow-md ${
                  task.completed ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 lg:gap-3 mb-2">
                          <h4 className={`font-semibold text-base lg:text-lg ${
                            task.completed ? 'line-through text-gray-500' : ''
                          }`}>
                            {task.title}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={getPriorityColor(task.priority)}>
                              {getPriorityIcon(task.priority)} {task.priority}
                            </Badge>
                            <Badge variant="outline">{task.category}</Badge>
                            {task.tags.includes('sous-tâche') && (
                              <Badge variant="secondary">Sous-tâche</Badge>
                            )}
                          </div>
                        </div>
                        
                        {task.description && (
                          <p className={`text-sm text-gray-600 dark:text-gray-400 mb-2 ${
                            task.completed ? 'line-through' : ''
                          }`}>
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(task.dueDate), "dd/MM/yyyy", { locale: fr })}
                            </div>
                          )}
                          {task.tags.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {task.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                                  {tag}
                                </Badge>
                              ))}
                              {task.tags.length > 2 && (
                                <span className="text-gray-400">+{task.tags.length - 2}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(task)}
                          className="text-gray-500 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTask(task.id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
        toolName="Tâches"
      />
    </div>
  );
};
