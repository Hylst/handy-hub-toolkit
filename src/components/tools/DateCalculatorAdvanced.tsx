
import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Plus, Minus, AlertCircle, CalendarDays, Timer, History, Calculator, Globe, Target, Zap, Info, Copy, CheckCircle, Clock3, MapPin } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, addDays, subDays, differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, differenceInYears } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

// Types pour une meilleure organisation
interface DateResult {
  total: string;
  detailed: string;
  exact: number;
  breakdown: {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
  };
}

interface AgeResult {
  primary: string;
  details: string;
  milestones: string[];
  nextBirthday: string;
}

interface Event {
  id: string;
  name: string;
  date: string;
  time?: string;
  type: "meeting" | "deadline" | "reminder" | "event" | "birthday" | "anniversary";
  priority: "low" | "medium" | "high";
  description?: string;
  location?: string;
}

interface TimeZone {
  name: string;
  label: string;
  offset: string;
}

export const DateCalculatorAdvanced = () => {
  const { toast } = useToast();
  
  // États pour calculateur de différence
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [includeTime, setIncludeTime] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Date>();
  
  // États pour ajout/soustraction
  const [baseDate, setBaseDate] = useState("");
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("days");
  
  // États pour calculateur d'âge
  const [birthDate, setBirthDate] = useState("");
  
  // États pour planificateur avancé
  const [events, setEvents] = useState<Event[]>([]);
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventType, setNewEventType] = useState<Event["type"]>("event");
  const [newEventPriority, setNewEventPriority] = useState<Event["priority"]>("medium");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  
  // États pour fuseaux horaires
  const [selectedTimeZone, setSelectedTimeZone] = useState("Europe/Paris");
  const [worldClocks, setWorldClocks] = useState<TimeZone[]>([
    { name: "Europe/Paris", label: "Paris", offset: "+01:00" },
    { name: "America/New_York", label: "New York", offset: "-05:00" },
    { name: "Asia/Tokyo", label: "Tokyo", offset: "+09:00" }
  ]);
  
  // État pour l'historique
  const [calculationHistory, setCalculationHistory] = useState<Array<{
    id: string;
    type: string;
    calculation: string;
    result: string;
    timestamp: Date;
  }>>([]);

  // Horloge en temps réel
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeZones = [
    { name: "Europe/Paris", label: "Paris (CET)" },
    { name: "Europe/London", label: "Londres (GMT)" },
    { name: "America/New_York", label: "New York (EST)" },
    { name: "America/Los_Angeles", label: "Los Angeles (PST)" },
    { name: "Asia/Tokyo", label: "Tokyo (JST)" },
    { name: "Asia/Shanghai", label: "Shanghai (CST)" },
    { name: "Australia/Sydney", label: "Sydney (AEST)" },
    { name: "America/Sao_Paulo", label: "São Paulo (BRT)" }
  ];

  const addToHistory = (type: string, calculation: string, result: string) => {
    const newEntry = {
      id: Date.now().toString(),
      type,
      calculation,
      result,
      timestamp: new Date()
    };
    setCalculationHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Garde les 10 derniers
  };

  const calculateDateDifference = useCallback((): DateResult | string => {
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
  }, [startDate, endDate]);

  const calculateNewDate = useCallback(() => {
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
  }, [baseDate, amount, unit, operation]);

  const calculateAge = useCallback((): AgeResult | string => {
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
    
    // Calcul du prochain anniversaire
    const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < now) {
      nextBirthday.setFullYear(now.getFullYear() + 1);
    }
    const daysToNextBirthday = differenceInDays(nextBirthday, now);
    
    // Jalons importants
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
  }, [birthDate]);

  const addEvent = () => {
    if (!newEventName || !newEventDate) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir au minimum le nom et la date de l'événement.",
        variant: "destructive"
      });
      return;
    }
    
    const newEvent: Event = {
      id: Date.now().toString(),
      name: newEventName,
      date: newEventDate,
      time: newEventTime,
      type: newEventType,
      priority: newEventPriority,
      description: newEventDescription,
      location: newEventLocation
    };
    
    setEvents(prev => [...prev, newEvent].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ));
    
    // Reset form
    setNewEventName("");
    setNewEventDate("");
    setNewEventTime("");
    setNewEventDescription("");
    setNewEventLocation("");
    
    toast({
      title: "Événement ajouté",
      description: `${newEventName} a été ajouté à votre planning.`,
    });
  };

  const removeEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    toast({
      title: "Événement supprimé",
      description: "L'événement a été retiré de votre planning.",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: "Le résultat a été copié dans le presse-papiers.",
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "deadline": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "reminder": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "birthday": return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
      case "anniversary": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default: return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-4 border-red-500";
      case "medium": return "border-l-4 border-yellow-500";
      default: return "border-l-4 border-green-500";
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "meeting": return "👥";
      case "deadline": return "⏰";
      case "reminder": return "🔔";
      case "birthday": return "🎂";
      case "anniversary": return "💝";
      default: return "📅";
    }
  };

  const getDaysUntilEvent = (eventDate: string) => {
    const today = new Date();
    const event = new Date(eventDate);
    const days = differenceInDays(event, today);
    
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Demain";
    if (days < 0) return `Il y a ${Math.abs(days)} jour(s)`;
    return `Dans ${days} jour(s)`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* En-tête amélioré avec horloge temps réel */}
      <div className="text-center space-y-6 p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/50 dark:via-purple-950/50 dark:to-pink-950/50 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 shadow-lg">
        <div className="flex justify-center items-center gap-4 mb-4">
          <Clock className="w-12 h-12 text-indigo-600 animate-pulse" />
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Suite Avancée Dates & Temps
            </h1>
            <div className="text-2xl font-mono text-gray-700 dark:text-gray-300 mt-2">
              {format(currentTime, "HH:mm:ss", { locale: fr })}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {format(currentTime, "EEEE dd MMMM yyyy", { locale: fr })}
            </div>
          </div>
        </div>
        
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Calculez des différences temporelles, planifiez vos événements, gérez les fuseaux horaires et bien plus encore avec notre suite d'outils professionnels.
        </p>
        
        <div className="flex justify-center gap-3 flex-wrap">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            <Zap className="w-4 h-4 mr-1" />
            Calculs précis
          </Badge>
          <Badge variant="secondary" className="text-sm px-4 py-2">
            <Globe className="w-4 h-4 mr-1" />
            Fuseaux horaires
          </Badge>
          <Badge variant="secondary" className="text-sm px-4 py-2">
            <Target className="w-4 h-4 mr-1" />
            Planning avancé
          </Badge>
          <Badge variant="secondary" className="text-sm px-4 py-2">
            <History className="w-4 h-4 mr-1" />
            Historique
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="difference" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
          <TabsTrigger value="difference" className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <span className="hidden sm:inline">Différence</span>
          </TabsTrigger>
          <TabsTrigger value="calculation" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            <span className="hidden sm:inline">Calculs</span>
          </TabsTrigger>
          <TabsTrigger value="age" className="flex items-center gap-2">
            <Timer className="w-4 h-4" />
            <span className="hidden sm:inline">Âge</span>
          </TabsTrigger>
          <TabsTrigger value="planner" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">Planning</span>
          </TabsTrigger>
          <TabsTrigger value="timezone" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Fuseaux</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="difference">
          <Card className="shadow-lg border-2">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/50 dark:to-blue-950/50">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Calendar className="w-6 h-6 text-purple-600" />
                Calculateur de Différence de Dates
                <Info className="w-4 h-4 text-gray-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Date de début</label>
                  <Input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-white dark:bg-gray-800 border-2 focus:border-purple-400 transition-colors"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Date de fin</label>
                  <Input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-white dark:bg-gray-800 border-2 focus:border-purple-400 transition-colors"
                  />
                </div>
              </div>

              {startDate && endDate && typeof calculateDateDifference() === "object" && (
                <div className="p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/40 dark:via-blue-900/40 dark:to-indigo-900/40 rounded-2xl border-2 border-purple-200 dark:border-purple-700 shadow-inner">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">Résultats Détaillés</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const result = calculateDateDifference() as DateResult;
                        copyToClipboard(`${result.detailed} (${result.exact} jours)`);
                      }}
                      className="text-purple-600 hover:text-purple-700"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {(() => {
                    const result = calculateDateDifference() as DateResult;
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Clock3 className="w-5 h-5 text-purple-600" />
                            <span className="font-semibold">Durée totale:</span>
                          </div>
                          <p className="text-lg font-mono text-purple-700 dark:text-purple-300 bg-white dark:bg-gray-800 p-3 rounded-lg">
                            {result.total}
                          </p>
                          
                          <div className="flex items-center gap-3">
                            <CalendarDays className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold">Format détaillé:</span>
                          </div>
                          <p className="text-lg font-mono text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-800 p-3 rounded-lg">
                            {result.detailed}
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
                            <div className="text-3xl font-bold text-green-600">{result.exact}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Jours exacts</div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                              <div className="font-bold text-indigo-600">{result.breakdown.years}</div>
                              <div className="text-gray-600">Années</div>
                            </div>
                            <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                              <div className="font-bold text-indigo-600">{result.breakdown.months}</div>
                              <div className="text-gray-600">Mois</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Les autres onglets suivent le même pattern amélioré... */}
        {/* Je vais continuer avec les autres onglets pour maintenir la cohérence */}

        <TabsContent value="calculation">
          <Card className="shadow-lg border-2">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Plus className="w-6 h-6 text-green-600" />
                Ajout/Soustraction de Temps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

              {baseDate && amount && (
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/40 rounded-2xl border-2 border-green-200 dark:border-green-700 shadow-inner">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">Nouvelle Date</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(calculateNewDate())}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-2xl font-mono text-green-700 dark:text-green-300 bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                    {calculateNewDate()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="age">
          <Card className="shadow-lg border-2">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Timer className="w-6 h-6 text-orange-600" />
                Calculateur d'Âge Précis & Avancé
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold">Date de naissance</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-2"
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {birthDate ? format(new Date(birthDate), "dd MMMM yyyy", { locale: fr }) : "Sélectionnez votre date de naissance"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
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

              {birthDate && typeof calculateAge() === "object" && (
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/40 dark:to-amber-900/40 rounded-2xl border-2 border-orange-200 dark:border-orange-700 shadow-inner">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">Votre Âge Détaillé</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const age = calculateAge() as AgeResult;
                          copyToClipboard(age.primary);
                        }}
                        className="text-orange-600 hover:text-orange-700"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {(() => {
                      const age = calculateAge() as AgeResult;
                      return (
                        <div className="space-y-4">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-orange-700 dark:text-orange-300 mb-2">
                              {age.primary}
                            </p>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                              {age.details}
                            </p>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              Prochain anniversaire
                            </h4>
                            <p className="text-orange-600 dark:text-orange-400">{age.nextBirthday}</p>
                          </div>
                          
                          {age.milestones.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Jalons atteints
                              </h4>
                              <div className="space-y-2">
                                {age.milestones.map((milestone, index) => (
                                  <div key={index} className="flex items-center gap-2 text-sm">
                                    <span>{milestone}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planner">
          <Card className="shadow-lg border-2">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50">
              <CardTitle className="flex items-center gap-3 text-xl">
                <History className="w-6 h-6 text-indigo-600" />
                Planificateur d'Événements Avancé
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Formulaire d'ajout d'événement amélioré */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border-2">
                <Input
                  placeholder="Nom de l'événement *"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  className="bg-white dark:bg-gray-700"
                />
                <Input
                  type="date"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="bg-white dark:bg-gray-700"
                />
                <Input
                  type="time"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="bg-white dark:bg-gray-700"
                />
                <Select value={newEventType} onValueChange={(value: any) => setNewEventType(value)}>
                  <SelectTrigger className="bg-white dark:bg-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="event">📅 Événement</SelectItem>
                    <SelectItem value="meeting">👥 Réunion</SelectItem>
                    <SelectItem value="deadline">⏰ Échéance</SelectItem>
                    <SelectItem value="reminder">🔔 Rappel</SelectItem>
                    <SelectItem value="birthday">🎂 Anniversaire</SelectItem>
                    <SelectItem value="anniversary">💝 Anniversaire</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={newEventPriority} onValueChange={(value: any) => setNewEventPriority(value)}>
                  <SelectTrigger className="bg-white dark:bg-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">🟢 Priorité basse</SelectItem>
                    <SelectItem value="medium">🟡 Priorité moyenne</SelectItem>
                    <SelectItem value="high">🔴 Priorité haute</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Lieu (optionnel)"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  className="bg-white dark:bg-gray-700"
                />
                <Textarea
                  placeholder="Description (optionnel)"
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  className="md:col-span-2 bg-white dark:bg-gray-700"
                />
                <Button 
                  onClick={addEvent} 
                  disabled={!newEventName || !newEventDate}
                  className="bg-indigo-600 hover:bg-indigo-700 md:col-span-3 lg:col-span-1"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>

              {/* Liste des événements */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xl">Événements à venir ({events.length})</h3>
                  {events.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const eventsList = events.map(e => 
                          `${e.name} - ${format(new Date(e.date), "dd/MM/yyyy", { locale: fr })}${e.time ? ` à ${e.time}` : ""}`
                        ).join('\n');
                        copyToClipboard(eventsList);
                      }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copier la liste
                    </Button>
                  )}
                </div>
                
                {events.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <CalendarDays className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">Aucun événement planifié</p>
                    <p className="text-sm text-gray-500">Commencez par ajouter votre premier événement ci-dessus</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {events.map((event) => (
                      <div 
                        key={event.id} 
                        className={`p-4 bg-white dark:bg-gray-800 rounded-xl border-2 shadow-sm hover:shadow-md transition-shadow ${getPriorityColor(event.priority)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="text-2xl">{getEventTypeIcon(event.type)}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-lg">{event.name}</h4>
                                <Badge className={getEventTypeColor(event.type)}>
                                  {event.type}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {getDaysUntilEvent(event.date)}
                                </Badge>
                              </div>
                              
                              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                  <CalendarDays className="w-4 h-4" />
                                  {format(new Date(event.date), "EEEE dd MMMM yyyy", { locale: fr })}
                                  {event.time && (
                                    <>
                                      <Clock className="w-4 h-4 ml-2" />
                                      {event.time}
                                    </>
                                  )}
                                </div>
                                
                                {event.location && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {event.location}
                                  </div>
                                )}
                                
                                {event.description && (
                                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                                    {event.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEvent(event.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timezone">
          <Card className="shadow-lg border-2">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Globe className="w-6 h-6 text-teal-600" />
                Horloges Mondiales & Fuseaux Horaires
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Horloges mondiales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {timeZones.slice(0, 6).map((tz) => (
                  <div key={tz.name} className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/40 dark:to-cyan-900/40 rounded-xl border-2 border-teal-200 dark:border-teal-700 text-center">
                    <h3 className="font-semibold text-lg text-teal-700 dark:text-teal-300 mb-2">
                      {tz.label}
                    </h3>
                    <div className="text-2xl font-mono text-gray-800 dark:text-gray-200">
                      {format(currentTime, "HH:mm:ss")}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {format(currentTime, "dd/MM/yyyy")}
                    </div>
                  </div>
                ))}
              </div>

              {/* Historique des calculs */}
              {calculationHistory.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Historique des Calculs
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {calculationHistory.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{entry.type}</Badge>
                          <span className="font-mono">{entry.calculation}</span>
                          <span className="text-gray-600">→</span>
                          <span className="font-semibold">{entry.result}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {format(entry.timestamp, "HH:mm", { locale: fr })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
