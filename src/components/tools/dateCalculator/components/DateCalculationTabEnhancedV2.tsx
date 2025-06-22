
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calculator, Plus, Minus, Copy, Trash2, CalendarPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DateOperation {
  id: string;
  operation: "add" | "subtract";
  amount: string;
  unit: string;
}

interface DateCalculationTabEnhancedV2Props {
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

export const DateCalculationTabEnhancedV2 = ({
  baseDate,
  setBaseDate,
  operation,
  setOperation,
  amount,
  setAmount,
  unit,
  setUnit,
  calculateNewDate
}: DateCalculationTabEnhancedV2Props) => {
  const { toast } = useToast();
  const [includeTime, setIncludeTime] = useState(true);
  const [operations, setOperations] = useState<DateOperation[]>([]);
  const [result, setResult] = useState<string>("");
  const [intermediateResults, setIntermediateResults] = useState<string[]>([]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: "Le résultat a été copié dans le presse-papiers.",
    });
  };

  const addOperation = () => {
    const newOperation: DateOperation = {
      id: Date.now().toString(),
      operation: "add",
      amount: "1",
      unit: "days"
    };
    setOperations([...operations, newOperation]);
  };

  const updateOperation = (id: string, field: keyof DateOperation, value: string) => {
    setOperations(operations.map(op => 
      op.id === id ? { ...op, [field]: value } : op
    ));
  };

  const removeOperation = (id: string) => {
    setOperations(operations.filter(op => op.id !== id));
  };

  const calculateComplexDate = () => {
    if (!baseDate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une date de base.",
        variant: "destructive"
      });
      return;
    }

    try {
      let currentDate = new Date(baseDate);
      const results: string[] = [];
      
      // Appliquer l'opération principale
      if (amount && operation) {
        const num = parseInt(amount);
        if (!isNaN(num)) {
          const multiplier = operation === "add" ? 1 : -1;
          
          switch (unit) {
            case "days":
              currentDate.setDate(currentDate.getDate() + (num * multiplier));
              break;
            case "weeks":
              currentDate.setDate(currentDate.getDate() + (num * 7 * multiplier));
              break;
            case "months":
              currentDate.setMonth(currentDate.getMonth() + (num * multiplier));
              break;
            case "years":
              currentDate.setFullYear(currentDate.getFullYear() + (num * multiplier));
              break;
            case "hours":
              currentDate.setHours(currentDate.getHours() + (num * multiplier));
              break;
          }
          
          const mainResult = formatDateResult(currentDate, unit === "hours");
          results.push(`Après ${operation === "add" ? "+" : "-"}${amount} ${unit}: ${mainResult}`);
        }
      }

      // Appliquer les opérations supplémentaires
      operations.forEach((op, index) => {
        const num = parseInt(op.amount);
        if (!isNaN(num)) {
          const multiplier = op.operation === "add" ? 1 : -1;
          
          switch (op.unit) {
            case "days":
              currentDate.setDate(currentDate.getDate() + (num * multiplier));
              break;
            case "weeks":
              currentDate.setDate(currentDate.getDate() + (num * 7 * multiplier));
              break;
            case "months":
              currentDate.setMonth(currentDate.getMonth() + (num * multiplier));
              break;
            case "years":
              currentDate.setFullYear(currentDate.getFullYear() + (num * multiplier));
              break;
            case "hours":
              currentDate.setHours(currentDate.getHours() + (num * multiplier));
              break;
          }
          
          const stepResult = formatDateResult(currentDate, op.unit === "hours");
          results.push(`Puis ${op.operation === "add" ? "+" : "-"}${op.amount} ${op.unit}: ${stepResult}`);
        }
      });

      const finalResult = formatDateResult(currentDate, includeTime);
      setResult(finalResult);
      setIntermediateResults(results);

    } catch (error) {
      toast({
        title: "Erreur de calcul",
        description: "Impossible de calculer la nouvelle date.",
        variant: "destructive"
      });
    }
  };

  const formatDateResult = (date: Date, withTime: boolean = false) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    if (withTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return date.toLocaleDateString('fr-FR', options);
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
          Calculateur de Dates Multi-Opérations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 lg:space-y-6 p-4 lg:p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox 
            id="include-time-calc-v2" 
            checked={includeTime}
            onCheckedChange={(checked) => setIncludeTime(!!checked)}
          />
          <Label htmlFor="include-time-calc-v2" className="text-sm font-medium">
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

          {/* Opération principale */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-700">
            <h4 className="font-semibold mb-3 text-green-800 dark:text-green-200">Opération principale</h4>
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
          </div>

          {/* Opérations supplémentaires */}
          {operations.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Opérations supplémentaires</h4>
              {operations.map((op, index) => (
                <div key={op.id} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-sm text-blue-700 dark:text-blue-300">
                      Opération {index + 2}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOperation(op.id)}
                      className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select 
                      value={op.operation} 
                      onValueChange={(value: "add" | "subtract") => updateOperation(op.id, "operation", value)}
                    >
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

                    <Input
                      type="number"
                      value={op.amount}
                      onChange={(e) => updateOperation(op.id, "amount", e.target.value)}
                      placeholder="Quantité"
                      className="border-2"
                      min="1"
                    />

                    <Select 
                      value={op.unit} 
                      onValueChange={(value) => updateOperation(op.id, "unit", value)}
                    >
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
              ))}
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={addOperation}
              className="text-blue-600 hover:text-blue-700"
            >
              <CalendarPlus className="w-4 h-4 mr-2" />
              Ajouter une opération
            </Button>

            <Button 
              onClick={calculateComplexDate}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!baseDate}
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calculer le résultat final
            </Button>
          </div>

          {/* Résultats */}
          {result && (
            <div className="p-4 lg:p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/40 rounded-2xl border-2 border-green-200 dark:border-green-700 shadow-inner">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                <h3 className="font-bold text-lg lg:text-xl text-gray-800 dark:text-gray-100">Résultat Final</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(result)}
                  className="text-green-600 hover:text-green-700 self-start"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl">
                  <p className="text-lg lg:text-xl font-mono text-green-700 dark:text-green-300">
                    {result}
                  </p>
                </div>

                {intermediateResults.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Étapes de calcul :</h4>
                    <div className="space-y-2">
                      {intermediateResults.map((step, index) => (
                        <div key={index} className="text-sm p-2 bg-white dark:bg-gray-800 rounded border-l-4 border-green-400">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
