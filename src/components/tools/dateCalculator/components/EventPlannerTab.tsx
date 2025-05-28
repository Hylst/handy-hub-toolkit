
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { History, Plus, Minus, CalendarDays, Clock, MapPin, Copy } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { Event } from "../types";

export const EventPlannerTab = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventType, setNewEventType] = useState<Event["type"]>("event");
  const [newEventPriority, setNewEventPriority] = useState<Event["priority"]>("medium");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");

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

  return (
    <Card className="shadow-lg border-2">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50">
        <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
          <History className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-600" />
          Planificateur d'Événements Avancé
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 lg:space-y-6 p-4 lg:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 lg:p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border-2">
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
            className="sm:col-span-2 lg:col-span-3 bg-white dark:bg-gray-700"
          />
          <Button 
            onClick={addEvent} 
            disabled={!newEventName || !newEventDate}
            className="bg-indigo-600 hover:bg-indigo-700 sm:col-span-2 lg:col-span-3"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="font-bold text-lg lg:text-xl">Événements à venir ({events.length})</h3>
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
                className="self-start"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copier la liste
              </Button>
            )}
          </div>
          
          {events.length === 0 ? (
            <div className="text-center py-8 lg:py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <CalendarDays className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-2">Aucun événement planifié</p>
              <p className="text-sm text-gray-500">Commencez par ajouter votre premier événement ci-dessus</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div 
                  key={event.id} 
                  className={`p-4 bg-white dark:bg-gray-800 rounded-xl border-2 shadow-sm hover:shadow-md transition-shadow ${getPriorityColor(event.priority)}`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-xl lg:text-2xl">{getEventTypeIcon(event.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-3 mb-2">
                          <h4 className="font-semibold text-base lg:text-lg truncate">{event.name}</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={getEventTypeColor(event.type)}>
                              {event.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {getDaysUntilEvent(event.date)}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="w-4 h-4" />
                              <span className="break-words">
                                {format(new Date(event.date), "EEEE dd MMMM yyyy", { locale: fr })}
                              </span>
                            </div>
                            {event.time && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {event.time}
                              </div>
                            )}
                          </div>
                          
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span className="break-words">{event.location}</span>
                            </div>
                          )}
                          
                          {event.description && (
                            <p className="mt-2 text-gray-700 dark:text-gray-300 break-words">
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
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 self-start lg:self-auto"
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
  );
};
