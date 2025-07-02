
import { useCallback } from 'react';
import { useDexieDB } from '@/hooks/useDexieDB';

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

export const useEventPlannerEnhanced = () => {
  const { saveData, loadData } = useDexieDB();

  // Calculer les statistiques une seule fois
  const calculateStats = useCallback((events: Event[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];
    
    return {
      totalEvents: events.length,
      upcomingEvents: events.filter(e => new Date(e.date) > today).length,
      todayEvents: events.filter(e => e.date === todayStr).length,
      overdueEvents: events.filter(e => new Date(e.date) < today && e.type === 'deadline').length
    };
  }, []);

  // Charger les données avec gestion d'erreur améliorée
  const loadEventsData = useCallback(async (): Promise<EventsData> => {
    try {
      const data = await loadData('date-planner-events');
      if (data && data.events) {
        return {
          ...data,
          stats: calculateStats(data.events)
        };
      }
      return defaultEventsData;
    } catch (error) {
      console.error('Erreur chargement événements:', error);
      return defaultEventsData;
    }
  }, [loadData, calculateStats]);

  // Sauvegarder avec optimisation
  const saveEventsData = useCallback(async (eventsData: EventsData) => {
    try {
      const dataToSave = {
        ...eventsData,
        stats: calculateStats(eventsData.events),
        lastModified: new Date().toISOString()
      };
      
      await saveData('date-planner-events', dataToSave);
      return true;
    } catch (error) {
      console.error('Erreur sauvegarde événements:', error);
      return false;
    }
  }, [saveData, calculateStats]);

  // Opérations CRUD simplifiées
  const addEvent = useCallback(async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    const eventsData = await loadEventsData();
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      tags: eventData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedEvents = [...eventsData.events, newEvent].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    await saveEventsData({
      ...eventsData,
      events: updatedEvents
    });
  }, [loadEventsData, saveEventsData]);

  const updateEvent = useCallback(async (eventId: string, updates: Partial<Event>) => {
    const eventsData = await loadEventsData();
    const updatedEvents = eventsData.events.map(event =>
      event.id === eventId
        ? { ...event, ...updates, updatedAt: new Date().toISOString() }
        : event
    );

    await saveEventsData({
      ...eventsData,
      events: updatedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    });
  }, [loadEventsData, saveEventsData]);

  const deleteEvent = useCallback(async (eventId: string) => {
    const eventsData = await loadEventsData();
    const filteredEvents = eventsData.events.filter(event => event.id !== eventId);

    await saveEventsData({
      ...eventsData,
      events: filteredEvents
    });
  }, [loadEventsData, saveEventsData]);

  const addCategory = useCallback(async (category: string) => {
    const eventsData = await loadEventsData();
    if (!eventsData.categories.includes(category)) {
      await saveEventsData({
        ...eventsData,
        categories: [...eventsData.categories, category]
      });
    }
  }, [loadEventsData, saveEventsData]);

  return {
    loadEventsData,
    addEvent,
    updateEvent,
    deleteEvent,
    addCategory,
    // Propriétés statiques pour éviter les re-renders
    isLoading: false,
    isOnline: true,
    isSyncing: false,
    lastSyncTime: new Date().toISOString(),
    exportData: () => Promise.resolve(),
    importData: async () => false,
    resetData: async () => Promise.resolve()
  };
};
