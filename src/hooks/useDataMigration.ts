
import { useCallback } from 'react';
import { useUnifiedDexieManager } from './useUnifiedDexieManager';
import { useToast } from './use-toast';

export const useDataMigration = () => {
  const { saveData } = useUnifiedDexieManager();
  const { toast } = useToast();

  const migrateFromOldSystems = useCallback(async () => {
    try {
      console.log('🔄 Début de la migration des données...');
      let migratedCount = 0;

      // Migrer depuis localStorage (useRobustDataManager)
      const localStorageKeys = Object.keys(localStorage).filter(key => key.startsWith('robust_'));
      for (const key of localStorageKeys) {
        try {
          const rawData = localStorage.getItem(key);
          if (rawData) {
            const parsedData = JSON.parse(rawData);
            const toolName = key.replace('robust_', '');
            
            if (parsedData.data) {
              await saveData(toolName, 'main-data', parsedData.data);
              migratedCount++;
              console.log(`✅ Migré ${toolName} depuis localStorage`);
            }
          }
        } catch (error) {
          console.warn(`⚠️ Erreur migration ${key}:`, error);
        }
      }

      // Migrer depuis l'ancienne base Dexie si elle existe
      try {
        const oldDbName = 'ToolsAppDatabase';
        const oldDbVersion = 15;
        
        const oldDb = indexedDB.open(oldDbName, oldDbVersion);
        oldDb.onsuccess = async (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          
          if (db.objectStoreNames.contains('storedData')) {
            const transaction = db.transaction(['storedData'], 'readonly');
            const store = transaction.objectStore('storedData');
            
            store.getAll().onsuccess = async (getAllEvent) => {
              const records = (getAllEvent.target as IDBRequest).result;
              
              for (const record of records) {
                try {
                  await saveData(record.tool, 'main-data', record.data);
                  migratedCount++;
                  console.log(`✅ Migré ${record.tool} depuis l'ancienne Dexie`);
                } catch (error) {
                  console.warn(`⚠️ Erreur migration Dexie ${record.tool}:`, error);
                }
              }
              
              if (migratedCount > 0) {
                toast({
                  title: "Migration terminée",
                  description: `${migratedCount} éléments ont été migrés vers le nouveau système`,
                });
                console.log(`✅ Migration terminée: ${migratedCount} éléments migrés`);
              }
            };
          }
          
          db.close();
        };
      } catch (error) {
        console.warn('⚠️ Aucune ancienne base Dexie trouvée:', error);
      }

      // Migrer les données spécifiques aux événements depuis IndexedDB
      try {
        const indexedDBRequest = indexedDB.open('ToolsAppDatabase', 12);
        indexedDBRequest.onsuccess = async (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          
          if (db.objectStoreNames.contains('events-planner')) {
            const transaction = db.transaction(['events-planner'], 'readonly');
            const store = transaction.objectStore('events-planner');
            
            store.getAll().onsuccess = async (getAllEvent) => {
              const records = (getAllEvent.target as IDBRequest).result;
              
              for (const record of records) {
                try {
                  await saveData('events-planner', record.id || 'main-data', record.data);
                  migratedCount++;
                  console.log(`✅ Migré événement ${record.id} depuis IndexedDB`);
                } catch (error) {
                  console.warn(`⚠️ Erreur migration événement ${record.id}:`, error);
                }
              }
            };
          }
          
          db.close();
        };
      } catch (error) {
        console.warn('⚠️ Aucune ancienne base IndexedDB trouvée:', error);
      }

      return migratedCount;
    } catch (error) {
      console.error('❌ Erreur générale de migration:', error);
      toast({
        title: "Erreur de migration",
        description: "Une erreur s'est produite lors de la migration des données",
        variant: "destructive",
      });
      return 0;
    }
  }, [saveData, toast]);

  const cleanupOldSystems = useCallback(() => {
    try {
      console.log('🧹 Nettoyage des anciens systèmes...');
      
      // Nettoyer localStorage
      const localStorageKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('robust_') || 
        key.startsWith('backup_') ||
        key.startsWith('dexie-fallback-') ||
        key.startsWith('unified-fallback-')
      );
      
      localStorageKeys.forEach(key => {
        localStorage.removeItem(key);
      });

      // Supprimer les anciennes bases de données
      indexedDB.deleteDatabase('ToolsAppDatabase');
      
      console.log('✅ Nettoyage terminé');
      
      toast({
        title: "Nettoyage terminé",
        description: "Les anciens systèmes de stockage ont été supprimés",
      });
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage:', error);
    }
  }, [toast]);

  return {
    migrateFromOldSystems,
    cleanupOldSystems
  };
};
