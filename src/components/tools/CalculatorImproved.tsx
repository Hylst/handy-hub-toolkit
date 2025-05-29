
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calculator, Zap, History } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BasicCalculator } from "./calculator/BasicCalculator";
import { ScientificCalculator } from "./calculator/ScientificCalculator";
import { HistoryPanel } from "./calculator/HistoryPanel";
import { useCalculatorState } from "./calculator/hooks/useCalculatorState";

export const CalculatorImproved = () => {
  const calculatorState = useCalculatorState();

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* En-tête avec documentation */}
        <div className="text-center space-y-4 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl border-2 border-blue-200 dark:border-blue-800">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-full">
              <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Calculatrices Professionnelles
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Effectuez vos calculs avec précision grâce à nos calculatrices avancées. 
            Support complet du clavier, fonctions scientifiques étendues et historique intelligent.
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">Saisie clavier</Badge>
            <Badge variant="secondary" className="text-xs">50+ fonctions</Badge>
            <Badge variant="secondary" className="text-xs">Mémoire</Badge>
            <Badge variant="secondary" className="text-xs">Historique</Badge>
            <Badge variant="secondary" className="text-xs">Copie/Coller</Badge>
          </div>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 h-auto p-1">
            <TabsTrigger 
              value="basic" 
              className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-300 flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm"
            >
              <Calculator className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Calculatrice</span>
              <span className="sm:hidden">Basic</span>
              <span className="hidden sm:inline">Basique</span>
            </TabsTrigger>
            <TabsTrigger 
              value="scientific" 
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900 dark:data-[state=active]:text-green-300 flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm"
            >
              <Zap className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Calculatrice</span>
              <span className="sm:hidden">Scientif.</span>
              <span className="hidden sm:inline">Scientifique</span>
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-300 flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm"
            >
              <History className="w-4 h-4 flex-shrink-0" />
              <span>Historique</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <Card className="max-w-md mx-auto shadow-lg border-2 border-gray-200 dark:border-gray-700">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 justify-center text-gray-800 dark:text-gray-200 text-lg sm:text-xl">
                  <Calculator className="w-5 h-5" />
                  <span className="hidden sm:inline">Calculatrice Basique</span>
                  <span className="sm:hidden">Basique</span>
                  <Badge variant="secondary" className="text-xs">Interface intuitive</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <BasicCalculator {...calculatorState} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="scientific">
            <Card className="max-w-5xl mx-auto shadow-lg border-2 border-gray-200 dark:border-gray-700">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 justify-center text-gray-800 dark:text-gray-200 text-lg sm:text-xl">
                  <Zap className="w-5 h-5" />
                  <span className="hidden sm:inline">Calculatrice Scientifique</span>
                  <span className="sm:hidden">Scientifique</span>
                  <Badge variant="secondary" className="text-xs">50+ fonctions</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <ScientificCalculator {...calculatorState} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="max-w-md mx-auto">
              <HistoryPanel {...calculatorState} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};
