
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Timer, BookOpen, Target, TrendingUp, Zap, Brain, CheckSquare2 } from "lucide-react";
import { TaskManagerEnhanced } from "./productivity/components/TaskManagerEnhanced";
import { PomodoroTimer } from "./productivity/components/PomodoroTimer";
import { NoteManager } from "./productivity/components/NoteManager";
import { GoalManagerEnhanced } from "./productivity/components/GoalManagerEnhanced";
import { TodoListEnhanced } from "./TodoListEnhanced";

export const ProductivitySuiteModular = () => {
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* En-tête responsive avec design moderne */}
      <div className="text-center space-y-4 p-4 lg:p-8 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/50 dark:via-teal-950/50 dark:to-cyan-950/50 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4 mb-4">
          <div className="flex justify-center">
            <div className="p-3 lg:p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg animate-pulse">
              <Brain className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Suite Productivité Complète
            </h1>
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 mt-2">
              Tous vos outils de productivité intégrés en un seul endroit
            </p>
          </div>
        </div>
        
        <p className="text-sm lg:text-lg text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
          Gérez vos tâches intelligemment avec la to-do list améliorée, prenez des notes organisées, 
          définissez des objectifs SMART et boostez votre concentration avec la technique Pomodoro. 
          Toutes vos données sont synchronisées et sauvegardées localement.
        </p>
        
        <div className="flex justify-center gap-2 lg:gap-3 flex-wrap">
          <Badge variant="secondary" className="text-xs lg:text-sm px-3 lg:px-4 py-2">
            <CheckSquare2 className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            To-do list avancée
          </Badge>
          <Badge variant="secondary" className="text-xs lg:text-sm px-3 lg:px-4 py-2">
            <CheckSquare className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            Gestion complète
          </Badge>
          <Badge variant="secondary" className="text-xs lg:text-sm px-3 lg:px-4 py-2">
            <Timer className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            Technique Pomodoro
          </Badge>
          <Badge variant="secondary" className="text-xs lg:text-sm px-3 lg:px-4 py-2">
            <BookOpen className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            Notes intelligentes
          </Badge>
          <Badge variant="secondary" className="text-xs lg:text-sm px-3 lg:px-4 py-2">
            <Target className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            Objectifs SMART
          </Badge>
          <Badge variant="secondary" className="text-xs lg:text-sm px-3 lg:px-4 py-2">
            <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            Statistiques
          </Badge>
          <Badge variant="secondary" className="text-xs lg:text-sm px-3 lg:px-4 py-2">
            <Zap className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            Sauvegarde locale
          </Badge>
        </div>
      </div>

      {/* Navigation par onglets responsive */}
      <Tabs defaultValue="todo" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-4 lg:mb-8 h-auto">
          <TabsTrigger value="todo" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 lg:p-3">
            <CheckSquare2 className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm">To-Do List</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 lg:p-3">
            <CheckSquare className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Tâches Pro</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 lg:p-3">
            <Target className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Objectifs</span>
          </TabsTrigger>
          <TabsTrigger value="pomodoro" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 lg:p-3">
            <Timer className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Pomodoro</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 lg:p-3">
            <BookOpen className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Notes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todo">
          <TodoListEnhanced />
        </TabsContent>

        <TabsContent value="tasks">
          <TaskManagerEnhanced />
        </TabsContent>

        <TabsContent value="goals">
          <GoalManagerEnhanced />
        </TabsContent>

        <TabsContent value="pomodoro">
          <PomodoroTimer />
        </TabsContent>

        <TabsContent value="notes">
          <NoteManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
