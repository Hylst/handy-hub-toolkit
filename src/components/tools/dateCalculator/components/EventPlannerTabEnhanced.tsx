
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { History, Plus, Search, Filter, Edit, Trash2, CalendarDays, Clock, MapPin, Copy } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useEventPlannerEnhanced, Event } from '../hooks/useEventPlannerEnhanced';
import { DataImportExport } from '../../common/DataImportExport';

export const EventPlannerTabEnhanced = () => {
  const { toast } = useToast();
  const {
    events,
    categories,
    stats,
    addEvent,
    updateEvent,
    deleteEvent,
    addCategory,
    isLoading,
    isOnline,
    isSyncing,
    lastSyncTime,
    exportData,
    importData,
    resetData
  } = useEventPlannerEnhanced();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    time: '',
    type: 'event' as Event['type'],
    priority: 'medium' as Event['priority'],
    description: '',
    location: '',
    tags: ''
  });

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesPriority = filterPriority === 'all' || event.priority === filterPriority;

    return matchesSearch && matchesType && matchesPriority;
  });

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case 'deadline': return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case 'reminder': return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case 'birthday': return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
      case 'anniversary': return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default: return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return "border-l-4 border-red-500";
      case 'medium': return "border-l-4 border-yellow-500";
      default: return "border-l-4 border-green-500";
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return "👥";
      case 'deadline': return "⏰";
      case 'reminder': return "🔔";
      case 'birthday': return "🎂";
      case 'anniversary': return "💝";
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

  const handleAddEvent = async () => {
    if (!newEvent.name || !newEvent.date) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir au minimum le nom et la date de l'événement.",
        variant: "destructive"
      });
      return;
    }
    
    await addEvent({
      name: newEvent.name,
      date: newEvent.date,
      time: newEvent.time,
      type: newEvent.type,
      priority: newEvent.priority,
      description: newEvent.description,
      location: newEvent.location,
      tags: newEvent.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
    
    resetForm();
    toast({
      title: "Événement ajouté",
      description: `${newEvent.name} a été ajouté à votre planning.`,
    });
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent || !newEvent.name || !newEvent.date) return;

    await updateEvent(editingEvent.id, {
      name: newEvent.name,
      date: newEvent.date,
      time: newEvent.time,
      type: newEvent.type,
      priority: newEvent.priority,
      description: newEvent.description,
      location: newEvent.location,
      tags: newEvent.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });

    resetForm();
    toast({
      title: "Événement modifié",
      description: "L'événement a été mis à jour avec succès.",
    });
  };

  const startEdit = (event: Event) => {
    setEditingEvent(event);
    setNewEvent({
      name: event.name,
      date: event.date,
      time: event.time || '',
      type: event.type,
      priority: event.priority,
      description: event.description || '',
      location: event.location || '',
      tags: event.tags.join(', ')
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setNewEvent({
      name: '',
      date: '',
      time: '',
      type: 'event',
      priority: 'medium',
      description: '',
      location: '',
      tags: ''
    });
    setEditingEvent(null);
    setShowAddForm(false);
  };

  const handleDeleteEvent = async (id: string) => {
    await deleteEvent(id);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-500">Chargement des événements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <Card className="shadow-lg border-2">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50">
          <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
            <History className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-600" />
            Planificateur d'Événements Avancé
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 lg:space-y-6 p-4 lg:p-6">
          {/* Statistiques */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <div className="p-3 lg:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <h3 className="font-semibold text-blue-700 dark:text-blue-300 text-sm lg:text-base">Total</h3>
              <p className="text-xl lg:text-2xl font-bold text-blue-600">{stats.totalEvents}</p>
            </div>
            <div className="p-3 lg:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <h3 className="font-semibold text-green-700 dark:text-green-300 text-sm lg:text-base">À venir</h3>
              <p className="text-xl lg:text-2xl font-bold text-green-600">{stats.upcomingEvents}</p>
            </div>
            <div className="p-3 lg:p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
              <h3 className="font-semibold text-orange-700 dark:text-orange-300 text-sm lg:text-base">Aujourd'hui</h3>
              <p className="text-xl lg:text-2xl font-bold text-orange-600">{stats.todayEvents}</p>
            </div>
            <div className="p-3 lg:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
              <h3 className="font-semibold text-red-700 dark:text-red-300 text-sm lg:text-base">En retard</h3>
              <p className="text-xl lg:text-2xl font-bold text-red-600">{stats.overdueEvents}</p>
            </div>
          </div>

          <Separator />

          {/* Recherche et filtres */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Type d'événement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="event">📅 Événement</SelectItem>
                <SelectItem value="meeting">👥 Réunion</SelectItem>
                <SelectItem value="deadline">⏰ Échéance</SelectItem>
                <SelectItem value="reminder">🔔 Rappel</SelectItem>
                <SelectItem value="birthday">🎂 Anniversaire</SelectItem>
                <SelectItem value="anniversary">💝 Anniversaire</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes priorités</SelectItem>
                <SelectItem value="high">🔴 Haute</SelectItem>
                <SelectItem value="medium">🟡 Moyenne</SelectItem>
                <SelectItem value="low">🟢 Basse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bouton d'ajout */}
          <Button 
            onClick={() => {
              setShowAddForm(!showAddForm);
              if (showAddForm) resetForm();
            }}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            {showAddForm ? 'Annuler' : 'Nouvel événement'}
          </Button>

          {/* Formulaire d'ajout/édition */}
          {showAddForm && (
            <Card className="border-2 border-indigo-200 dark:border-indigo-800">
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input
                    placeholder="Nom de l'événement *"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                    className="sm:col-span-2 lg:col-span-1"
                  />
                  <Input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  />
                  <Input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  />
                  <Select value={newEvent.type} onValueChange={(value: any) => setNewEvent({...newEvent, type: value})}>
                    <SelectTrigger>
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
                  <Select value={newEvent.priority} onValueChange={(value: any) => setNewEvent({...newEvent, priority: value})}>
                    <SelectTrigger>
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
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  />
                </div>
                <Input
                  placeholder="Tags (séparés par des virgules)"
                  value={newEvent.tags}
                  onChange={(e) => setNewEvent({...newEvent, tags: e.target.value})}
                />
                <Textarea
                  placeholder="Description (optionnel)"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                />
                <Button 
                  onClick={editingEvent ? handleUpdateEvent : handleAddEvent}
                  disabled={!newEvent.name || !newEvent.date}
                  className="w-full"
                >
                  {editingEvent ? 'Mettre à jour' : 'Ajouter'} l'événement
                </Button>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Liste des événements */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="font-bold text-lg lg:text-xl">
                Événements ({filteredEvents.length})
              </h3>
              {filteredEvents.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const eventsList = filteredEvents.map(e => 
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
            
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8 lg:py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <CalendarDays className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-2">
                  {searchTerm || filterType !== 'all' || filterPriority !== 'all'
                    ? 'Aucun événement ne correspond aux filtres'
                    : 'Aucun événement planifié'
                  }
                </p>
                <p className="text-sm text-gray-500">
                  {searchTerm || filterType !== 'all' || filterPriority !== 'all'
                    ? 'Modifiez vos critères de recherche'
                    : 'Commencez par ajouter votre premier événement'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEvents.map((event) => (
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

                            {event.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {event.tags.map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 self-start lg:self-auto">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(event)}
                          className="text-gray-500 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Import/Export */}
      <DataImportExport
        onExport={exportData}
        onImport={importData}
        onReset={resetData}
        isOnline={isOnline}
        isSyncing={isSyncing}
        lastSyncTime={lastSyncTime}
        toolName="Événements"
      />
    </div>
  );
};
