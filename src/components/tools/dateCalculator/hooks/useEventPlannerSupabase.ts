
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useAppDatabase } from '@/hooks/useAppDatabase';

export interface Event {
  id: string;
  name: string;
  date: string;
  time?: string;
  type: 'event' | 'meeting' | 'deadline' | 'reminder' | 'birthday' | 'anniversary';
  priority: 'low' | 'medium' | 'high';
  description?: string;
  location?: string;
  isRecurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface EventsData {
  events: Event[];
  categories: string[];
  stats: {
    totalEvents: number;
    upcomingEvents: number;
    todayEvents: number;
    overdueEvents: number;
  };
}

interface UserSettings {
  offlineMode: boolean;
  syncEnabled: boolean;
  lastSync?: string;
}

const defaultEventsData: EventsData = {
  events: [],
  categories: ['Personnel', 'Travail', 'Famille', 'Santé', 'Loisirs'],
  stats: {
    totalEvents: 0,
    upcomingEvents: 0,
    todayEvents: 0,
    overdueEvents: 0
  }
};

const defaultSettings: UserSettings = {
  offlineMode: false,
  syncEnabled: true
};

export const useEventPlannerSupabase = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { saveData, loadData, isInitialized } = useAppDatabase();
  
  const [eventsData, setEventsData] = useState<EventsData>(defaultEventsData);
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Calculer les statistiques
  const updateStats = useCallback((events: Event[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayStr = today.toISOString().split('T')[0];
    
    const stats = {
      totalEvents: events.length,
      upcomingEvents: events.filter(e => new Date(e.date) > today).length,
      todayEvents: events.filter(e => e.date === todayStr).length,
      overdueEvents: events.filter(e => new Date(e.date) < today && e.type === 'deadline').length
    };
    
    return stats;
  }, []);

  // Charger les paramètres utilisateur
  const loadUserSettings = useCallback(async () => {
    if (!user) return defaultSettings;

    try {
      const { data, error } = await supabase
        .from('user_app_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user settings:', error);
        return defaultSettings;
      }

      if (data) {
        return {
          offlineMode: data.offline_mode || false,
          syncEnabled: data.sync_enabled || true,
          lastSync: data.last_sync || undefined
        };
      }

      return defaultSettings;
    } catch (error) {
      console.error('Error loading user settings:', error);
      return defaultSettings;
    }
  }, [user]);

  // Sauvegarder les paramètres utilisateur
  const saveUserSettings = useCallback(async (settings: UserSettings) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_app_settings')
        .upsert({
          user_id: user.id,
          offline_mode: settings.offlineMode,
          sync_enabled: settings.syncEnabled,
          last_sync: settings.lastSync || new Date().toISOString()
        });

      if (error) {
        console.error('Error saving user settings:', error);
        throw error;
      }

      setUserSettings(settings);
    } catch (error) {
      console.error('Error saving user settings:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  // Charger les événements depuis Supabase
  const loadEventsFromSupabase = useCallback(async (): Promise<Event[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('user_events')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error loading events from Supabase:', error);
        return [];
      }

      return (data || []).map(event => ({
        id: event.event_id,
        name: event.name,
        date: event.date,
        time: event.time || undefined,
        type: event.type as any,
        priority: event.priority as any,
        description: event.description || undefined,
        location: event.location || undefined,
        isRecurring: event.is_recurring || false,
        recurringType: event.recurring_type as any,
        tags: event.tags || [],
        createdAt: event.created_at,
        updatedAt: event.updated_at
      }));
    } catch (error) {
      console.error('Error loading events from Supabase:', error);
      return [];
    }
  }, [user]);

  // Charger les événements depuis le stockage local
  const loadEventsFromLocal = useCallback(async (): Promise<EventsData> => {
    if (!isInitialized) return defaultEventsData;

    try {
      const localData = await loadData('events-planner', 'main-data');
      if (localData && localData.data) {
        return localData.data;
      }
    } catch (error) {
      console.error('Error loading events from local storage:', error);
    }

    return defaultEventsData;
  }, [isInitialized, loadData]);

