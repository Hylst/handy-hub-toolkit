
import { useCallback, useEffect } from 'react';

export const useIndexedDBFix = () => {
  const fixDatabase = useCallback(async () => {
    try {
      // Supprimer les anciennes bases de données corrompues
      const databases = ['ToolsAppDatabase', 'tools-app-db'];
      
      for (const dbName of databases) {
        try {
          const deleteRequest = indexedDB.deleteDatabase(dbName);
          deleteRequest.onsuccess = () => {
            console.log(`✅ Base de données ${dbName} supprimée avec succès`);
          };
          deleteRequest.onerror = () => {
            console.log(`⚠️ Impossible de supprimer ${dbName} (peut-être inexistante)`);
          };
        } catch (error) {
          console.log(`⚠️ Erreur lors de la suppression de ${dbName}:`, error);
        }
      }

      // Attendre un peu pour que les suppressions se terminent
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Créer une nouvelle base de données avec la structure correcte
      const request = indexedDB.open('ToolsAppDatabase', 12);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Créer les object stores nécessaires
        const storeConfigs = [
          'productivity-tasks',
          'productivity-goals', 
          'productivity-notes',
          'productivity-pomodoro',
          'password-generator-advanced',
          'calculator-history',
          'qr-generator-history',
          'unit-converter-history',
          'date-calculator-history',
          'creativity-logos',
          'creativity-colors',
          'creativity-gradients',
          'creativity-patterns',
          'user-preferences',
          'export-history',
          'text-utils-advanced',
          'health-wellness-suite'
        ];

        storeConfigs.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: 'id' });
            store.createIndex('timestamp', 'timestamp');
            store.createIndex('tool', 'tool');
            console.log(`✅ Object store créé: ${storeName}`);
          }
        });
      };

      request.onsuccess = () => {
        console.log('✅ Base de données IndexedDB réparée avec succès');
        request.result.close();
      };

      request.onerror = (error) => {
        console.error('❌ Erreur lors de la réparation IndexedDB:', error);
      };

    } catch (error) {
      console.error('❌ Erreur critique lors de la réparation IndexedDB:', error);
    }
  }, []);

  useEffect(() => {
    // Réparer automatiquement au chargement
    fixDatabase();
  }, [fixDatabase]);

  return { fixDatabase };
};
