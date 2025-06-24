
interface DatabaseConfig {
  dbName: string;
  version: number;
  stores: Array<{
    name: string;
    keyPath: string;
    indexes?: Array<{
      name: string;
      keyPath: string;
      unique?: boolean;
    }>;
  }>;
}

interface StoredItem {
  id: string;
  tool: string;
  data: any;
  timestamp: number;
  lastModified: string;
}

export const useIndexedDBManager = (config: DatabaseConfig) => {
  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(config.dbName, config.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        config.stores.forEach(store => {
          if (!db.objectStoreNames.contains(store.name)) {
            const objectStore = db.createObjectStore(store.name, {
              keyPath: store.keyPath
            });

            // Créer les index
            store.indexes?.forEach(index => {
              objectStore.createIndex(index.name, index.keyPath, {
                unique: index.unique || false
              });
            });
          }
        });
      };
    });
  };

  const saveData = async (tool: string, key: string, data: any): Promise<boolean> => {
    try {
      const db = await openDB();
      const transaction = db.transaction([tool], 'readwrite');
      const store = transaction.objectStore(tool);
      
      const item: StoredItem = {
        id: key,
        tool,
        data,
        timestamp: Date.now(),
        lastModified: new Date().toISOString()
      };

      await new Promise<void>((resolve, reject) => {
        const request = store.put(item);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      db.close();
      return true;
    } catch (error) {
      console.error(`Erreur sauvegarde IndexedDB pour ${tool}:`, error);
      return false;
    }
  };

  const loadData = async (tool: string, key: string): Promise<any | null> => {
    try {
      const db = await openDB();
      const transaction = db.transaction([tool], 'readonly');
      const store = transaction.objectStore(tool);

      const result = await new Promise<StoredItem | undefined>((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      db.close();
      
      if (result) {
        return result.data;
      }
      return null;
    } catch (error) {
      console.error(`Erreur chargement IndexedDB pour ${tool}:`, error);
      return null;
    }
  };

  const deleteData = async (tool: string, key: string): Promise<boolean> => {
    try {
      const db = await openDB();
      const transaction = db.transaction([tool], 'readwrite');
      const store = transaction.objectStore(tool);

      await new Promise<void>((resolve, reject) => {
        const request = store.delete(key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      db.close();
      return true;
    } catch (error) {
      console.error(`Erreur suppression IndexedDB pour ${tool}:`, error);
      return false;
    }
  };

  const getAllKeys = async (tool: string): Promise<string[]> => {
    try {
      const db = await openDB();
      const transaction = db.transaction([tool], 'readonly');
      const store = transaction.objectStore(tool);

      const keys = await new Promise<string[]>((resolve, reject) => {
        const request = store.getAllKeys();
        request.onsuccess = () => resolve(request.result as string[]);
        request.onerror = () => reject(request.error);
      });

      db.close();
      return keys;
    } catch (error) {
      console.error(`Erreur récupération clés IndexedDB pour ${tool}:`, error);
      return [];
    }
  };

  const exportAllData = async (): Promise<Record<string, any>> => {
    try {
      const db = await openDB();
      const allData: Record<string, any> = {};

      for (const storeConfig of config.stores) {
        const transaction = db.transaction([storeConfig.name], 'readonly');
        const store = transaction.objectStore(storeConfig.name);

        const data = await new Promise<StoredItem[]>((resolve, reject) => {
          const request = store.getAll();
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });

        allData[storeConfig.name] = data;
      }

      db.close();
      return allData;
    } catch (error) {
      console.error('Erreur export toutes données IndexedDB:', error);
      return {};
    }
  };

  const clearAllData = async (): Promise<boolean> => {
    try {
      const db = await openDB();
      
      for (const storeConfig of config.stores) {
        const transaction = db.transaction([storeConfig.name], 'readwrite');
        const store = transaction.objectStore(storeConfig.name);

        await new Promise<void>((resolve, reject) => {
          const request = store.clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }

      db.close();
      return true;
    } catch (error) {
      console.error('Erreur nettoyage toutes données IndexedDB:', error);
      return false;
    }
  };

  const getStorageInfo = async (): Promise<{ estimatedSize: number; quota: number }> => {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return {
          estimatedSize: estimate.usage || 0,
          quota: estimate.quota || 0
        };
      }
      return { estimatedSize: 0, quota: 0 };
    } catch (error) {
      console.error('Erreur info stockage:', error);
      return { estimatedSize: 0, quota: 0 };
    }
  };

  const isInitialized = true; // IndexedDB est toujours disponible dans les navigateurs modernes
  const isLoading = false; // Pas de chargement initial pour IndexedDB

  return {
    saveData,
    loadData,
    deleteData,
    getAllKeys,
    exportAllData,
    clearAllData,
    getStorageInfo,
    isInitialized,
    isLoading
  };
};
