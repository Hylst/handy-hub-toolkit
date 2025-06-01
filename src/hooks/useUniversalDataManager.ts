
import { useState, useEffect, useCallback } from 'react';
import { useIndexedDBManager } from './useIndexedDBManager';
import { useToast } from './use-toast';

interface DataManagerConfig {
  toolName: string;
  defaultData?: any;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

const DATABASE_CONFIG = {
  dbName: 'LovableToolsDB',
  version: 1,
  stores: [
    {
      name: 'productivity',
      keyPath: 'id',
      indexes: [
        { name: 'toolName', keyPath: 'toolName' },
        { name: 'timestamp', keyPath: 'timestamp' }
      ]
    },
    {
      name: 'creativity',
      keyPath: 'id',
      indexes: [
        { name: 'toolName', keyPath: 'toolName' },
        { name: 'timestamp', keyPath: 'timestamp' }
      ]
    },
    {
      name: 'utilities',
      keyPath: 'id',
      indexes: [
        { name: 'toolName', keyPath: 'toolName' },
        { name: 'timestamp', keyPath: 'timestamp' }
      ]
    },
    {
      name: 'settings',
      keyPath: 'id',
      indexes: [
        { name: 'category', keyPath: 'category' }
      ]
    }
  ]
};

export const useUniversalDataManager = <T>({
  toolName,
  defaultData = null,
  autoSave = true,
  autoSaveInterval = 5000
}: DataManagerConfig) => {
  const { toast } = useToast();
  const {
    isInitialized,
    isLoading,
    saveData: saveToIndexedDB,
    loadData: loadFromIndexedDB,
    deleteData,
    exportAllData,
    clearAllData,
    getStorageInfo
  } = useIndexedDBManager(DATABASE_CONFIG);

  const [data, setData] = useState<T>(defaultData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<string | null>(null);

  // Determine store name based on tool category
  const getStoreName = useCallback((toolName: string): string => {
    if (toolName.includes('productivity') || toolName.includes('task') || toolName.includes('goal') || toolName.includes('note')) {
      return 'productivity';
    }
    if (toolName.includes('creativity') || toolName.includes('logo') || toolName.includes('color') || toolName.includes('design')) {
      return 'creativity';
    }
    return 'utilities';
  }, []);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      if (!isInitialized) return;

      try {
        const storeName = getStoreName(toolName);
        const loadedData = await loadFromIndexedDB(storeName, toolName);
        
        if (loadedData) {
          setData(loadedData);
          setLastSaveTime(new Date().toISOString());
        } else {
          setData(defaultData);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        setData(defaultData);
      }
    };

    loadInitialData();
  }, [isInitialized, toolName, defaultData, getStoreName, loadFromIndexedDB]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !hasUnsavedChanges || !isInitialized) return;

    const saveInterval = setInterval(async () => {
      await saveData(data, false);
    }, autoSaveInterval);

    return () => clearInterval(saveInterval);
  }, [autoSave, hasUnsavedChanges, data, autoSaveInterval, isInitialized]);

  // Save data to IndexedDB
  const saveData = useCallback(async (newData: T, showToast: boolean = true): Promise<boolean> => {
    if (!isInitialized) return false;

    try {
      const storeName = getStoreName(toolName);
      const success = await saveToIndexedDB(storeName, toolName, newData);
      
      if (success) {
        setHasUnsavedChanges(false);
        setLastSaveTime(new Date().toISOString());
        
        if (showToast) {
          toast({
            title: "Données sauvegardées",
            description: "Vos données ont été sauvegardées avec succès",
          });
        }
      }
      
      return success;
    } catch (error) {
      console.error('Error saving data:', error);
      if (showToast) {
        toast({
          title: "Erreur de sauvegarde",
          description: "Impossible de sauvegarder les données",
          variant: "destructive",
        });
      }
      return false;
    }
  }, [isInitialized, toolName, getStoreName, saveToIndexedDB, toast]);

  // Update data
  const updateData = useCallback(async (newData: T, autoSaveNow: boolean = false) => {
    setData(newData);
    setHasUnsavedChanges(true);
    
    if (autoSaveNow) {
      await saveData(newData, false);
    }
  }, [saveData]);

  // Export data as JSON
  const exportData = useCallback(() => {
    try {
      const exportPayload = {
        tool: toolName,
        exportDate: new Date().toISOString(),
        version: "2.0",
        data: data
      };
      
      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${toolName}-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export réussi",
        description: "Les données ont été exportées avec succès",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les données",
        variant: "destructive",
      });
    }
  }, [data, toolName, toast]);

  // Import data from JSON file
  const importData = useCallback(async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const importedData = JSON.parse(text);
      
      // Validate imported data structure
      if (!importedData.data || (importedData.tool && importedData.tool !== toolName)) {
        throw new Error('Format de fichier incorrect');
      }
      
      await updateData(importedData.data, true);
      
      toast({
        title: "Import réussi",
        description: "Les données ont été importées avec succès",
      });
      
      return true;
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Erreur d'import",
        description: "Format de fichier incorrect ou données corrompues",
        variant: "destructive",
      });
      return false;
    }
  }, [toolName, updateData, toast]);

  // Reset data to default
  const resetData = useCallback(async () => {
    await updateData(defaultData, true);
    toast({
      title: "Données réinitialisées",
      description: "Toutes les données ont été supprimées",
    });
  }, [defaultData, updateData, toast]);

  // Export all app data
  const exportAllAppData = useCallback(async () => {
    try {
      const allData = await exportAllData();
      
      const blob = new Blob([JSON.stringify(allData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lovable-tools-full-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export complet réussi",
        description: "Toutes les données de l'application ont été exportées",
      });
    } catch (error) {
      console.error('Error exporting all data:', error);
      toast({
        title: "Erreur d'export global",
        description: "Impossible d'exporter toutes les données",
        variant: "destructive",
      });
    }
  }, [exportAllData, toast]);

  // Get storage information
  const getStorageStatus = useCallback(async () => {
    const storageInfo = await getStorageInfo();
    return storageInfo;
  }, [getStorageInfo]);

  return {
    // Data state
    data,
    setData: updateData,
    isLoading,
    isInitialized,
    hasUnsavedChanges,
    lastSaveTime,
    
    // Data operations
    saveData,
    exportData,
    importData,
    resetData,
    
    // Global operations
    exportAllAppData,
    clearAllData,
    getStorageStatus
  };
};
