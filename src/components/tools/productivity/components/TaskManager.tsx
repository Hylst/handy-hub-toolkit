
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckSquare, Plus, Calendar, Trash2 } from "lucide-react";
import { useTaskManager, Task } from "../hooks/useTaskManager";

export const TaskManager = () => {
  const { tasks, addTask, toggleTask, deleteTask, stats } = useTaskManager();
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    category: "personnel",
    dueDate: ""
  });

  // Stats disponibles directement

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    
    addTask({
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      category: newTask.category,
      dueDate: newTask.dueDate || undefined,
      completed: false,
      tags: []
    });
    
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      category: "personnel",
      dueDate: ""
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200";
      default: return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200";
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Statistiques responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="p-3 lg:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <p className="text-lg lg:text-2xl font-bold text-blue-600">{stats.totalTasks}</p>
          <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Total</p>
        </div>
        <div className="p-3 lg:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <p className="text-lg lg:text-2xl font-bold text-green-600">{stats.completedTasks}</p>
          <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Terminées</p>
        </div>
        <div className="p-3 lg:p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
          <p className="text-lg lg:text-2xl font-bold text-orange-600">{stats.pendingTasks}</p>
          <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">En cours</p>
        </div>
        <div className="p-3 lg:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
          <p className="text-lg lg:text-2xl font-bold text-purple-600">{Math.round((stats.completedTasks / stats.totalTasks) * 100) || 0}%</p>
          <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Taux</p>
        </div>
      </div>

      {/* Formulaire de création responsive */}
      <Card>
        <CardHeader className="p-4 lg:p-6">
          <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
            <Plus className="w-5 h-5 text-green-600" />
            Nouvelle Tâche
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-4">
            <Input
              placeholder="Titre de la tâche"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              className="lg:col-span-2"
            />
            <Input
              placeholder="Description (optionnel)"
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
            />
            <Select 
              value={newTask.priority} 
              onValueChange={(value: Task["priority"]) => 
                setNewTask(prev => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">🟢 Faible</SelectItem>
                <SelectItem value="medium">🟡 Moyenne</SelectItem>
                <SelectItem value="high">🔴 Haute</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
            />
          </div>
          <Button 
            onClick={handleAddTask} 
            disabled={!newTask.title.trim()}
            className="w-full lg:w-auto mt-3 lg:mt-4"
          >
            Ajouter la tâche
          </Button>
        </CardContent>
      </Card>

      {/* Liste des tâches responsive */}
      <Card>
        <CardHeader className="p-4 lg:p-6">
          <CardTitle className="text-lg lg:text-xl">Mes Tâches ({tasks.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-4 lg:p-6">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <CheckSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Aucune tâche créée</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`p-3 lg:p-4 rounded-lg border transition-all ${
                    task.completed 
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" 
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          task.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300 hover:border-green-400"
                        }`}
                      >
                        {task.completed && <CheckSquare className="w-3 h-3" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium text-sm lg:text-base ${
                          task.completed ? "line-through text-gray-500" : ""
                        }`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {task.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 lg:gap-2 mt-2">
                          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">{task.category}</Badge>
                          {task.dueDate && (
                            <Badge variant="outline" className="text-xs">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(task.dueDate).toLocaleDateString("fr-FR")}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="w-full lg:w-auto"
                    >
                      <Trash2 className="w-4 h-4 lg:mr-2" />
                      <span className="lg:inline hidden">Supprimer</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
