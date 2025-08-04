
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Edit, Save, X, Calendar, Clock, Star, Filter, CheckSquare2, Target } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Todo {
  id: number;
  text: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: Date;
  createdAt: Date;
  completedAt?: Date;
}

interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'personal', name: 'Personnel', color: 'bg-blue-100 text-blue-800', icon: '👤' },
  { id: 'work', name: 'Travail', color: 'bg-green-100 text-green-800', icon: '💼' },
  { id: 'shopping', name: 'Courses', color: 'bg-purple-100 text-purple-800', icon: '🛒' },
  { id: 'health', name: 'Santé', color: 'bg-red-100 text-red-800', icon: '❤️' },
  { id: 'learning', name: 'Apprentissage', color: 'bg-yellow-100 text-yellow-800', icon: '📚' },
  { id: 'finance', name: 'Finance', color: 'bg-emerald-100 text-emerald-800', icon: '💰' },
  { id: 'family', name: 'Famille', color: 'bg-pink-100 text-pink-800', icon: '👨‍👩‍👧‍👦' },
  { id: 'travel', name: 'Voyage', color: 'bg-cyan-100 text-cyan-800', icon: '✈️' },
  { id: 'fitness', name: 'Sport', color: 'bg-orange-100 text-orange-800', icon: '💪' },
  { id: 'hobby', name: 'Loisirs', color: 'bg-indigo-100 text-indigo-800', icon: '🎨' },
  { id: 'home', name: 'Maison', color: 'bg-amber-100 text-amber-800', icon: '🏠' },
  { id: 'social', name: 'Social', color: 'bg-teal-100 text-teal-800', icon: '👥' },
  { id: 'tech', name: 'Technologie', color: 'bg-slate-100 text-slate-800', icon: '💻' },
  { id: 'creative', name: 'Créatif', color: 'bg-violet-100 text-violet-800', icon: '🎭' },
  { id: 'urgent', name: 'Urgent', color: 'bg-red-200 text-red-900', icon: '🚨' },
];

