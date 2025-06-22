
import { useCallback, useState } from "react";
import { format, addDays, subDays, differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, differenceInYears } from "date-fns";
import { fr } from "date-fns/locale";
import { DateResult, AgeResult, CalculationHistoryEntry } from "../types";
import { useToast } from "@/hooks/use-toast";

export const useDateCalculationsEnhanced = () => {
  const [calculationHistory, setCalculationHistory] = useState<CalculationHistoryEntry[]>([]);
  const { toast } = useToast();

  const addToHistory = useCallback((type: string, calculation: string, result: string) => {
    const newEntry: CalculationHistoryEntry = {
      id: Date.now().toString(),
      type,
      calculation,
      result,
      timestamp: new Date()
    };
    setCalculationHistory(prev => [newEntry, ...prev.slice(0, 49)]); // Garder les 50 dernières entrées
  }, []);

  const clearHistory = useCallback(() => {
    setCalculationHistory([]);
    toast({
      title: "Historique effacé",
      description: "L'historique des calculs a été supprimé avec succès.",
    });
  }, [toast]);

  const deleteHistoryEntry = useCallback((id: string) => {
    setCalculationHistory(prev => prev.filter(entry => entry.id !== id));
    toast({
      title: "Entrée supprimée",
      description: "L'entrée a été supprimée de l'historique.",
    });
  }, [toast]);

  const exportHistory = useCallback(() => {
    try {
      const dataStr = JSON.stringify({
        exportDate: new Date().toISOString(),
        history: calculationHistory
      }, null, 2);
      
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `historique-calculs-dates-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export réussi",
        description: "L'historique a été exporté avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter l'historique.",
        variant: "destructive",
      });
    }
  }, [calculationHistory, toast]);

  const importHistory = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const imported = JSON.parse(result);
        
        if (imported.history && Array.isArray(imported.history)) {
          const validEntries = imported.history.filter((entry: any) => 
            entry.id && entry.type && entry.calculation && entry.result && entry.timestamp
          ).map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp)
          }));
          
          setCalculationHistory(prev => [...validEntries, ...prev].slice(0, 100));
          
          toast({
            title: "Import réussi",
            description: `${validEntries.length} entrées ont été importées.`,
          });
        } else {
          throw new Error("Format invalide");
        }
      } catch (error) {
        toast({
          title: "Erreur d'import",
          description: "Le fichier n'est pas au bon format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  }, [toast]);

  const calculateDateDifference = useCallback((startDate: string, endDate: string): DateResult | string => {
    if (!startDate || !endDate) return "";
    
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return "Dates invalides";
      
      const years = differenceInYears(end, start);
      const months = differenceInMonths(end, start) % 12;
      const days = differenceInDays(end, start) % 30;
      const hours = differenceInHours(end, start);
      const minutes = differenceInMinutes(end, start);
      const exactDays = Math.abs(differenceInDays(end, start));
      
      const result: DateResult = {
        total: `${exactDays} jours, ${hours} heures, ${minutes} minutes`,
        detailed: `${years} an(s), ${months} mois, ${days} jour(s)`,
        exact: exactDays,
        breakdown: { years, months, days, hours, minutes }
      };
      
      setTimeout(() => {
        addToHistory("Différence", `${format(start, "dd/MM/yyyy", { locale: fr })} → ${format(end, "dd/MM/yyyy", { locale: fr })}`, `${exactDays} jours`);
      }, 0);
      
      return result;
    } catch (error) {
      console.error("Erreur lors du calcul de différence:", error);
      return "Erreur de calcul";
    }
  }, [addToHistory]);

  const calculateNewDate = useCallback((baseDate: string, amount: string, unit: string, operation: "add" | "subtract") => {
    if (!baseDate || !amount) return "";
    
    try {
      const base = new Date(baseDate);
      if (isNaN(base.getTime())) return "Date invalide";
      
      const num = parseInt(amount);
      if (isNaN(num)) return "Montant invalide";
      
      let result = new Date(base);
      const multiplier = operation === "add" ? 1 : -1;
      
      switch (unit) {
        case "days":
          result = operation === "add" ? addDays(base, num) : subDays(base, num);
          break;
        case "weeks":
          result = operation === "add" ? addDays(base, num * 7) : subDays(base, num * 7);
          break;
        case "months":
          result.setMonth(result.getMonth() + (num * multiplier));
          break;
        case "years":
          result.setFullYear(result.getFullYear() + (num * multiplier));
          break;
        case "hours":
          result.setHours(result.getHours() + (num * multiplier));
          break;
      }
      
      const formattedResult = format(result, "EEEE dd MMMM yyyy", { locale: fr }) + 
        (unit === "hours" ? ` à ${format(result, "HH:mm")}` : "");
      
      setTimeout(() => {
        addToHistory("Calcul", `${format(base, "dd/MM/yyyy", { locale: fr })} ${operation === "add" ? "+" : "-"} ${num} ${unit}`, formattedResult);
      }, 0);
      
      return formattedResult;
    } catch (error) {
      console.error("Erreur lors du calcul de nouvelle date:", error);
      return "Erreur de calcul";
    }
  }, [addToHistory]);

  const calculateAge = useCallback((birthDate: string): AgeResult | string => {
    if (!birthDate) return "";
    
    try {
      const birth = new Date(birthDate);
      const now = new Date();
      
      if (isNaN(birth.getTime()) || birth > now) return "Date invalide";
      
      const years = differenceInYears(now, birth);
      const months = differenceInMonths(now, birth) % 12;
      const days = differenceInDays(now, birth) % 30;
      const totalDays = differenceInDays(now, birth);
      const totalWeeks = Math.floor(totalDays / 7);
      const totalHours = differenceInHours(now, birth);
      
      const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
      if (nextBirthday < now) {
        nextBirthday.setFullYear(now.getFullYear() + 1);
      }
      const daysToNextBirthday = differenceInDays(nextBirthday, now);
      
      const milestones = [];
      if (years >= 18) milestones.push("🎓 Majorité atteinte");
      if (years >= 25) milestones.push("🚗 Location de voiture disponible");
      if (years >= 50) milestones.push("🌟 Demi-siècle accompli");
      if (years >= 65) milestones.push("🏖️ Âge de la retraite");
      
      const result: AgeResult = {
        primary: `${years} ans, ${months} mois, ${days} jours`,
        details: `${totalDays.toLocaleString()} jours • ${totalWeeks.toLocaleString()} semaines • ${totalHours.toLocaleString()} heures`,
        milestones,
        nextBirthday: `Dans ${daysToNextBirthday} jour(s) (${format(nextBirthday, "dd MMMM yyyy", { locale: fr })})`
      };
      
      setTimeout(() => {
        addToHistory("Âge", format(birth, "dd/MM/yyyy", { locale: fr }), `${years} ans`);
      }, 0);
      
      return result;
    } catch (error) {
      console.error("Erreur lors du calcul d'âge:", error);
      return "Erreur de calcul";
    }
  }, [addToHistory]);

  return {
    calculationHistory,
    calculateDateDifference,
    calculateNewDate,
    calculateAge,
    addToHistory,
    clearHistory,
    deleteHistoryEntry,
    exportHistory,
    importHistory
  };
};
