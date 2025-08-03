
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarPlus, Copy, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDateCalculationsEnhanced } from "../hooks/useDateCalculationsEnhanced";

export const DateCalculationTabEnhancedV2 = () => {
  const { toast } = useToast();
  const { calculateNewDate } = useDateCalculationsEnhanced();
  const [baseDate, setBaseDate] = useState("");
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState<'days' | 'months' | 'years'>('days');
  const [result, setResult] = useState("");

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

    const amountNum = parseInt(amount);
    if (isNaN(amountNum)) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nombre valide.",
        variant: "destructive"
      });
      return;
    }

    const calculatedResult = calculateNewDate(baseDate, amount, unit, operation);
    setResult(calculatedResult);
  };

  return (
    <Card className="shadow-lg border-2">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
        <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
          <CalendarPlus className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
          Calculateur de Dates Avancé
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 lg:space-y-6 p-4 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Date de base</label>
            <Input
              type="date"
              value={baseDate}
              onChange={(e) => setBaseDate(e.target.value)}
              className="bg-white dark:bg-gray-800 border-2 focus:border-blue-400"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold">Opération</label>
            <Select value={operation} onValueChange={(value: 'add' | 'subtract') => setOperation(value)}>
              <SelectTrigger className="bg-white dark:bg-gray-800 border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Ajouter</SelectItem>
                <SelectItem value="subtract">Soustraire</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Quantité</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ex: 30"
              className="bg-white dark:bg-gray-800 border-2 focus:border-blue-400"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold">Unité</label>
            <Select value={unit} onValueChange={(value: 'days' | 'months' | 'years') => setUnit(value)}>
              <SelectTrigger className="bg-white dark:bg-gray-800 border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="days">Jours</SelectItem>
                <SelectItem value="months">Mois</SelectItem>
                <SelectItem value="years">Années</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={handleCalculate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={!baseDate || !amount}
        >
          <Calculator className="w-4 h-4 mr-2" />
          Calculer la nouvelle date
        </Button>

        {result && (
          <div className="p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-2xl border-2 border-blue-200 dark:border-blue-700 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
              <h3 className="font-bold text-lg lg:text-xl text-gray-800 dark:text-gray-100">Résultat</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(result)}
                className="text-blue-600 hover:text-blue-700 self-start"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-2xl lg:text-3xl font-bold text-blue-700 dark:text-blue-300">
                {result}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
