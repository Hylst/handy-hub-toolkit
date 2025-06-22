
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calculator, Plus, Minus, Calendar, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DateCalculationTabEnhancedProps {
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

export const DateCalculationTabEnhanced = ({
  baseDate,
  setBaseDate,
  operation,
  setOperation,
  amount,
  setAmount,
  unit,
  setUnit,
  calculateNewDate
}: DateCalculationTabEnhancedProps) => {
  const { toast } = useToast();
  const [includeTime, setIncludeTime] = useState(true);
  const [result, setResult] = useState<string>("");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: "Le résultat a été copié dans le presse-papiers.",
    });
  };

  const handleCalculate = () => {
    if (!baseDate || !amount) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive"
      });
      return;
    }
    
    const calculatedResult = calculateNewDate();
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
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
        <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
          <Calculator className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
          Calculateur de Dates Avancé
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 lg:space-y-6 p-4 lg:p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox 
            id="include-time-calc" 
            checked={includeTime}
            onCheckedChange={(checked) => setIncludeTime(!!checked)}
          />
          <Label htmlFor="include-time-calc" className="text-sm font-medium">
            Inclure l'heure dans le calcul
          </Label>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Date de base</Label>
            <Input
              type={includeTime ? "datetime-local" : "date"}
              value={formatDateForInput(baseDate)}
              onChange={(e) => setBaseDate(e.target.value)}
              className="bg-white dark:bg-gray-800 border-2 focus:border-green-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Opération</Label>
              <Select value={operation} onValueChange={(value: "add" | "subtract") => setOperation(value)}>
                <SelectTrigger className="border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Ajouter
                    </div>
                  </SelectItem>
                  <SelectItem value="subtract">
                    <div className="flex items-center gap-2">
                      <Minus className="w-4 h-4" />
                      Soustraire
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Quantité</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex: 30"
                className="border-2 focus:border-green-400"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Unité</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Jours</SelectItem>
                  <SelectItem value="weeks">Semaines</SelectItem>
                  <SelectItem value="months">Mois</SelectItem>
                  <SelectItem value="years">Années</SelectItem>
                  {includeTime && <SelectItem value="hours">Heures</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleCalculate}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={!baseDate || !amount}
          >
            <Calculator className="w-4 h-4 mr-2" />
            Calculer la nouvelle date
          </Button>

          {result && (
            <div className="p-4 lg:p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/40 rounded-2xl border-2 border-green-200 dark:border-green-700 shadow-inner">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                <h3 className="font-bold text-lg lg:text-xl text-gray-800 dark:text-gray-100">Résultat</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(result)}
                  className="text-green-600 hover:text-green-700 self-start"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="font-semibold">Nouvelle date:</span>
              </div>
              <p className="text-lg lg:text-xl font-mono text-green-700 dark:text-green-300 bg-white dark:bg-gray-800 p-4 rounded-lg">
                {result}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
