
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDexieDB } from './useDexieDB';
import { useDataSync } from './useDataSync';
import { useToast } from './use-toast';

interface OptimizedDataManagerOptions {
  toolName: string;
  defaultData?: any;
  autoSave?: boolean;
  syncInterval?: number;
}

export const useOptimizedDataManager = <T>({
  toolName,
  defaultData = null,
  autoSave = true,
  syncInterval = 30000 // 30 secondes
}: OptimizedDataManagerOptions) => {
  const { toast } = useToast();
  const { saveData, loadData, deleteData } = useDexieDB();
  const { isOnline, isSyncing, lastSyncTime, saveToSupabase, loadFromSupabase } = useDataSync(toolName);
  
  const [data, setData] = useState<T>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const syncIntervalRef = useRef<NodeJS.Timeout>();

  // Chargement initial optimisé
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Essayer de charger depuis Supabase si en ligne
        if (isOnline) {
          const remoteData = await loadFromSupabase();
          if (remoteData) {
            setData(remoteData);
            // Sauvegarder localement pour l'accès hors ligne
            await saveData(toolName, remoteData);
            console.log(`📥 Données chargées depuis Supabase pour ${toolName}`);
            return;
          }
        }

        // Charger depuis Dexie
        const localData = await loadData(toolName);
        if (localData) {
          setData(localData);
          console.log(`💾 Données chargées depuis Dexie pour ${toolName}`);
        } else {
          setData(defaultData);
          console.log(`📝 Données par défaut pour ${toolName}`);
        }
      } catch (error) {
        console.error(`❌ Erreur de chargement pour ${toolName}:`, error);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [toolName, isOnline, defaultData, saveData, loadData, loadFromSupabase]);

  // Auto-save debounced
  const debouncedSave = useCallback(async (newData: T) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        // Sauvegarder localement
        await saveData(toolName, newData);
        
        // Sauvegarder sur Supabase si en ligne
        if (isOnline && !isSyncing) {
          await saveToSupabase(newData);
        }
        
        setHasChanges(false);
        console.log(`🔄 Auto-save terminé pour ${toolName}`);
      } catch (error) {
        console.error(`❌ Erreur auto-save pour ${toolName}:`, error);
      }
    }, 1000); // 1 seconde de debounce
  }, [toolName, saveData, saveToSupabase, isOnline, isSyncing]);

  // Mise à jour des données avec auto-save
  const updateData = useCallback((newData: T) => {
    setData(newData);
    setHasChanges(true);
    
    if (autoSave) {
      debouncedSave(newData);
    }
  }, [autoSave, debouncedSave]);

  // Sauvegarde manuelle
  const manualSave = useCallback(async () => {
    try {
      await saveData(toolName, data);
      
      if (isOnline) {
        await saveToSupabase(data);
      }
      
      setHasChanges(false);
      toast({
        title: "Sauvegarde réussie",
        description: `Données sauvegardées pour ${toolName}`,
      });
    } catch (error) {
      console.error(`❌ Erreur de sauvegarde manuelle:`, error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder les données",
        variant: "destructive",
      });
    }
  }, [data, toolName, saveData, saveToSupabase, isOnline, toast]);

  // Export optimisé
  const exportData = useCallback(() => {
    try {
      const exportObj = {
        tool: toolName,
        version: "2.1.0",
        exportDate: new Date().toISOString(),
        data: data,
        metadata: {
          hasChanges,
          lastModified: new Date().toISOString()
        }
      };
      
      const blob = new Blob([JSON.stringify(exportObj, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${toolName}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export réussi",
        description: "Données exportées avec succès",
      });
    } catch (error) {
      console.error(`❌ Erreur d'export:`, error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les données",
        variant: "destructive",
      });
    }
  }, [data, toolName, hasChanges, toast]);

  // Import optimisé
  const importData = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const importObj = JSON.parse(text);
      
      if (!importObj.data || importObj.tool !== toolName) {
        throw new Error('Format de fichier incorrect');
      }
      
      updateData(importObj.data);
      
      toast({
        title: "Import réussi",
        description: "Données importées avec succès",
      });
      
      return true;
    } catch (error) {
      console.error(`❌ Erreur d'import:`, error);
      toast({
        title: "Erreur d'import",
        description: "Format de fichier incorrect",
        variant: "destructive",
      });
      return false;
    }
  }, [toolName, updateData, toast]);

  // Reset optimisé
  const resetData = useCallback(async () => {
    try {
      await deleteData(toolName);
      updateData(defaultData);
      
      toast({
        title: "Données réinitialisées",
        description: "Toutes les données ont été supprimées",
      });
    } catch (error) {
      console.error(`❌ Erreur de reset:`, error);
    }
  }, [toolName, deleteData, updateData, defaultData, toast]);

  // Sync automatique
  useEffect(() => {
    if (syncInterval > 0 && isOnline) {
      syncIntervalRef.current = setInterval(() => {
        if (hasChanges && !isSyncing) {
          saveToSupabase(data);
        }
      }, syncInterval);

      return () => {
        if (syncIntervalRef.current) {
          clearInterval(syncIntervalRef.current);
        }
      };
    }
  }, [syncInterval, isOnline, hasChanges, isSyncing, data, saveToSupabase]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, []);

  return {
    data,
    setData: updateData,
    isLoading,
    hasChanges,
    isOnline,
    isSyncing,
    lastSyncTime,
    manualSave,
    exportData,
    importData,
    resetData
  };
};