  // Sauvegarder les événements localement
  const saveEventsToLocal = useCallback(async (data: EventsData) => {
    if (!isInitialized) return;

    try {
      await saveData('events-planner', 'main-data', data);
    } catch (error) {
      console.error('Error saving events to local storage:', error);
    }
  }, [isInitialized, saveData]);

  // Synchroniser avec Supabase
  const syncWithSupabase = useCallback(async () => {
    if (!user || userSettings.offlineMode || !userSettings.syncEnabled || isSyncing) return;

    setIsSyncing(true);
    try {
      const remoteEvents = await loadEventsFromSupabase();
      const newEventsData = {
        ...eventsData,
        events: remoteEvents,
        stats: updateStats(remoteEvents)
      };
      
      setEventsData(newEventsData);
      await saveEventsToLocal(newEventsData);
      setLastSyncTime(new Date().toISOString());

      toast({
        title: "Synchronisation réussie",
        description: `${remoteEvents.length} événements synchronisés`,
      });
    } catch (error) {
      console.error('Error syncing with Supabase:', error);
      toast({
        title: "Erreur de synchronisation",
        description: "Impossible de synchroniser avec le serveur",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  }, [user, userSettings, isSyncing, eventsData, loadEventsFromSupabase, saveEventsToLocal, updateStats, toast]);

  // Charger les données initiales
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      
      try {
        // Charger les paramètres utilisateur
        const settings = await loadUserSettings();
        setUserSettings(settings);

        // Charger les événements selon le mode
        if (user && !settings.offlineMode) {
          // Mode en ligne : charger depuis Supabase
          const remoteEvents = await loadEventsFromSupabase();
          const newEventsData = {
            ...defaultEventsData,
            events: remoteEvents,
            stats: updateStats(remoteEvents)
          };
          setEventsData(newEventsData);
          await saveEventsToLocal(newEventsData);
          setLastSyncTime(settings.lastSync || new Date().toISOString());
        } else {
          // Mode hors ligne : charger depuis le stockage local
          const localData = await loadEventsFromLocal();
          setEventsData(localData);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        const localData = await loadEventsFromLocal();
        setEventsData(localData);
      } finally {
        setIsLoading(false);
      }
    };

    if (isInitialized) {
      loadInitialData();
    }
  }, [user, isInitialized, loadUserSettings, loadEventsFromSupabase, loadEventsFromLocal, saveEventsToLocal, updateStats]);

  // Ajouter un événement
  const addEvent = useCallback(async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      tags: eventData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      // Sauvegarder localement d'abord
      const newEvents = [...eventsData.events, newEvent];
      const newEventsData = {
        ...eventsData,
        events: newEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        stats: updateStats(newEvents)
      };
      
      setEventsData(newEventsData);
      await saveEventsToLocal(newEventsData);

      // Sauvegarder dans Supabase si en mode en ligne
      if (user && !userSettings.offlineMode) {
        const { error } = await supabase
          .from('user_events')
          .insert({
            user_id: user.id,
            event_id: newEvent.id,
            name: newEvent.name,
            date: newEvent.date,
            time: newEvent.time,
            type: newEvent.type,
            priority: newEvent.priority,
            description: newEvent.description,
            location: newEvent.location,
            tags: newEvent.tags,
            is_recurring: newEvent.isRecurring,
            recurring_type: newEvent.recurringType
          });

        if (error) {
          console.error('Error saving event to Supabase:', error);
          toast({
            title: "Avertissement",
            description: "Événement sauvegardé localement, synchronisation échouée",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Événement ajouté",
        description: `"${newEvent.name}" a été ajouté avec succès`,
      });
    } catch (error) {
      console.error('Error adding event:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'événement",
        variant: "destructive",
      });
    }
  }, [eventsData, user, userSettings, saveEventsToLocal, updateStats, toast]);