export const TodoListEnhanced = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [inputValue, setInputValue] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newCategory, setNewCategory] = useState('personal');
  const [newDueDate, setNewDueDate] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem('enhanced-todos');
    const savedCategories = localStorage.getItem('enhanced-categories');
    
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
      }));
      setTodos(parsedTodos);
    }
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Sauvegarder dans localStorage
  useEffect(() => {
    localStorage.setItem('enhanced-todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('enhanced-categories', JSON.stringify(categories));
  }, [categories]);

  const addTodo = () => {
    if (inputValue.trim() !== "") {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue,
        description: newDescription || undefined,
        completed: false,
        priority: newPriority,
        category: newCategory,
        dueDate: newDueDate ? new Date(newDueDate) : undefined,
        createdAt: new Date(),
      };
      
      setTodos([...todos, newTodo]);
      setInputValue("");
      setNewDescription("");
      setNewDueDate("");
      
      toast({
        title: "Tâche ajoutée !",
        description: `"${inputValue}" a été ajoutée à votre liste.`,
      });
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { 
        ...todo, 
        completed: !todo.completed,
        completedAt: !todo.completed ? new Date() : undefined
      } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    const todoToDelete = todos.find(t => t.id === id);
    setTodos(todos.filter(todo => todo.id !== id));
    
    if (todoToDelete) {
      toast({
        title: "Tâche supprimée",
        description: `"${todoToDelete.text}" a été supprimée.`,
        variant: "destructive",
      });
    }
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editText.trim() !== "") {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editText } : todo
      ));
      setEditingId(null);
      setEditText("");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  const filteredTodos = todos.filter(todo => {
    const statusMatch = filter === 'all' || 
      (filter === 'active' && !todo.completed) || 
      (filter === 'completed' && todo.completed);
    
    const categoryMatch = categoryFilter === 'all' || todo.category === categoryFilter;
    const priorityMatch = priorityFilter === 'all' || todo.priority === priorityFilter;
    
    return statusMatch && categoryMatch && priorityMatch;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
    overdue: todos.filter(t => !t.completed && t.dueDate && t.dueDate < new Date()).length,
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* En-tête avec statistiques */}
      <Card className="shadow-lg border-2 border-blue-200 dark:border-blue-800">
        <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                <CheckSquare2 className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-200">
                  Gestionnaire de Tâches Avancé
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Organisez efficacement vos tâches avec priorités et catégories
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                <Target className="w-3 h-3 mr-1" />
                {stats.total} total
              </Badge>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                ✅ {stats.completed} terminées
              </Badge>
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200">
                ⏳ {stats.active} actives
              </Badge>
              {stats.overdue > 0 && (
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200">
                  ⚠️ {stats.overdue} en retard
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <CheckSquare2 className="w-4 h-4" />
            <span className="hidden sm:inline">Liste des tâches</span>
            <span className="sm:hidden">Liste</span>
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Ajouter une tâche</span>
            <span className="sm:hidden">Ajouter</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Statistiques</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Ajouter une nouvelle tâche
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Titre de la tâche *</label>
                <Input
                  placeholder="Que devez-vous faire ?"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTodo()}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (optionnel)</label>
                <Textarea
                  placeholder="Ajoutez des détails..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priorité</label>
                  <Select value={newPriority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewPriority(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">🔴 Haute</SelectItem>
                      <SelectItem value="medium">🟡 Moyenne</SelectItem>
                      <SelectItem value="low">🟢 Basse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Catégorie</label>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <span className="flex items-center gap-2">
                            <span>{category.icon}</span>
                            {category.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date d'échéance</label>
                  <Input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                  />
                </div>
              </div>
              
              <Button onClick={addTodo} className="w-full" size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter la tâche
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {/* Filtres */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Filtres:</span>
                </div>
                
                <Select value={filter} onValueChange={(value: 'all' | 'active' | 'completed') => setFilter(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="active">Actives</SelectItem>
                    <SelectItem value="completed">Terminées</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes catégories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <span className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          {category.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes priorités</SelectItem>
                    <SelectItem value="high">🔴 Haute</SelectItem>
                    <SelectItem value="medium">🟡 Moyenne</SelectItem>
                    <SelectItem value="low">🟢 Basse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          {/* Liste des tâches */}
          <Card>
            <CardContent className="pt-6">
              {filteredTodos.length === 0 ? (
                <div className="text-center py-12">
                  <CheckSquare2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {filter === 'all' ? 'Aucune tâche' : `Aucune tâche ${filter === 'active' ? 'active' : 'terminée'}`}
                  </h3>
                  <p className="text-gray-500">
                    {filter === 'all' ? 'Ajoutez votre première tâche !' : 'Changez les filtres pour voir d\'autres tâches.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTodos.map((todo) => {
                    const categoryInfo = getCategoryInfo(todo.category);
                    const isOverdue = todo.dueDate && !todo.completed && todo.dueDate < new Date();
                    
                    return (
                      <div
                        key={todo.id}
                        className={`p-4 border rounded-lg transition-all ${
                          todo.completed 
                            ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700" 
                            : isOverdue
                            ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                            : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => toggleTodo(todo.id)}
                            className="mt-1"
                          />
                          
                          <div className="flex-1 min-w-0">
                            {editingId === todo.id ? (
                              <div className="space-y-2">
                                <Input
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                                  className="font-medium"
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={saveEdit}>
                                    <Save className="w-3 h-3" />
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={cancelEdit}>
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <span
                                    className={`font-medium ${
                                      todo.completed ? "line-through text-gray-500" : "text-gray-800 dark:text-gray-200"
                                    }`}
                                    onDoubleClick={() => startEdit(todo)}
                                  >
                                    {todo.text}
                                  </span>
                                  
                                  <Badge className={getPriorityColor(todo.priority)}>
                                    {getPriorityIcon(todo.priority)} {todo.priority}
                                  </Badge>
                                  
                                  <Badge className={categoryInfo.color}>
                                    <span className="flex items-center gap-1">
                                      <span>{categoryInfo.icon}</span>
                                      {categoryInfo.name}
                                    </span>
                                  </Badge>
                                  
                                  {isOverdue && (
                                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200">
                                      ⚠️ En retard
                                    </Badge>
                                  )}
                                </div>
                                
                                {todo.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {todo.description}
                                  </p>
                                )}
                                
                                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Créée le {format(todo.createdAt, 'dd MMM yyyy', { locale: fr })}
                                  </span>
                                  
                                  {todo.dueDate && (
                                    <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : ''}`}>
                                      <Clock className="w-3 h-3" />
                                      Échéance: {format(todo.dueDate, 'dd MMM yyyy', { locale: fr })}
                                    </span>
                                  )}
                                  
                                  {todo.completedAt && (
                                    <span className="flex items-center gap-1 text-green-600">
                                      ✅ Terminée le {format(todo.completedAt, 'dd MMM yyyy', { locale: fr })}
                                    </span>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {editingId !== todo.id && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEdit(todo)}
                                className="text-gray-500 hover:text-blue-600"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteTodo(todo.id)}
                              className="text-gray-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Statistiques et Aperçu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Total des tâches</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                  <div className="text-sm text-green-700 dark:text-green-300">Tâches terminées</div>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.active}</div>
                  <div className="text-sm text-orange-700 dark:text-orange-300">Tâches actives</div>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                  <div className="text-sm text-red-700 dark:text-red-300">En retard</div>
                </div>
              </div>
              
              {stats.total > 0 && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <h4 className="font-medium mb-2">Taux de completion</h4>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {Math.round((stats.completed / stats.total) * 100)}% des tâches terminées
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
