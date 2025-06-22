
import { useState, useEffect } from "react";
import { Clock, CalendarDays, Calculator, History, Globe, Zap, Target } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ToolHeader } from "@/components/ui/tool-header";
import { ToolContainer } from "@/components/ui/tool-container";
import { ToolTabSystem } from "@/components/ui/tool-tab-system";
import { useDateCalculations } from "./dateCalculator/hooks/useDateCalculations";
import { DateDifferenceTab } from "./dateCalculator/components/DateDifferenceTab";
import { DateCalculationTab } from "./dateCalculator/components/DateCalculationTab";
import { AgeCalculatorTab } from "./dateCalculator/components/AgeCalculatorTab";
import { EventPlannerTabEnhanced } from "./dateCalculator/components/EventPlannerTabEnhanced";
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
      badge: "±",
      content: (
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
      )
    },
    {
      id: "age",
      label: "Âge",
      icon: <Clock className="w-4 h-4" />,
      badge: "Détaillé",
      content: (
        <AgeCalculatorTab
          birthDate={birthDate}
          setBirthDate={setBirthDate}
          calculateAge={() => calculateAge(birthDate)}
        />
      )
    },
    {
      id: "planner",
      label: "Planning",
      icon: <History className="w-4 h-4" />,
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
    "Calculs précis",
    "Fuseaux horaires", 
    "Planning avancé",
    "Sync hors ligne"
  ];

  return (
    <ToolContainer variant="wide" spacing="lg">
      <div className="space-y-6">
        <ToolHeader
          title="Suite Avancée Dates & Temps"
          subtitle={`${format(currentTime, "HH:mm:ss", { locale: fr })} - ${format(currentTime, "EEEE dd MMMM yyyy", { locale: fr })}`}
          description="Calculez des différences temporelles, planifiez vos événements, gérez les fuseaux horaires et bien plus encore avec notre suite d'outils professionnels. Données synchronisées hors ligne avec import/export."
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
          tabsListClassName="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
        />
      </div>
    </ToolContainer>
  );
};
