import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

interface IndexedDBConfig {
  dbName: string;
  version: number;
  stores: {
    name: string;
    keyPath: string;
    indexes?: { name: string; keyPath: string; unique?: boolean }[];
  }[];
}

interface StoredData {
  id: string;
  data: any;
  timestamp: number;
  checksum?: string;
}

export const useIndexedDBManager = (config: IndexedDBConfig) => {
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [db, setDb] = useState<IDBDatabase | null>(null);

  // Initialize IndexedDB
  useEffect(() => {
    const initDB = async () => {
      try {
        const request = indexedDB.open(config.dbName, config.version);
        
        request.onerror = () => {
          console.error('Error opening IndexedDB');
          toast({
            title: "Erreur de base de données",
            description: "Impossible d'initialiser le stockage local",
            variant: "destructive",
          });
        };

        request.onsuccess = () => {
          setDb(request.result);
          setIsInitialized(true);
        };

        request.onupgradeneeded = (event) => {
          const database = (event.target as IDBOpenDBRequest).result;
          
          config.stores.forEach(storeConfig => {
            if (!database.objectStoreNames.contains(storeConfig.name)) {
              const store = database.createObjectStore(storeConfig.name, {
                keyPath: storeConfig.keyPath
              });
              
              if (storeConfig.indexes) {
                storeConfig.indexes.forEach(index => {
                  store.createIndex(index.name, index.keyPath, {
                    unique: index.unique || false
                  });
                });
              }
            }
          });
        };
      } catch (error) {
        console.error('Error initializing IndexedDB:', error);
      }
    };

    initDB();
  }, [config]);

  // Calculate checksum for data integrity
  const calculateChecksum = useCallback((data: any): string => {
    return btoa(JSON.stringify(data)).slice(0, 16);
  }, []);

  // Save data to IndexedDB
  const saveData = useCallback(async (storeName: string, key: string, data: any): Promise<boolean> => {
    if (!db || !isInitialized) return false;

    setIsLoading(true);
    try {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const storedData: StoredData = {
        id: key,
        data,
        timestamp: Date.now(),
        checksum: calculateChecksum(data)
      };

      await new Promise<void>((resolve, reject) => {
        const request = store.put(storedData);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      return true;
    } catch (error) {
      console.error('Error saving to IndexedDB:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder les données",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [db, isInitialized, calculateChecksum, toast]);

  // Load data from IndexedDB
  const loadData = useCallback(async (storeName: string, key: string): Promise<any | null> => {
    if (!db || !isInitialized) return null;

    setIsLoading(true);
    try {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);

      const storedData = await new Promise<StoredData | null>((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });

      if (!storedData) return null;

      // Verify data integrity
      const calculatedChecksum = calculateChecksum(storedData.data);
      if (storedData.checksum && storedData.checksum !== calculatedChecksum) {
        console.warn('Data checksum mismatch, data may be corrupted');
        toast({
          title: "Données corrompues",
          description: "Les données semblent avoir été altérées",
          variant: "destructive",
        });
        return null;
      }

      return storedData.data;
    } catch (error) {
      console.error('Error loading from IndexedDB:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [db, isInitialized, calculateChecksum, toast]);

  // Delete data from IndexedDB
  const deleteData = useCallback(async (storeName: string, key: string): Promise<boolean> => {
    if (!db || !isInitialized) return false;

    try {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);

      await new Promise<void>((resolve, reject) => {
        const request = store.delete(key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      return true;
    } catch (error) {
      console.error('Error deleting from IndexedDB:', error);
      return false;
    }
  }, [db, isInitialized]);

  // Get all keys from a store
  const getAllKeys = useCallback(async (storeName: string): Promise<string[]> => {
    if (!db || !isInitialized) return [];

    try {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);

      return await new Promise<string[]>((resolve, reject) => {
        const request = store.getAllKeys();
        request.onsuccess = () => resolve(request.result as string[]);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting keys from IndexedDB:', error);
      return [];
    }
  }, [db, isInitialized]);

  // Export all data from IndexedDB
  const exportAllData = useCallback(async (): Promise<any> => {
    if (!db || !isInitialized) return {};

    const exportData: any = {};
    
    for (const storeConfig of config.stores) {
      try {
        const transaction = db.transaction([storeConfig.name], 'readonly');
        const store = transaction.objectStore(storeConfig.name);

        const allData = await new Promise<StoredData[]>((resolve, reject) => {
          const request = store.getAll();
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });

        exportData[storeConfig.name] = allData.reduce((acc, item) => {
          acc[item.id] = {
            data: item.data,
            timestamp: item.timestamp
          };
          return acc;
        }, {} as any);
      } catch (error) {
        console.error(`Error exporting data from ${storeConfig.name}:`, error);
      }
    }

    return {
      exportDate: new Date().toISOString(),
      version: config.version,
      data: exportData
    };
  }, [db, isInitialized, config]);

  // Clear all data from IndexedDB
  const clearAllData = useCallback(async (): Promise<boolean> => {
    if (!db || !isInitialized) return false;

    try {
      const transaction = db.transaction(config.stores.map(s => s.name), 'readwrite');
      
      for (const storeConfig of config.stores) {
        const store = transaction.objectStore(storeConfig.name);
        await new Promise<void>((resolve, reject) => {
          const request = store.clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }

      toast({
        title: "Données supprimées",
        description: "Toutes les données ont été supprimées avec succès",
      });

      return true;
    } catch (error) {
      console.error('Error clearing IndexedDB:', error);
      toast({
        title: "Erreur de suppression",
        description: "Impossible de supprimer toutes les données",
        variant: "destructive",
      });
      return false;
    }
  }, [db, isInitialized, config.stores, toast]);

  // Get storage usage information
  const getStorageInfo = useCallback(async () => {
    if (!navigator.storage || !navigator.storage.estimate) {
      return null;
    }

    try {
      const estimate = await navigator.storage.estimate();
      return {
        quota: estimate.quota,
        usage: estimate.usage,
        available: estimate.quota ? estimate.quota - (estimate.usage || 0) : 0
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return null;
    }
  }, []);

  return {
    isInitialized,
    isLoading,
    saveData,
    loadData,
    deleteData,
    getAllKeys,
    exportAllData,
    clearAllData,
    getStorageInfo
  };
};
