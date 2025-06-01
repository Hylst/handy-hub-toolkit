
import { useCallback } from 'react';
import { useAppDatabase } from './useAppDatabase';
import { useToast } from './use-toast';

interface UniversalExportData {
  exportDate: string;
  appVersion: string;
  tools: {
    [toolName: string]: {
      data: any;
      metadata: {
        lastUpdated: string;
        itemCount: number;
        size: number;
      };
    };
  };
  preferences: any;
  totalSize: number;
}

interface ExportOptions {
  includeHistory?: boolean;
  includePreferences?: boolean;
  selectedTools?: string[];
  format?: 'json' | 'compressed';
}

export const useUniversalExportImport = () => {
  const { toast } = useToast();
  const { 
    exportAllData, 
    clearAllData, 
    saveData, 
    loadData, 
    getAllKeys,
    getStorageInfo,
    isInitialized 
  } = useAppDatabase();

  // Export universel de toutes les données
  const exportAllAppData = useCallback(async (options: ExportOptions = {}) => {
    if (!isInitialized) {
      toast({
        title: "Base de données non prête",
        description: "Veuillez patienter pendant l'initialisation",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('🚀 Début de l\'export universel...');
      
      // Récupérer toutes les données de la base
      const allData = await exportAllData();
      
      // Récupérer les informations de stockage
      const storageInfo = await getStorageInfo();
      
      const exportData: UniversalExportData = {
        exportDate: new Date().toISOString(),
        appVersion: "2.0.0",
        tools: {},
        preferences: allData.data['user-preferences'] || {},
        totalSize: storageInfo?.usage || 0
      };

      // Traiter chaque outil
      for (const [storeName, storeData] of Object.entries(allData.data)) {
        if (storeName === 'user-preferences') continue;
        
        // Appliquer les filtres d'export
        if (options.selectedTools && !options.selectedTools.includes(storeName)) {
          continue;
        }

        const dataEntries = Object.entries(storeData || {});
        
        exportData.tools[storeName] = {
          data: storeData,
          metadata: {
            lastUpdated: dataEntries.length > 0 
              ? Math.max(...dataEntries.map(([_, entry]: [string, any]) => 
                  new Date(entry.timestamp || 0).getTime()
                )).toString()
              : new Date().toISOString(),
            itemCount: dataEntries.length,
            size: JSON.stringify(storeData).length
          }
        };
      }

      // Créer le fichier d'export
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `outils-app-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Sauvegarder l'historique d'export
      await saveData('export-history', `export-${Date.now()}`, {
        timestamp: Date.now(),
        type: 'full-export',
        toolsCount: Object.keys(exportData.tools).length,
        totalSize: exportData.totalSize,
        options
      });

      toast({
        title: "Export réussi",
        description: `${Object.keys(exportData.tools).length} outils exportés avec succès`,
      });

      console.log('✅ Export universel terminé:', exportData);
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'export universel:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les données de l'application",
        variant: "destructive",
      });
    }
  }, [isInitialized, exportAllData, getStorageInfo, saveData, toast]);

  // Import universel des données
  const importAllAppData = useCallback(async (file: File, options: { mergeMode?: 'replace' | 'merge' } = {}) => {
    if (!isInitialized) {
      toast({
        title: "Base de données non prête",
        description: "Veuillez patienter pendant l'initialisation",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log('🚀 Début de l\'import universel...');
      
      const text = await file.text();
      const importData: UniversalExportData = JSON.parse(text);
      
      // Vérifier la structure des données
      if (!importData.tools || !importData.exportDate) {
        throw new Error('Format de fichier incorrect - structure invalide');
      }

      let importedToolsCount = 0;
      let failedImports: string[] = [];

      // Importer les données de chaque outil
      for (const [toolName, toolData] of Object.entries(importData.tools)) {
        try {
          // En mode remplacement, on sauvegarde directement
          // En mode fusion, on pourrait implémenter une logique plus complexe
          for (const [dataKey, dataValue] of Object.entries(toolData.data)) {
            await saveData(toolName, dataKey, dataValue);
          }
          
          importedToolsCount++;
          console.log(`✅ Import réussi pour ${toolName}:`, toolData.metadata);
          
        } catch (error) {
          console.error(`❌ Erreur lors de l'import de ${toolName}:`, error);
          failedImports.push(toolName);
        }
      }

      // Importer les préférences si disponibles
      if (importData.preferences && Object.keys(importData.preferences).length > 0) {
        try {
          for (const [prefKey, prefValue] of Object.entries(importData.preferences)) {
            await saveData('user-preferences', prefKey, prefValue);
          }
          console.log('✅ Préférences importées');
        } catch (error) {
          console.error('❌ Erreur lors de l\'import des préférences:', error);
        }
      }

      // Sauvegarder l'historique d'import
      await saveData('export-history', `import-${Date.now()}`, {
        timestamp: Date.now(),
        type: 'full-import',
        toolsCount: importedToolsCount,
        failedImports,
        sourceExportDate: importData.exportDate,
        sourceVersion: importData.appVersion
      });

      if (failedImports.length > 0) {
        toast({
          title: "Import partiellement réussi",
          description: `${importedToolsCount} outils importés, ${failedImports.length} échecs`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Import réussi",
          description: `${importedToolsCount} outils importés avec succès`,
        });
      }

      console.log('✅ Import universel terminé');
      return true;
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'import universel:', error);
      toast({
        title: "Erreur d'import",
        description: "Format de fichier incorrect ou données corrompues",
        variant: "destructive",
      });
      return false;
    }
  }, [isInitialized, saveData, toast]);

  // Réinitialiser toutes les données
  const resetAllAppData = useCallback(async () => {
    if (!isInitialized) {
      toast({
        title: "Base de données non prête",
        description: "Veuillez patienter pendant l'initialisation",
        variant: "destructive",
      });
      return false;
    }

    try {
      await clearAllData();
      
      // Sauvegarder l'action de reset
      await saveData('export-history', `reset-${Date.now()}`, {
        timestamp: Date.now(),
        type: 'full-reset',
        action: 'all-data-cleared'
      });

      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la réinitialisation:', error);
      return false;
    }
  }, [isInitialized, clearAllData, saveData]);

  // Obtenir les statistiques de l'application
  const getAppStatistics = useCallback(async () => {
    if (!isInitialized) return null;

    try {
      const allData = await exportAllData();
      const storageInfo = await getStorageInfo();
      
      const stats = {
        totalTools: Object.keys(allData.data).length,
        totalDataPoints: 0,
        storageUsed: storageInfo?.usage || 0,
        storageQuota: storageInfo?.quota || 0,
        lastActivity: new Date().toISOString(),
        toolsStats: {} as Record<string, { itemCount: number; lastUpdated: string }>
      };

      // Calculer les statistiques par outil
      for (const [toolName, toolData] of Object.entries(allData.data)) {
        const dataEntries = Object.entries(toolData || {});
        stats.totalDataPoints += dataEntries.length;
        
        if (dataEntries.length > 0) {
          const lastUpdated = Math.max(...dataEntries.map(([_, entry]: [string, any]) => 
            new Date(entry.timestamp || 0).getTime()
          ));
          
          stats.toolsStats[toolName] = {
            itemCount: dataEntries.length,
            lastUpdated: new Date(lastUpdated).toISOString()
          };
        }
      }

      return stats;
    } catch (error) {
      console.error('❌ Erreur lors du calcul des statistiques:', error);
      return null;
    }
  }, [isInitialized, exportAllData, getStorageInfo]);

  return {
    exportAllAppData,
    importAllAppData,
    resetAllAppData,
    getAppStatistics,
    isInitialized
  };
};