  // Mettre à jour un événement
  const updateEvent = useCallback(async (eventId: string, updates: Partial<Event>) => {
    try {
      const newEvents = eventsData.events.map(event =>
        event.id === eventId
          ? { ...event, ...updates, updatedAt: new Date().toISOString() }
          : event
      );

      const newEventsData = {
        ...eventsData,
        events: newEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        stats: updateStats(newEvents)
      };

      setEventsData(newEventsData);
      await saveEventsToLocal(newEventsData);

      // Mettre à jour dans Supabase si en mode en ligne
      if (user && !userSettings.offlineMode) {
        const updatedEvent = newEvents.find(e => e.id === eventId);
        if (updatedEvent) {
          const { error } = await supabase
            .from('user_events')
            .update({
              name: updatedEvent.name,
              date: updatedEvent.date,
              time: updatedEvent.time,
              type: updatedEvent.type,
              priority: updatedEvent.priority,
              description: updatedEvent.description,
              location: updatedEvent.location,
              tags: updatedEvent.tags,
              is_recurring: updatedEvent.isRecurring,
              recurring_type: updatedEvent.recurringType
            })
            .eq('user_id', user.id)
            .eq('event_id', eventId);

          if (error) {
            console.error('Error updating event in Supabase:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'événement",
        variant: "destructive",
      });
    }
  }, [eventsData, user, userSettings, saveEventsToLocal, updateStats, toast]);

  // Supprimer un événement
  const deleteEvent = useCallback(async (eventId: string) => {
    try {
      const newEvents = eventsData.events.filter(event => event.id !== eventId);
      const newEventsData = {
        ...eventsData,
        events: newEvents,
        stats: updateStats(newEvents)
      };

      setEventsData(newEventsData);
      await saveEventsToLocal(newEventsData);

      // Supprimer de Supabase si en mode en ligne
      if (user && !userSettings.offlineMode) {
        const { error } = await supabase
          .from('user_events')
          .delete()
          .eq('user_id', user.id)
          .eq('event_id', eventId);

        if (error) {
          console.error('Error deleting event from Supabase:', error);
        }
      }

      toast({
        title: "Événement supprimé",
        description: "L'événement a été supprimé avec succès",
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'événement",
        variant: "destructive",
      });
    }
  }, [eventsData, user, userSettings, saveEventsToLocal, updateStats, toast]);

  // Basculer le mode offline/online
  const toggleOfflineMode = useCallback(async () => {
    const newSettings = {
      ...userSettings,
      offlineMode: !userSettings.offlineMode
    };

    await saveUserSettings(newSettings);

    if (!newSettings.offlineMode && user) {
      // Passage en mode en ligne : synchroniser
      await syncWithSupabase();
    }

    toast({
      title: newSettings.offlineMode ? "Mode hors ligne activé" : "Mode en ligne activé",
      description: newSettings.offlineMode 
        ? "Les données sont sauvegardées localement uniquement"
        : "Synchronisation avec le serveur activée",
    });
  }, [userSettings, saveUserSettings, user, syncWithSupabase, toast]);

  // Exporter les données
  const exportData = useCallback(() => {
    try {
      const dataToExport = {
        tool: 'event-planner',
        exportDate: new Date().toISOString(),
        version: "2.0",
        data: eventsData
      };
      
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `planning-events-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export réussi",
        description: "Les événements ont été exportés avec succès",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les données",
        variant: "destructive",
      });
    }
  }, [eventsData, toast]);

  // Importer les données
  const importData = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const importedData = JSON.parse(text);
      
      if (!importedData.data || importedData.tool !== 'event-planner') {
        throw new Error('Format de fichier incorrect');
      }
      
      setEventsData(importedData.data);
      await saveEventsToLocal(importedData.data);
      
      toast({
        title: "Import réussi",
        description: "Les événements ont été importés avec succès",
      });
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      toast({
        title: "Erreur d'import",
        description: "Format de fichier incorrect ou données corrompues",
        variant: "destructive",
      });
      return false;
    }
  }, [saveEventsToLocal, toast]);

  return {
    events: eventsData.events,
    categories: eventsData.categories,
    stats: eventsData.stats,
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
  };
};
