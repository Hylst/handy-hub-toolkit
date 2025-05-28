
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DateCalculationTabProps {
  baseDate: string;
  setBaseDate: (date: string) => void;
  operation: "add" | "subtract";
  setOperation: (operation: "add" | "subtract") => void;
  amount: string;
  setAmount: (amount: string) => void;
  unit: string;
  setUnit: (unit: string) => void;
  calculateNewDate: () => string;
}

export const DateCalculationTab = ({
  baseDate,
  setBaseDate,
  operation,
  setOperation,
  amount,
  setAmount,
  unit,
  setUnit,
  calculateNewDate
}: DateCalculationTabProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: "Le résultat a été copié dans le presse-papiers.",
    });
  };

  const result = calculateNewDate();

  return (
    <Card className="shadow-lg border-2">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
        <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
          <Plus className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
          Ajout/Soustraction de Temps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 lg:space-y-6 p-4 lg:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Date de base</label>
            <Input
              type="datetime-local"
              value={baseDate}
              onChange={(e) => setBaseDate(e.target.value)}
              className="bg-white dark:bg-gray-800 border-2 focus:border-green-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Opération</label>
            <Select value={operation} onValueChange={(value: "add" | "subtract") => setOperation(value)}>
              <SelectTrigger className="bg-white dark:bg-gray-800 border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-green-600" />
                    Ajouter
                  </div>
                </SelectItem>
                <SelectItem value="subtract">
                  <div className="flex items-center gap-2">
                    <Minus className="w-4 h-4 text-red-600" />
                    Soustraire
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Quantité</label>
            <Input
              type="number"
              placeholder="Ex: 30"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-white dark:bg-gray-800 border-2 focus:border-green-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Unité</label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="bg-white dark:bg-gray-800 border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">⏰ Heures</SelectItem>
                <SelectItem value="days">📅 Jours</SelectItem>
                <SelectItem value="weeks">📆 Semaines</SelectItem>
                <SelectItem value="months">🗓️ Mois</SelectItem>
                <SelectItem value="years">📊 Années</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {baseDate && amount && result && (
          <div className="p-4 lg:p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/40 rounded-2xl border-2 border-green-200 dark:border-green-700 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
              <h3 className="font-bold text-lg lg:text-xl text-gray-800 dark:text-gray-100">Nouvelle Date</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(result)}
                className="text-green-600 hover:text-green-700 self-start"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-lg lg:text-2xl font-mono text-green-700 dark:text-green-300 bg-white dark:bg-gray-800 p-4 rounded-lg text-center break-words">
              {result}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
