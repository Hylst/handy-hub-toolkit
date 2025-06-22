
import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { useFallbackStorage, FallbackStorageManager } from './useFallbackStorage';

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
  const [useFallback, setUseFallback] = useState(false);
  
  const fallbackStorage = useFallbackStorage();

  // Initialize IndexedDB with fallback
  useEffect(() => {
    const initDB = async () => {
      try {
        console.log('Attempting to initialize IndexedDB...');
        
        // Check if IndexedDB is available
        if (!window.indexedDB) {
          console.warn('IndexedDB not available, using fallback storage');
          setUseFallback(true);
          setIsInitialized(true);
          return;
        }

        const request = indexedDB.open(config.dbName, config.version);
        
        request.onerror = () => {
          console.warn('IndexedDB failed to open, switching to fallback storage');
          setUseFallback(true);
          setIsInitialized(true);
        };

        request.onsuccess = () => {
          console.log('IndexedDB initialized successfully');
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

        // Set a timeout to fallback if IndexedDB takes too long
        setTimeout(() => {
          if (!isInitialized) {
            console.warn('IndexedDB initialization timeout, using fallback');
            setUseFallback(true);
            setIsInitialized(true);
          }
        }, 3000);

      } catch (error) {
        console.error('Error initializing IndexedDB:', error);
        setUseFallback(true);
        setIsInitialized(true);
      }
    };

    initDB();
  }, [config, isInitialized]);

  // Calculate checksum for data integrity
  const calculateChecksum = useCallback((data: any): string => {
    return btoa(JSON.stringify(data)).slice(0, 16);
  }, []);

  // Save data with fallback support
  const saveData = useCallback(async (storeName: string, key: string, data: any): Promise<boolean> => {
    if (useFallback) {
      return fallbackStorage.saveData(storeName, key, data);
    }

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
      // Try fallback if IndexedDB fails
      return fallbackStorage.saveData(storeName, key, data);
    } finally {
      setIsLoading(false);
    }
  }, [db, isInitialized, useFallback, calculateChecksum, fallbackStorage]);

  // Load data with fallback support
  const loadData = useCallback(async (storeName: string, key: string): Promise<any | null> => {
    if (useFallback) {
      return fallbackStorage.loadData(storeName, key);
    }

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
        return null;
      }

      return storedData.data;
    } catch (error) {
      console.error('Error loading from IndexedDB:', error);
      // Try fallback if IndexedDB fails
      return fallbackStorage.loadData(storeName, key);
    } finally {
      setIsLoading(false);
    }
  }, [db, isInitialized, useFallback, calculateChecksum, fallbackStorage]);

  // Delete data with fallback support
  const deleteData = useCallback(async (storeName: string, key: string): Promise<boolean> => {
    if (useFallback) {
      return fallbackStorage.deleteData(storeName, key);
    }

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
      return fallbackStorage.deleteData(storeName, key);
    }
  }, [db, isInitialized, useFallback, fallbackStorage]);

  // Get all keys with fallback support
  const getAllKeys = useCallback(async (storeName: string): Promise<string[]> => {
    if (useFallback) {
      return fallbackStorage.getAllKeys(storeName);
    }

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
      return fallbackStorage.getAllKeys(storeName);
    }
  }, [db, isInitialized, useFallback, fallbackStorage]);

  // Export all data with fallback support
  const exportAllData = useCallback(async (): Promise<any> => {
    if (useFallback) {
      return fallbackStorage.exportAllData();
    }

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
  }, [db, isInitialized, config, useFallback, fallbackStorage]);

  // Clear all data with fallback support
  const clearAllData = useCallback(async (): Promise<boolean> => {
    if (useFallback) {
      return fallbackStorage.clearAllData();
    }

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
      return fallbackStorage.clearAllData();
    }
  }, [db, isInitialized, config.stores, toast, useFallback, fallbackStorage]);

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
        available: estimate.quota ? estimate.quota - (estimate.usage || 0) : 0,
        usingFallback: useFallback
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return null;
    }
  }, [useFallback]);

  return {
    isInitialized,
    isLoading: isLoading || fallbackStorage.isLoading,
    saveData,
    loadData,
    deleteData,
    getAllKeys,
    exportAllData,
    clearAllData,
    getStorageInfo,
    usingFallback: useFallback
  };
};
