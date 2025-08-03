
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, MapPin, Tag, Plus, Edit, Trash2, Download, Upload, Wifi, WifiOff, RefreshCw, BarChart3 } from 'lucide-react';
import { useEventPlannerUnified, type Event } from '../hooks/useEventPlannerUnified';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const EventPlannerTabEnhanced: React.FC = () => {
  const {
    events,
    categories,
    stats,
    userSettings,
    isLoading,
    isSyncing,
    lastSyncTime,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleOfflineMode,
    syncWithSupabase,
    exportData,
    importData
  } = useEventPlannerUnified();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Formulaire pour les nouveaux événements
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    time: '',
    type: 'event' as Event['type'],
    priority: 'medium' as Event['priority'],
    description: '',
    location: '',
    tags: [] as string[],
    isRecurring: false,
    recurringType: undefined as Event['recurringType']
  });

  // Réinitialiser le formulaire
  const resetForm = () => {
    setNewEvent({
      name: '',
      date: '',
      time: '',
      type: 'event',
      priority: 'medium',
      description: '',
      location: '',
      tags: [],
      isRecurring: false,
      recurringType: undefined
    });
  };

  // Gérer l'ajout d'un événement
  const handleAddEvent = async () => {
    if (!newEvent.name || !newEvent.date) return;
    
    await addEvent(newEvent);
    resetForm();
    setIsAddDialogOpen(false);
  };

  // Gérer la mise à jour d'un événement
  const handleUpdateEvent = async () => {
    if (!editingEvent) return;
    
    await updateEvent(editingEvent.id, editingEvent);
    setEditingEvent(null);
  };

  // Gérer l'import de fichier
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importData(file);
    }
  };

  // Filtrer les événements
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Obtenir la couleur de priorité
  const getPriorityColor = (priority: Event['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Obtenir la couleur du type
  const getTypeColor = (type: Event['type']) => {
    const colors = {
      event: 'bg-blue-500',
      meeting: 'bg-purple-500',
      deadline: 'bg-red-500',
      reminder: 'bg-orange-500',
      birthday: 'bg-pink-500',
      anniversary: 'bg-indigo-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Chargement des événements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques et contrôles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.totalEvents}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">À venir</p>
                <p className="text-2xl font-bold">{stats.upcomingEvents}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aujourd'hui</p>
                <p className="text-2xl font-bold">{stats.todayEvents}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En retard</p>
                <p className="text-2xl font-bold">{stats.overdueEvents}</p>
              </div>
              <Tag className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre d'outils */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvel événement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Ajouter un événement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nom de l'événement*</Label>
                      <Input
                        id="name"
                        value={newEvent.name}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Nom de l'événement"
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Date*</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="time">Heure</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select value={newEvent.type} onValueChange={(value: Event['type']) => setNewEvent(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="event">Événement</SelectItem>
                          <SelectItem value="meeting">Réunion</SelectItem>
                          <SelectItem value="deadline">Échéance</SelectItem>
                          <SelectItem value="reminder">Rappel</SelectItem>
                          <SelectItem value="birthday">Anniversaire</SelectItem>
                          <SelectItem value="anniversary">Anniversaire de mariage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority">Priorité</Label>
                      <Select value={newEvent.priority} onValueChange={(value: Event['priority']) => setNewEvent(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Faible</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="high">Élevée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="location">Lieu</Label>
                      <Input
                        id="location"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Lieu de l'événement"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Description de l'événement"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newEvent.isRecurring}
                      onCheckedChange={(checked) => setNewEvent(prev => ({ ...prev, isRecurring: checked }))}
                    />
                    <Label>Événement récurrent</Label>
                  </div>

                  {newEvent.isRecurring && (
                    <div>
                      <Label htmlFor="recurringType">Fréquence</Label>
                      <Select 
                        value={newEvent.recurringType} 
                        onValueChange={(value: Event['recurringType']) => setNewEvent(prev => ({ ...prev, recurringType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner la fréquence" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Quotidien</SelectItem>
                          <SelectItem value="weekly">Hebdomadaire</SelectItem>
                          <SelectItem value="monthly">Mensuel</SelectItem>
                          <SelectItem value="yearly">Annuel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleAddEvent} disabled={!newEvent.name || !newEvent.date}>
                      Ajouter
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleOfflineMode}
                className={userSettings.offlineMode ? "bg-orange-100" : "bg-green-100"}
              >
                {userSettings.offlineMode ? <WifiOff className="w-4 h-4 mr-2" /> : <Wifi className="w-4 h-4 mr-2" />}
                {userSettings.offlineMode ? 'Hors ligne' : 'En ligne'}
              </Button>

              {!userSettings.offlineMode && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={syncWithSupabase}
                  disabled={isSyncing}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                  Synchroniser
                </Button>
              )}
            </div>

            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>

            <div>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
                id="import-file"
              />
              <Button variant="outline" size="sm" asChild>
                <label htmlFor="import-file" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Importer
                </label>
              </Button>
            </div>
          </div>

          {lastSyncTime && (
            <p className="text-xs text-muted-foreground mt-2">
              Dernière synchronisation: {new Date(lastSyncTime).toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="Rechercher un événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="event">Événements</SelectItem>
                <SelectItem value="meeting">Réunions</SelectItem>
                <SelectItem value="deadline">Échéances</SelectItem>
                <SelectItem value="reminder">Rappels</SelectItem>
                <SelectItem value="birthday">Anniversaires</SelectItem>
                <SelectItem value="anniversary">Anniversaires de mariage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des événements */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Aucun événement trouvé</p>
            </CardContent>
          </Card>
        ) : (
          filteredEvents.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{event.name}</h3>
                      <Badge className={`text-white ${getPriorityColor(event.priority)}`}>
                        {event.priority === 'high' ? 'Élevée' : 
                         event.priority === 'medium' ? 'Moyenne' : 'Faible'}
                      </Badge>
                      <Badge className={`text-white ${getTypeColor(event.type)}`}>
                        {event.type === 'event' ? 'Événement' :
                         event.type === 'meeting' ? 'Réunion' :
                         event.type === 'deadline' ? 'Échéance' :
                         event.type === 'reminder' ? 'Rappel' :
                         event.type === 'birthday' ? 'Anniversaire' : 'Anniversaire de mariage'}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date}</span>
                        {event.time && (
                          <>
                            <Clock className="w-4 h-4 ml-2" />
                            <span>{event.time}</span>
                          </>
                        )}
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      
                      {event.description && (
                        <p className="mt-2">{event.description}</p>
                      )}

                      {event.tags.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <Tag className="w-4 h-4" />
                          <div className="flex gap-1">
                            {event.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingEvent(event)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteEvent(event.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialog de modification */}
      {editingEvent && (
        <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier l'événement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Nom de l'événement*</Label>
                  <Input
                    id="edit-name"
                    value={editingEvent.name}
                    onChange={(e) => setEditingEvent(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                    placeholder="Nom de l'événement"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-date">Date*</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent(prev => prev ? ({ ...prev, date: e.target.value }) : null)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-time">Heure</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={editingEvent.time || ''}
                    onChange={(e) => setEditingEvent(prev => prev ? ({ ...prev, time: e.target.value || undefined }) : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-type">Type</Label>
                  <Select 
                    value={editingEvent.type} 
                    onValueChange={(value: Event['type']) => setEditingEvent(prev => prev ? ({ ...prev, type: value }) : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="event">Événement</SelectItem>
                      <SelectItem value="meeting">Réunion</SelectItem>
                      <SelectItem value="deadline">Échéance</SelectItem>
                      <SelectItem value="reminder">Rappel</SelectItem>
                      <SelectItem value="birthday">Anniversaire</SelectItem>
                      <SelectItem value="anniversary">Anniversaire de mariage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-priority">Priorité</Label>
                  <Select 
                    value={editingEvent.priority} 
                    onValueChange={(value: Event['priority']) => setEditingEvent(prev => prev ? ({ ...prev, priority: value }) : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Faible</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Élevée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-location">Lieu</Label>
                  <Input
                    id="edit-location"
                    value={editingEvent.location || ''}
                    onChange={(e) => setEditingEvent(prev => prev ? ({ ...prev, location: e.target.value || undefined }) : null)}
                    placeholder="Lieu de l'événement"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent(prev => prev ? ({ ...prev, description: e.target.value || undefined }) : null)}
                  placeholder="Description de l'événement"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingEvent.isRecurring || false}
                  onCheckedChange={(checked) => setEditingEvent(prev => prev ? ({ ...prev, isRecurring: checked }) : null)}
                />
                <Label>Événement récurrent</Label>
              </div>

              {editingEvent.isRecurring && (
                <div>
                  <Label htmlFor="edit-recurringType">Fréquence</Label>
                  <Select 
                    value={editingEvent.recurringType || ''} 
                    onValueChange={(value: Event['recurringType']) => setEditingEvent(prev => prev ? ({ ...prev, recurringType: value }) : null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la fréquence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Quotidien</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuel</SelectItem>
                      <SelectItem value="yearly">Annuel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingEvent(null)}>
                  Annuler
                </Button>
                <Button onClick={handleUpdateEvent}>
                  Sauvegarder
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EventPlannerTabEnhanced;
