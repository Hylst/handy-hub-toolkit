
import { useState, useEffect } from "react";
import { Clock, CalendarDays, Calculator, History, Globe, Zap, Target } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ToolHeader } from "@/components/ui/tool-header";
import { ToolContainer } from "@/components/ui/tool-container";
import { ToolTabSystem } from "@/components/ui/tool-tab-system";
import { useDateCalculationsEnhanced } from "./dateCalculator/hooks/useDateCalculationsEnhanced";
import { DateDifferenceTab } from "./dateCalculator/components/DateDifferenceTab";
import { DateCalculationTabEnhancedV2 } from "./dateCalculator/components/DateCalculationTabEnhancedV2";
import { AgeCalculatorTabEnhanced } from "./dateCalculator/components/AgeCalculatorTabEnhanced";
import { EventPlannerTabEnhanced } from "./dateCalculator/components/EventPlannerTabEnhanced";
import { TimeZoneTab } from "./dateCalculator/components/TimeZoneTab";
import { CalculationHistoryTab } from "./dateCalculator/components/CalculationHistoryTab";

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
  
  // Hook pour les calculs avec historique amélioré
  const {
    calculationHistory,
    calculateDateDifference,
    calculateNewDate,
    calculateAge,
    clearHistory,
    deleteHistoryEntry,
    exportHistory,
    importHistory
  } = useDateCalculationsEnhanced();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dateCalculatorTabs = [
    {
      id: "difference",
      label: "Différence",
      icon: <CalendarDays className="w-4 h-4" />,
      badge: "Précis",
      content: (
        <DateDifferenceTab
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          calculateDateDifference={() => calculateDateDifference(startDate, endDate)}
        />
      )
    },
    {
      id: "calculation",
      label: "Calculs",
      icon: <Calculator className="w-4 h-4" />,
      badge: "Multi-ops",
      content: (
        <DateCalculationTabEnhancedV2
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
      )
    },
    {
      id: "age",
      label: "Âge",
      icon: <Clock className="w-4 h-4" />,
      badge: "Détaillé",
      content: (
        <AgeCalculatorTabEnhanced
          birthDate={birthDate}
          setBirthDate={setBirthDate}
          calculateAge={() => calculateAge(birthDate)}
        />
      )
    },
    {
      id: "history",
      label: "Historique",
      icon: <History className="w-4 h-4" />,
      badge: `${calculationHistory.length}`,
      content: (
        <CalculationHistoryTab
          history={calculationHistory}
          onClearHistory={clearHistory}
          onDeleteEntry={deleteHistoryEntry}
          onExportHistory={exportHistory}
          onImportHistory={importHistory}
        />
      )
    },
    {
      id: "planner",
      label: "Planning",
      icon: <Target className="w-4 h-4" />,
      badge: "Événements",
      content: <EventPlannerTabEnhanced />
    },
    {
      id: "timezone",
      label: "Fuseaux",
      icon: <Globe className="w-4 h-4" />,
      badge: "Mondial",
      content: <TimeZoneTab calculationHistory={calculationHistory} />
    }
  ];

  const headerBadges = [
    "Calculs multi-opérations",
    "Historique complet", 
    "Export/Import",
    "Synchronisation cloud",
    "Mode offline/online"
  ];

  return (
    <ToolContainer variant="wide" spacing="lg">
      <div className="space-y-6">
        <ToolHeader
          title="Suite Avancée Dates & Temps Pro"
          subtitle={`${format(currentTime, "HH:mm:ss", { locale: fr })} - ${format(currentTime, "EEEE dd MMMM yyyy", { locale: fr })}`}
          description="Calculez des différences temporelles, effectuez des opérations multiples, gérez votre historique complet et planifiez vos événements avec synchronisation cloud et mode offline."
          icon={<Clock className="w-8 h-8" />}
          badges={headerBadges}
          gradient="purple"
        />

        <ToolTabSystem
          tabs={dateCalculatorTabs}
          defaultTab="difference"
          orientation="horizontal"
          size="md"
          className="w-full"
          tabsListClassName="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
        />
      </div>
    </ToolContainer>
  );
};
