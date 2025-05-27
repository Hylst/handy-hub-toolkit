
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CheckSquare, 
  Timer, 
  BookOpen, 
  Target, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Star,
  Archive,
  Clock,
  Brain,
  Zap,
  TrendingUp,
  Calendar
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  category: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  timeSpent: number; // en minutes
}

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  category: "personal" | "work" | "idea" | "project";
}

interface PomodoroSession {
  id: string;
  type: "work" | "break" | "longBreak";
  duration: number;
  completedAt: Date;
  taskId?: string;
}

export const ProductivitySuite = () => {
  // États pour les tâches
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    category: "personnel",
    dueDate: ""
  });

  // États pour les notes
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    tags: "",
    category: "personal" as "personal" | "work" | "idea" | "project"
  });

  // États pour le Pomodoro
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes en secondes
  const [breakTime, setBreakTime] = useState(5 * 60); // 5 minutes
  const [longBreakTime, setLongBreakTime] = useState(15 * 60); // 15 minutes
  const [currentTime, setCurrentTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState<"work" | "break" | "longBreak">("work");
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);

  // États pour les objectifs
  const [goals, setGoals] = useState<Array<{
    id: string;
    title: string;
    description: string;
    target: number;
    current: number;
    unit: string;
    deadline: Date;
    category: string;
  }>>([]);

  // Timer Pomodoro
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && currentTime > 0) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev - 1);
      }, 1000);
    } else if (currentTime === 0) {
      // Session terminée
      handleSessionComplete();
    }
    
    return () => clearInterval(interval);
  }, [isRunning, currentTime]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    
    const session: PomodoroSession = {
      id: Date.now().toString(),
      type: currentSession,
      duration: currentSession === "work" ? pomodoroTime : 
                currentSession === "break" ? breakTime : longBreakTime,
      completedAt: new Date()
    };
    
    setSessions(prev => [...prev, session]);
    
    if (currentSession === "work") {
      setCompletedPomodoros(prev => prev + 1);
      // Passer à la pause
      if ((completedPomodoros + 1) % 4 === 0) {
        setCurrentSession("longBreak");
        setCurrentTime(longBreakTime);
      } else {
        setCurrentSession("break");
        setCurrentTime(breakTime);
      }
    } else {
      // Retour au travail
      setCurrentSession("work");
      setCurrentTime(pomodoroTime);
    }
  };

  const startPauseTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentSession("work");
    setCurrentTime(pomodoroTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      category: newTask.category,
      completed: false,
      createdAt: new Date(),
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
      timeSpent: 0
    };
    
    setTasks(prev => [...prev, task]);
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      category: "personnel",
      dueDate: ""
    });
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const addNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;
    
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: new Date(),
      updatedAt: new Date(),
      category: newNote.category
    };
    
    setNotes(prev => [...prev, note]);
    setNewNote({
      title: "",
      content: "",
      tags: "",
      category: "personal"
    });
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default: return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "work": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "project": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "idea": return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    const todaysSessions = sessions.filter(s => {
      const today = new Date();
      return s.completedAt.toDateString() === today.toDateString();
    });
    
    return {
      totalTasks,
      completedTasks,
      completionRate,
      todaysSessions: todaysSessions.length,
      totalNotes: notes.length
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-xl border-2 border-green-200 dark:border-green-800">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Suite de Productivité Complète
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Gérez vos tâches, prenez des notes, utilisez la technique Pomodoro et suivez vos objectifs.
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge variant="secondary">🎯 {stats.completedTasks}/{stats.totalTasks} tâches</Badge>
          <Badge variant="secondary">🍅 {stats.todaysSessions} sessions</Badge>
          <Badge variant="secondary">📝 {stats.totalNotes} notes</Badge>
          <Badge variant="secondary">📊 {Math.round(stats.completionRate)}% terminé</Badge>
        </div>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="tasks">
            <CheckSquare className="w-4 h-4 mr-2" />
            Tâches
          </TabsTrigger>
          <TabsTrigger value="pomodoro">
            <Timer className="w-4 h-4 mr-2" />
            Pomodoro
          </TabsTrigger>
          <TabsTrigger value="notes">
            <BookOpen className="w-4 h-4 mr-2" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="goals">
            <Target className="w-4 h-4 mr-2" />
            Objectifs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-green-600" />
                  Nouvelle Tâche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Input
                    placeholder="Titre de la tâche"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <Input
                    placeholder="Description (optionnel)"
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <Select 
                    value={newTask.priority} 
                    onValueChange={(value: "low" | "medium" | "high") => 
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
                  <Button onClick={addTask} disabled={!newTask.title.trim()}>
                    Ajouter
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mes Tâches ({tasks.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {tasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <CheckSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Aucune tâche créée</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div key={task.id} className={`p-4 rounded-lg border transition-all ${
                        task.completed 
                          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" 
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <button
                              onClick={() => toggleTask(task.id)}
                              className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center ${
                                task.completed
                                  ? "bg-green-500 border-green-500 text-white"
                                  : "border-gray-300 hover:border-green-400"
                              }`}
                            >
                              {task.completed && <CheckSquare className="w-3 h-3" />}
                            </button>
                            <div className="flex-1">
                              <h3 className={`font-medium ${
                                task.completed ? "line-through text-gray-500" : ""
                              }`}>
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {task.description}
                                </p>
                              )}
                              <div className="flex gap-2 mt-2">
                                <Badge className={getPriorityColor(task.priority)}>
                                  {task.priority}
                                </Badge>
                                <Badge variant="outline">{task.category}</Badge>
                                {task.dueDate && (
                                  <Badge variant="outline">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {task.dueDate.toLocaleDateString("fr-FR")}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteTask(task.id)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pomodoro">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-red-600" />
                  Minuteur Pomodoro
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="space-y-4">
                  <div className={`text-6xl font-mono font-bold ${
                    currentSession === "work" ? "text-red-600" : "text-green-600"
                  }`}>
                    {formatTime(currentTime)}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Badge className={currentSession === "work" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                      {currentSession === "work" ? "🎯 Travail" : 
                       currentSession === "break" ? "☕ Pause" : "🌟 Pause longue"}
                    </Badge>
                    <Badge variant="outline">
                      Session {completedPomodoros + 1}
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <Button onClick={startPauseTimer} size="lg">
                    {isRunning ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Démarrer
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetTimer} size="lg">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2">🍅 Pomodoros</h3>
                    <p className="text-2xl font-bold text-red-600">{completedPomodoros}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">aujourd'hui</p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">⏱️ Sessions</h3>
                    <p className="text-2xl font-bold text-blue-600">{sessions.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">au total</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">📈 Focus</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round((completedPomodoros * 25) / 60 * 10) / 10}h
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">temps de focus</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  Nouvelle Note
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Titre de la note"
                    value={newNote.title}
                    onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <Input
                    placeholder="Tags (séparés par des virgules)"
                    value={newNote.tags}
                    onChange={(e) => setNewNote(prev => ({ ...prev, tags: e.target.value }))}
                  />
                  <Select 
                    value={newNote.category} 
                    onValueChange={(value: any) => setNewNote(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">👤 Personnel</SelectItem>
                      <SelectItem value="work">💼 Travail</SelectItem>
                      <SelectItem value="idea">💡 Idée</SelectItem>
                      <SelectItem value="project">🚀 Projet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  placeholder="Contenu de la note..."
                  rows={4}
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                />
                <Button onClick={addNote} disabled={!newNote.title.trim() || !newNote.content.trim()}>
                  Créer la note
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mes Notes ({notes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {notes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Aucune note créée</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notes.map((note) => (
                      <div key={note.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg">{note.title}</h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteNote(note.id)}
                          >
                            ×
                          </Button>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                          {note.content}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          <Badge className={getCategoryColor(note.category)}>
                            {note.category}
                          </Badge>
                          {note.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {note.createdAt.toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Objectifs et Suivi
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <div className="text-gray-500 dark:text-gray-400">
                <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Fonctionnalité des objectifs à venir...</p>
                <p className="text-sm mt-2">Définissez et suivez vos objectifs personnels et professionnels</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
