
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, Plus, Settings, Download, Upload, Trash2, Edit, Wifi, WifiOff, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEventPlannerSupabase, Event } from '../hooks/useEventPlannerSupabase';
import { useAuth } from '@/contexts/AuthContext';

export const EventPlannerTabEnhanced = () => {
  const { user } = useAuth();
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
  } = useEventPlannerSupabase();

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.date) return;

    const eventData = {
      ...formData,
      tags: formData.tags || []
    };

    if (editingEvent) {
      await updateEvent(editingEvent.id, eventData);
      setEditingEvent(null);
    } else {
      await addEvent(eventData);
    }

    setFormData({
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
    setShowForm(false);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      date: event.date,
      time: event.time || '',
      type: event.type,
      priority: event.priority,
      description: event.description || '',
      location: event.location || '',
      tags: event.tags,
      isRecurring: event.isRecurring || false,
      recurringType: event.recurringType
    });
    setShowForm(true);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file);
      e.target.value = '';
    }
  };

  const getEventTypeColor = (type: Event['type']) => {
    const colors = {
      event: 'bg-blue-100 text-blue-800',
      meeting: 'bg-green-100 text-green-800',
      deadline: 'bg-red-100 text-red-800',
      reminder: 'bg-yellow-100 text-yellow-800',
      birthday: 'bg-pink-100 text-pink-800',
      anniversary: 'bg-purple-100 text-purple-800'
    };
    return colors[type] || colors.event;
  };

  const getPriorityColor = (priority: Event['priority']) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-orange-100 text-orange-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[priority];
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>Chargement des événements...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques et contrôles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.totalEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">À venir</p>
                <p className="text-2xl font-bold">{stats.upcomingEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Aujourd'hui</p>
                <p className="text-2xl font-bold">{stats.todayEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">En retard</p>
                <p className="text-2xl font-bold">{stats.overdueEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Paramètres et contrôles */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Paramètres et Contrôles
            </div>
            {user && (
              <div className="flex items-center gap-2">
                {userSettings.offlineMode ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                <span className="text-xs">{userSettings.offlineMode ? 'Hors ligne' : 'En ligne'}</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Nouvel événement
            </Button>
            
            <Button onClick={exportData} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Exporter
            </Button>
            
            <Button variant="outline" size="sm" onClick={() => document.getElementById('file-import')?.click()}>
              <Upload className="w-4 h-4 mr-1" />
              Importer
            </Button>
            <input
              id="file-import"
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />

            {user && !userSettings.offlineMode && (
              <Button 
                onClick={syncWithSupabase} 
                variant="outline" 
                size="sm"
                disabled={isSyncing}
              >
                <RotateCcw className={`w-4 h-4 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
                Synchroniser
              </Button>
            )}
          </div>

          {user && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Label htmlFor="offline-mode" className="text-sm">Mode hors ligne</Label>
                <Switch
                  id="offline-mode"
                  checked={userSettings.offlineMode}
                  onCheckedChange={toggleOfflineMode}
                />
              </div>
              {lastSyncTime && (
                <span className="text-xs text-gray-500">
                  Dernière sync: {format(new Date(lastSyncTime), 'dd/MM/yyyy HH:mm', { locale: fr })}
                </span>
              )}
            </div>
          )}

          {!user && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Connectez-vous pour synchroniser vos événements avec le cloud et accéder aux fonctionnalités avancées.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom de l'événement *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nom de l'événement"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="time">Heure</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value: Event['type']) => setFormData(prev => ({ ...prev, type: value }))}>
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
                
                <div>
                  <Label htmlFor="priority">Priorité</Label>
                  <Select value={formData.priority} onValueChange={(value: Event['priority']) => setFormData(prev => ({ ...prev, priority: value }))}>
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
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Lieu de l'événement"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description de l'événement"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">
                  {editingEvent ? 'Modifier' : 'Ajouter'}
                </Button>
                <Button type="button" variant="outline" onClick={() => {
                  setShowForm(false);
                  setEditingEvent(null);
                  setFormData({
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
                }}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Liste des événements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Événements à venir</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun événement planifié</p>
              <p className="text-sm">Cliquez sur "Nouvel événement" pour commencer</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map(event => (
                <div key={event.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{event.name}</h3>
                        <Badge className={getEventTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                        <Badge className={getPriorityColor(event.priority)}>
                          {event.priority}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(new Date(event.date), 'EEEE dd MMMM yyyy', { locale: fr })}
                            {event.time && ` à ${event.time}`}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <span>📍 {event.location}</span>
                          </div>
                        )}
                        {event.description && (
                          <p className="text-gray-700 mt-2">{event.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-1 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(event)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteEvent(event.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
