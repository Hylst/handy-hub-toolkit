
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

  const loadData = async (tool: string, key: string): Promise<{ data: any } | null> => {
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
        return { data: result.data };
      }
      return null;
    } catch (error) {
      console.error(`Erreur chargement IndexedDB pour ${tool}:`, error);
      return null;
    }
  };

  const isInitialized = true; // IndexedDB est toujours disponible dans les navigateurs modernes

  return {
    saveData,
    loadData,
    isInitialized
  };
};
