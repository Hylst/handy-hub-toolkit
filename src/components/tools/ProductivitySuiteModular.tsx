
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Timer, BookOpen, Target, TrendingUp, Zap, Brain } from "lucide-react";
import { TaskManager } from "./productivity/components/TaskManager";
import { PomodoroTimer } from "./productivity/components/PomodoroTimer";
import { NoteManager } from "./productivity/components/NoteManager";

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
              Suite Productivité Avancée
            </h1>
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 mt-2">
              Maximisez votre efficacité avec nos outils intégrés
            </p>
          </div>
        </div>
        
        <p className="text-sm lg:text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
          Gérez vos tâches intelligemment, prenez des notes organisées, et boostez votre concentration avec la technique Pomodoro.
        </p>
        
        <div className="flex justify-center gap-2 lg:gap-3 flex-wrap">
          <Badge variant="secondary" className="text-xs lg:text-sm px-3 lg:px-4 py-2">
            <CheckSquare className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            Gestion de tâches
          </Badge>
          <Badge variant="secondary" className="text-xs lg:text-sm px-3 lg:px-4 py-2">
            <Timer className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            Technique Pomodoro
          </Badge>
          <Badge variant="secondary" className="text-xs lg:text-sm px-3 lg:px-4 py-2">
            <BookOpen className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            Prise de notes
          </Badge>
          <Badge variant="secondary" className="text-xs lg:text-sm px-3 lg:px-4 py-2">
            <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            Suivi des progrès
          </Badge>
        </div>
      </div>

      {/* Navigation par onglets responsive */}
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4 mb-4 lg:mb-8 h-auto">
          <TabsTrigger value="tasks" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 lg:p-3">
            <CheckSquare className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Tâches</span>
          </TabsTrigger>
          <TabsTrigger value="pomodoro" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 lg:p-3">
            <Timer className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Pomodoro</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 lg:p-3">
            <BookOpen className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Notes</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 lg:p-3 sm:col-span-3 lg:col-span-1">
            <Target className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Objectifs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <TaskManager />
        </TabsContent>

        <TabsContent value="pomodoro">
          <PomodoroTimer />
        </TabsContent>

        <TabsContent value="notes">
          <NoteManager />
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                <Target className="w-5 h-5 text-purple-600" />
                Objectifs et Suivi des Progrès
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 text-center py-8 lg:py-12">
              <div className="text-gray-500 dark:text-gray-400 space-y-4">
                <div className="p-6 lg:p-8 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 rounded-xl">
                  <Zap className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 text-purple-500 animate-pulse" />
                  <h3 className="text-lg lg:text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2">
                    Fonctionnalité Avancée en Développement
                  </h3>
                  <p className="text-sm lg:text-base">
                    Le module d'objectifs avancé arrive bientôt avec :
                  </p>
                  <div className="mt-4 space-y-2 text-left max-w-md mx-auto">
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="w-4 h-4 text-purple-500" />
                      <span>Définition d'objectifs SMART</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-purple-500" />
                      <span>Suivi des progrès en temps réel</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckSquare className="w-4 h-4 text-purple-500" />
                      <span>Jalons et récompenses</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
