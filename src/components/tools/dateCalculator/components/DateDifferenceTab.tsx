
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock3, CalendarDays, Copy, Info, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DateResult } from "../types";

interface DateDifferenceTabProps {
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  calculateDateDifference: () => DateResult | string;
}

export const DateDifferenceTab = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  calculateDateDifference
}: DateDifferenceTabProps) => {
  const { toast } = useToast();
  const [includeTime, setIncludeTime] = useState(true);
  const [result, setResult] = useState<DateResult | string>("");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: "Le résultat a été copié dans le presse-papiers.",
    });
  };

  const handleCalculate = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner les deux dates.",
        variant: "destructive"
      });
      return;
    }
    
    const calculatedResult = calculateDateDifference();
    setResult(calculatedResult);
  };

  const formatDateForInput = (date: string) => {
    if (!date) return "";
    if (includeTime) {
      return date.includes("T") ? date : date + "T00:00";
    } else {
      return date.includes("T") ? date.split("T")[0] : date;
    }
  };

  return (
    <Card className="shadow-lg border-2">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/50 dark:to-blue-950/50">
        <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
          <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
          Calculateur de Différence de Dates
          <Info className="w-4 h-4 text-gray-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 lg:space-y-6 p-4 lg:p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox 
            id="include-time" 
            checked={includeTime}
            onCheckedChange={(checked) => setIncludeTime(!!checked)}
          />
          <label htmlFor="include-time" className="text-sm font-medium">
            Inclure l'heure dans le calcul
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="space-y-2 lg:space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Date de début</label>
            <Input
              type={includeTime ? "datetime-local" : "date"}
              value={formatDateForInput(startDate)}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-white dark:bg-gray-800 border-2 focus:border-purple-400 transition-colors"
            />
          </div>
          <div className="space-y-2 lg:space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Date de fin</label>
            <Input
              type={includeTime ? "datetime-local" : "date"}
              value={formatDateForInput(endDate)}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-white dark:bg-gray-800 border-2 focus:border-purple-400 transition-colors"
            />
          </div>
        </div>

        <Button 
          onClick={handleCalculate}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          disabled={!startDate || !endDate}
        >
          <Calculator className="w-4 h-4 mr-2" />
          Calculer la différence
        </Button>

        {result && typeof result === "object" && (
          <div className="p-4 lg:p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/40 dark:via-blue-900/40 dark:to-indigo-900/40 rounded-2xl border-2 border-purple-200 dark:border-purple-700 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
              <h3 className="font-bold text-lg lg:text-xl text-gray-800 dark:text-gray-100">Résultats Détaillés</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(`${result.detailed} (${result.exact} jours)`)}
                className="text-purple-600 hover:text-purple-700 self-start"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock3 className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold">Durée totale:</span>
                </div>
                <p className="text-sm lg:text-lg font-mono text-purple-700 dark:text-purple-300 bg-white dark:bg-gray-800 p-3 rounded-lg break-words">
                  {result.total}
                </p>
                
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">Format détaillé:</span>
                </div>
                <p className="text-sm lg:text-lg font-mono text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-800 p-3 rounded-lg">
                  {result.detailed}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
                  <div className="text-2xl lg:text-3xl font-bold text-green-600">{result.exact}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Jours exacts</div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                    <div className="font-bold text-indigo-600">{result.breakdown.years}</div>
                    <div className="text-gray-600 text-xs">Années</div>
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                    <div className="font-bold text-indigo-600">{result.breakdown.months}</div>
                    <div className="text-gray-600 text-xs">Mois</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
