
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { History } from "lucide-react";
import { CalculationHistoryEntry } from "../types";

interface CalculationHistoryProps {
  history: CalculationHistoryEntry[];
}

export const CalculationHistory = ({ history }: CalculationHistoryProps) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-6 lg:mt-8">
      <h3 className="font-bold text-lg lg:text-xl mb-4 flex items-center gap-2">
        <History className="w-5 h-5" />
        Historique des Calculs
      </h3>
      <div className="space-y-2 max-h-48 lg:max-h-64 overflow-y-auto">
        {history.map((entry) => (
          <div key={entry.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <Badge variant="outline" className="self-start">{entry.type}</Badge>
              <span className="font-mono text-xs sm:text-sm break-all">{entry.calculation}</span>
              <span className="text-gray-600 hidden sm:inline">→</span>
              <span className="font-semibold text-xs sm:text-sm">{entry.result}</span>
            </div>
            <span className="text-xs text-gray-500 self-end sm:self-auto">
              {format(entry.timestamp, "HH:mm", { locale: fr })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
