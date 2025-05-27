import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Plus, Minus, AlertCircle, CalendarDays, Timer, History, Calculator } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const DateCalculatorAdvanced = () => {
  // États pour calculateur de différence
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [includeTime, setIncludeTime] = useState(false);
  
  // États pour ajout/soustraction
  const [baseDate, setBaseDate] = useState("");
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("days");
  
  // États pour calculateur d'âge
  const [birthDate, setBirthDate] = useState("");
  
  // États pour planificateur
  const [events, setEvents] = useState<Array<{
    id: string;
    name: string;
    date: string;
    time?: string;
    type: "meeting" | "deadline" | "reminder" | "event";
  }>>([]);
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventType, setNewEventType] = useState<"meeting" | "deadline" | "reminder" | "event">("event");

  const calculateDateDifference = useCallback(() => {
    if (!startDate || !endDate) return "";
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return "Dates invalides";
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;
    
    return {
      total: `${diffDays} jours, ${diffHours} heures, ${diffMinutes} minutes`,
      detailed: `${years} an(s), ${months} mois, ${days} jour(s)`,
      exact: diffDays
    };
  }, [startDate, endDate]);

  const calculateNewDate = useCallback(() => {
    if (!baseDate || !amount) return "";
    
    const base = new Date(baseDate);
    if (isNaN(base.getTime())) return "Date invalide";
    
    const num = parseInt(amount);
    if (isNaN(num)) return "Montant invalide";
    
    const result = new Date(base);
    const multiplier = operation === "add" ? 1 : -1;
    
    switch (unit) {
      case "days":
        result.setDate(result.getDate() + (num * multiplier));
        break;
      case "weeks":
        result.setDate(result.getDate() + (num * 7 * multiplier));
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
    
    return result.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: unit === "hours" ? "2-digit" : undefined,
      minute: unit === "hours" ? "2-digit" : undefined
    });
  }, [baseDate, amount, unit, operation]);

  const calculateAge = useCallback(() => {
    if (!birthDate) return "";
    
    const birth = new Date(birthDate);
    const now = new Date();
    
    if (isNaN(birth.getTime()) || birth > now) return "Date invalide";
    
    const diffTime = now.getTime() - birth.getTime();
    const ageDate = new Date(diffTime);
    const years = ageDate.getUTCFullYear() - 1970;
    const months = ageDate.getUTCMonth();
    const days = ageDate.getUTCDate() - 1;
    
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    return {
      primary: `${years} ans, ${months} mois, ${days} jours`,
      details: `${totalDays} jours au total • ${totalWeeks} semaines • ${totalHours.toLocaleString()} heures`
    };
  }, [birthDate]);

  const addEvent = () => {
    if (!newEventName || !newEventDate) return;
    
    const newEvent = {
      id: Date.now().toString(),
      name: newEventName,
      date: newEventDate,
      time: newEventTime,
      type: newEventType
    };
    
    setEvents(prev => [...prev, newEvent].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ));
    
    setNewEventName("");
    setNewEventDate("");
    setNewEventTime("");
  };

  const removeEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "deadline": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "reminder": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default: return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "meeting": return "👥";
      case "deadline": return "⏰";
      case "reminder": return "🔔";
      default: return "📅";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 rounded-xl border-2 border-purple-200 dark:border-purple-800">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Calculateurs de Dates & Temps Avancés
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Calculez des différences, ajoutez/soustrayez du temps, planifiez vos événements et bien plus encore.
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge variant="secondary">Calculs précis</Badge>
          <Badge variant="secondary">Planning intégré</Badge>
          <Badge variant="secondary">Formats multiples</Badge>
        </div>
      </div>

      <Tabs defaultValue="difference" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="difference">
            <CalendarDays className="w-4 h-4 mr-2" />
            Différence
          </TabsTrigger>
          <TabsTrigger value="calculation">
            <Calculator className="w-4 h-4 mr-2" />
            Calculs
          </TabsTrigger>
          <TabsTrigger value="age">
            <Timer className="w-4 h-4 mr-2" />
            Âge
          </TabsTrigger>
          <TabsTrigger value="planner">
            <History className="w-4 h-4 mr-2" />
            Planning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="difference">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Calculateur de Différence de Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date de début</label>
                  <Input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-white dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date de fin</label>
                  <Input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-white dark:bg-gray-800"
                  />
                </div>
              </div>

              {startDate && endDate && (
                <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/40 dark:to-blue-900/40 rounded-xl border-2 border-purple-200 dark:border-purple-700">
                  <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-100">Résultats</h3>
                  {typeof calculateDateDifference() === "object" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Durée totale:</span>
                        <span className="text-purple-700 dark:text-purple-300 font-mono">
                          {(calculateDateDifference() as any).total}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Format détaillé:</span>
                        <span className="text-blue-700 dark:text-blue-300 font-mono">
                          {(calculateDateDifference() as any).detailed}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Jours exacts:</span>
                        <span className="text-green-700 dark:text-green-300 font-mono text-2xl">
                          {(calculateDateDifference() as any).exact}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-green-600" />
                Ajout/Soustraction de Temps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date de base</label>
                  <Input
                    type="datetime-local"
                    value={baseDate}
                    onChange={(e) => setBaseDate(e.target.value)}
                    className="bg-white dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Opération</label>
                  <Select value={operation} onValueChange={(value: "add" | "subtract") => setOperation(value)}>
                    <SelectTrigger className="bg-white dark:bg-gray-800">
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
                  <label className="text-sm font-medium">Quantité</label>
                  <Input
                    type="number"
                    placeholder="Ex: 30"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-white dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Unité</label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger className="bg-white dark:bg-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">Heures</SelectItem>
                      <SelectItem value="days">Jours</SelectItem>
                      <SelectItem value="weeks">Semaines</SelectItem>
                      <SelectItem value="months">Mois</SelectItem>
                      <SelectItem value="years">Années</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {baseDate && amount && (
                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/40 rounded-xl border-2 border-green-200 dark:border-green-700">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-100">Nouvelle Date</h3>
                  <p className="text-2xl font-mono text-green-700 dark:text-green-300">
                    {calculateNewDate()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="age">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-orange-600" />
                Calculateur d'Âge Précis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date de naissance</label>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="bg-white dark:bg-gray-800 max-w-md"
                />
              </div>

              {birthDate && (
                <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/40 dark:to-amber-900/40 rounded-xl border-2 border-orange-200 dark:border-orange-700">
                  <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-100">Votre Âge</h3>
                  {typeof calculateAge() === "object" && (
                    <div className="space-y-3">
                      <p className="text-2xl font-mono text-orange-700 dark:text-orange-300">
                        {(calculateAge() as any).primary}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {(calculateAge() as any).details}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planner">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" />
                Planificateur d'Événements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Input
                  placeholder="Nom de l'événement"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                />
                <Input
                  type="date"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                />
                <Input
                  type="time"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                />
                <Select value={newEventType} onValueChange={(value: any) => setNewEventType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="event">📅 Événement</SelectItem>
                    <SelectItem value="meeting">👥 Réunion</SelectItem>
                    <SelectItem value="deadline">⏰ Échéance</SelectItem>
                    <SelectItem value="reminder">🔔 Rappel</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addEvent} disabled={!newEventName || !newEventDate}>
                  Ajouter
                </Button>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Événements à venir ({events.length})</h3>
                {events.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <CalendarDays className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Aucun événement planifié</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {events.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getEventTypeIcon(event.type)}</span>
                          <div>
                            <p className="font-medium">{event.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(event.date).toLocaleDateString("fr-FR", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                              })}
                              {event.time && ` à ${event.time}`}
                            </p>
                          </div>
                          <Badge className={getEventTypeColor(event.type)}>
                            {event.type}
                          </Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeEvent(event.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
