
import { useCallback } from 'react';
import { useOfflineDataManager } from '@/hooks/useOfflineDataManager';

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
  const {
    data: eventsData,
    setData: setEventsData,
    isLoading,
    isOnline,
    isSyncing,
    lastSyncTime,
    exportData,
    importData,
    resetData
  } = useOfflineDataManager<EventsData>({
    toolName: 'date-planner-events',
    defaultData: defaultEventsData
  });

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

  // Ajouter un événement
  const addEvent = useCallback(async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      tags: eventData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newEvents = [...(eventsData?.events || []), newEvent];
    const newStats = updateStats(newEvents);

    await setEventsData({
      ...eventsData,
      events: newEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      stats: newStats
    });
  }, [eventsData, setEventsData, updateStats]);

  // Mettre à jour un événement
  const updateEvent = useCallback(async (eventId: string, updates: Partial<Event>) => {
    const newEvents = (eventsData?.events || []).map(event =>
      event.id === eventId
        ? { ...event, ...updates, updatedAt: new Date().toISOString() }
        : event
    );

    const newStats = updateStats(newEvents);

    await setEventsData({
      ...eventsData,
      events: newEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      stats: newStats
    });
  }, [eventsData, setEventsData, updateStats]);

  // Supprimer un événement
  const deleteEvent = useCallback(async (eventId: string) => {
    const newEvents = (eventsData?.events || []).filter(event => event.id !== eventId);
    const newStats = updateStats(newEvents);

    await setEventsData({
      ...eventsData,
      events: newEvents,
      stats: newStats
    });
  }, [eventsData, setEventsData, updateStats]);

  // Ajouter une catégorie
  const addCategory = useCallback(async (category: string) => {
    if (!eventsData?.categories.includes(category)) {
      await setEventsData({
        ...eventsData,
        categories: [...(eventsData?.categories || []), category]
      });
    }
  }, [eventsData, setEventsData]);

  return {
    events: eventsData?.events || [],
    categories: eventsData?.categories || [],
    stats: eventsData?.stats || defaultEventsData.stats,
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
  };
};
