
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CalendarDays, Calculator, History, Globe, Zap, Target } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useDateCalculations } from "./dateCalculator/hooks/useDateCalculations";
import { DateDifferenceTab } from "./dateCalculator/components/DateDifferenceTab";
import { DateCalculationTab } from "./dateCalculator/components/DateCalculationTab";
import { AgeCalculatorTab } from "./dateCalculator/components/AgeCalculatorTab";
import { EventPlannerTab } from "./dateCalculator/components/EventPlannerTab";
import { TimeZoneTab } from "./dateCalculator/components/TimeZoneTab";

export const DateCalculatorAdvanced = () => {
  // États pour différents calculs
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [baseDate, setBaseDate] = useState("");
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("days");
  const [birthDate, setBirthDate] = useState("");
  
  // Horloge temps réel
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Hook pour les calculs
  const {
    calculationHistory,
    calculateDateDifference,
    calculateNewDate,
    calculateAge
  } = useDateCalculations();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4 lg:space-y-6 max-w-7xl mx-auto p-4 lg:p-6">
      {/* En-tête responsive avec horloge temps réel */}
      <div className="text-center space-y-4 lg:space-y-6 p-6 lg:p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/50 dark:via-purple-950/50 dark:to-pink-950/50 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4 mb-4">
          <Clock className="w-10 h-10 lg:w-12 lg:h-12 text-indigo-600 animate-pulse mx-auto sm:mx-0" />
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Suite Avancée Dates & Temps
            </h1>
            <div className="text-xl lg:text-2xl font-mono text-gray-700 dark:text-gray-300 mt-2">
              {format(currentTime, "HH:mm:ss", { locale: fr })}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {format(currentTime, "EEEE dd MMMM yyyy", { locale: fr })}
            </div>
          </div>
        </div>
        
        <p className="text-base lg:text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
          Calculez des différences temporelles, planifiez vos événements, gérez les fuseaux horaires et bien plus encore avec notre suite d'outils professionnels.
        </p>
        
        <div className="flex justify-center gap-2 lg:gap-3 flex-wrap">
          <Badge variant="secondary" className="text-xs lg:text-sm px-3 lg:px-4 py-2">
            <Zap className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            Calculs précis
          </Badge>
          <Badge variant="secondary" className="text-xs lg:text-sm px-3 lg:px-4 py-2">
            <Globe className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            Fuseaux horaires
          </Badge>
          <Badge variant="secondary" className="text-xs lg:text-sm px-3 lg:px-4 py-2">
            <Target className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            Planning avancé
          </Badge>
          <Badge variant="secondary" className="text-xs lg:text-sm px-3 lg:px-4 py-2">
            <History className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            Historique
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="difference" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-6 lg:mb-8 h-auto">
          <TabsTrigger value="difference" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 lg:p-3">
            <CalendarDays className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Différence</span>
          </TabsTrigger>
          <TabsTrigger value="calculation" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 lg:p-3">
            <Calculator className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Calculs</span>
          </TabsTrigger>
          <TabsTrigger value="age" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 lg:p-3">
            <Clock className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Âge</span>
          </TabsTrigger>
          <TabsTrigger value="planner" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 lg:p-3">
            <History className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Planning</span>
          </TabsTrigger>
          <TabsTrigger value="timezone" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 lg:p-3 sm:col-span-3 lg:col-span-1">
            <Globe className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Fuseaux</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="difference">
          <DateDifferenceTab
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            calculateDateDifference={() => calculateDateDifference(startDate, endDate)}
          />
        </TabsContent>

        <TabsContent value="calculation">
          <DateCalculationTab
            baseDate={baseDate}
            setBaseDate={setBaseDate}
            operation={operation}
            setOperation={setOperation}
            amount={amount}
            setAmount={setAmount}
            unit={unit}
            setUnit={setUnit}
            calculateNewDate={() => calculateNewDate(baseDate, amount, unit, operation)}
          />
        </TabsContent>

        <TabsContent value="age">
          <AgeCalculatorTab
            birthDate={birthDate}
            setBirthDate={setBirthDate}
            calculateAge={() => calculateAge(birthDate)}
          />
        </TabsContent>

        <TabsContent value="planner">
          <EventPlannerTab />
        </TabsContent>

        <TabsContent value="timezone">
          <TimeZoneTab calculationHistory={calculationHistory} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
