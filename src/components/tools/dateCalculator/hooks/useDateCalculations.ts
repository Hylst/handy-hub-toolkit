
import { useCallback, useState } from "react";
import { format, addDays, subDays, differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, differenceInYears } from "date-fns";
import { fr } from "date-fns/locale";
import { DateResult, AgeResult, CalculationHistoryEntry } from "../types";

export const useDateCalculations = () => {
  const [calculationHistory, setCalculationHistory] = useState<CalculationHistoryEntry[]>([]);

  const addToHistory = useCallback((type: string, calculation: string, result: string) => {
    const newEntry: CalculationHistoryEntry = {
      id: Date.now().toString(),
      type,
      calculation,
      result,
      timestamp: new Date()
    };
    setCalculationHistory(prev => [newEntry, ...prev.slice(0, 9)]);
  }, []);

  const calculateDateDifference = useCallback((startDate: string, endDate: string): DateResult | string => {
    if (!startDate || !endDate) return "";
    
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
    
    addToHistory("Différence", `${format(start, "dd/MM/yyyy", { locale: fr })} → ${format(end, "dd/MM/yyyy", { locale: fr })}`, `${exactDays} jours`);
    
    return result;
  }, [addToHistory]);

  const calculateNewDate = useCallback((baseDate: string, amount: string, unit: string, operation: "add" | "subtract") => {
    if (!baseDate || !amount) return "";
    
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
    
    addToHistory("Calcul", `${format(base, "dd/MM/yyyy", { locale: fr })} ${operation === "add" ? "+" : "-"} ${num} ${unit}`, formattedResult);
    
    return formattedResult;
  }, [addToHistory]);

  const calculateAge = useCallback((birthDate: string): AgeResult | string => {
    if (!birthDate) return "";
    
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
    
    addToHistory("Âge", format(birth, "dd/MM/yyyy", { locale: fr }), `${years} ans`);
    
    return result;
  }, [addToHistory]);

  return {
    calculationHistory,
    calculateDateDifference,
    calculateNewDate,
    calculateAge,
    addToHistory
  };
};
