
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";
import { CalculationHistory } from "./CalculationHistory";

export const CalculationHistoryTab = () => {
  // For now, we'll use an empty history array since the component should be self-contained
  const calculationHistory: any[] = [];

  return (
    <Card className="shadow-lg border-2">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/50 dark:to-gray-950/50">
        <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
          <History className="w-5 h-5 lg:w-6 lg:h-6 text-slate-600" />
          Historique des Calculs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 lg:space-y-6 p-4 lg:p-6">
        <CalculationHistory history={calculationHistory} />
      </CardContent>
    </Card>
  );
};
