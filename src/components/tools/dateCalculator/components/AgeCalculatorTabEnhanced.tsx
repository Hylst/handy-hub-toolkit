
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Timer, CalendarDays, Target, CheckCircle, Copy, Calculator } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { AgeResult } from "../types";

interface AgeCalculatorTabEnhancedProps {
  birthDate: string;
  setBirthDate: (date: string) => void;
  calculateAge: () => AgeResult | string;
}

export const AgeCalculatorTabEnhanced = ({
  birthDate,
  setBirthDate,
  calculateAge
}: AgeCalculatorTabEnhancedProps) => {
  const { toast } = useToast();
  const [result, setResult] = useState<AgeResult | string>("");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: "Le résultat a été copié dans le presse-papiers.",
    });
  };

  const handleCalculate = () => {
    if (!birthDate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner votre date de naissance.",
        variant: "destructive"
      });
      return;
    }
    
    const calculatedResult = calculateAge();
    setResult(calculatedResult);
  };

  return (
    <Card className="shadow-lg border-2">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50">
        <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
          <Timer className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
          Calculateur d'Âge Précis & Avancé
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 lg:space-y-6 p-4 lg:p-6">
        <div className="space-y-3">
          <label className="text-sm font-semibold">Date de naissance</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal border-2 hover:border-orange-400"
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                <span className="truncate">
                  {birthDate ? format(new Date(birthDate), "dd MMMM yyyy", { locale: fr }) : "Sélectionnez votre date de naissance"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-2" align="start">
              <CalendarComponent
                mode="single"
                selected={birthDate ? new Date(birthDate) : undefined}
                onSelect={(date) => {
                  if (date) {
                    setBirthDate(format(date, "yyyy-MM-dd"));
                  }
                }}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button 
          onClick={handleCalculate}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          disabled={!birthDate}
        >
          <Calculator className="w-4 h-4 mr-2" />
          Calculer mon âge
        </Button>

        {result && typeof result === "object" && (
          <div className="space-y-4 lg:space-y-6">
            <div className="p-4 lg:p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/40 dark:to-amber-900/40 rounded-2xl border-2 border-orange-200 dark:border-orange-700 shadow-inner">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                <h3 className="font-bold text-lg lg:text-xl text-gray-800 dark:text-gray-100">Votre Âge Détaillé</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(typeof result === "object" ? result.primary : "")}
                  className="text-orange-600 hover:text-orange-700 self-start"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl lg:text-3xl font-bold text-orange-700 dark:text-orange-300 mb-2">
                    {result.primary}
                  </p>
                  <p className="text-sm lg:text-lg text-gray-600 dark:text-gray-400 break-words">
                    {result.details}
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Prochain anniversaire
                  </h4>
                  <p className="text-orange-600 dark:text-orange-400 text-sm lg:text-base">{result.nextBirthday}</p>
                </div>
                
                {result.milestones.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Jalons atteints
                    </h4>
                    <div className="space-y-2">
                      {result.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <span>{milestone}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
