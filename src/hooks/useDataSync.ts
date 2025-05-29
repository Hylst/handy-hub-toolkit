
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface OfflineData {
  id: string;
  tool_name: string;
  data: any;
  last_sync: string;
  created_at: string;
  updated_at: string;
}

export const useDataSync = (toolName: string) => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Écouter les changements de connexion
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (user) {
        syncData();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user]);

  // Sauvegarder les données localement
  const saveToLocal = useCallback((data: any) => {
    try {
      const storageKey = `offline_${toolName}_${user?.id}`;
      const offlineData = {
        data,
        timestamp: new Date().toISOString(),
        synced: false,
      };
      localStorage.setItem(storageKey, JSON.stringify(offlineData));
      console.log(`Data saved locally for ${toolName}`);
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }
  }, [toolName, user?.id]);

  // Charger les données locales
  const loadFromLocal = useCallback((): any | null => {
    try {
      const storageKey = `offline_${toolName}_${user?.id}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.data;
      }
    } catch (error) {
      console.error('Error loading from local storage:', error);
    }
    return null;
  }, [toolName, user?.id]);

  // Sauvegarder dans Supabase
  const saveToSupabase = useCallback(async (data: any) => {
    if (!user || !isOnline) return false;

    try {
      const { error } = await supabase
        .from('user_offline_data')
        .upsert({
          user_id: user.id,
          tool_name: toolName,
          data: data,
          last_sync: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving to Supabase:', error);
        return false;
      }

      setLastSyncTime(new Date().toISOString());
      console.log(`Data synced to Supabase for ${toolName}`);
      return true;
    } catch (error) {
      console.error('Error syncing to Supabase:', error);
      return false;
    }
  }, [user, isOnline, toolName]);

  // Charger depuis Supabase
  const loadFromSupabase = useCallback(async (): Promise<any | null> => {
    if (!user || !isOnline) return null;

    try {
      const { data, error } = await supabase
        .from('user_offline_data')
        .select('*')
        .eq('user_id', user.id)
        .eq('tool_name', toolName)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Aucune donnée trouvée
          return null;
        }
        console.error('Error loading from Supabase:', error);
        return null;
      }

      setLastSyncTime(data.last_sync);
      return data.data;
    } catch (error) {
      console.error('Error loading from Supabase:', error);
      return null;
    }
  }, [user, isOnline, toolName]);

  // Synchroniser les données
  const syncData = useCallback(async () => {
    if (!user || !isOnline || isSyncing) return;

    setIsSyncing(true);
    try {
      // Charger les données locales
      const localData = loadFromLocal();
      const remoteData = await loadFromSupabase();

      if (localData && remoteData) {
        // Comparer les timestamps et garder la version la plus récente
        const storageKey = `offline_${toolName}_${user.id}`;
        const localTimestamp = JSON.parse(localStorage.getItem(storageKey) || '{}').timestamp;
        const remoteTimestamp = remoteData.last_sync || remoteData.updated_at;

        if (new Date(localTimestamp) > new Date(remoteTimestamp)) {
          // Les données locales sont plus récentes
          await saveToSupabase(localData);
          toast({
            title: "Synchronisation",
            description: "Données locales synchronisées avec succès",
          });
        } else {
          // Les données distantes sont plus récentes
          saveToLocal(remoteData);
          toast({
            title: "Synchronisation",
            description: "Données mises à jour depuis le serveur",
          });
        }
      } else if (localData && !remoteData) {
        // Seulement des données locales
        await saveToSupabase(localData);
        toast({
          title: "Synchronisation",
          description: "Données locales sauvegardées sur le serveur",
        });
      } else if (!localData && remoteData) {
        // Seulement des données distantes
        saveToLocal(remoteData);
      }

      // Marquer comme synchronisé
      const storageKey = `offline_${toolName}_${user.id}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.synced = true;
        localStorage.setItem(storageKey, JSON.stringify(parsed));
      }
    } catch (error) {
      console.error('Error during sync:', error);
      toast({
        title: "Erreur de synchronisation",
        description: "Impossible de synchroniser les données",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  }, [user, isOnline, isSyncing, toolName, loadFromLocal, loadFromSupabase, saveToSupabase, saveToLocal]);

  // Sauvegarder des données (local + distant si en ligne)
  const saveData = useCallback(async (data: any) => {
    // Toujours sauvegarder localement
    saveToLocal(data);

    // Sauvegarder à distance si en ligne
    if (isOnline) {
      await saveToSupabase(data);
    }
  }, [isOnline, saveToLocal, saveToSupabase]);

  // Charger des données (distant si en ligne, sinon local)
  const loadData = useCallback(async (): Promise<any | null> => {
    if (isOnline) {
      const remoteData = await loadFromSupabase();
      if (remoteData) {
        // Sauvegarder aussi localement pour l'accès hors ligne
        saveToLocal(remoteData);
        return remoteData;
      }
    }

    // Charger depuis le stockage local
    return loadFromLocal();
  }, [isOnline, loadFromSupabase, loadFromLocal, saveToLocal]);

  return {
    isOnline,
    isSyncing,
    lastSyncTime,
    saveData,
    loadData,
    syncData,
    saveToLocal,
    loadFromLocal,
  };
};
