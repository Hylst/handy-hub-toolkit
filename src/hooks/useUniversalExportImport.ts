
import { useCallback } from 'react';
import { useIndexedDBManager } from './useIndexedDBManager';
import { useToast } from './use-toast';

// Configuration pour IndexedDB
const DB_CONFIG = {
  dbName: 'OutilsPratiquesDB',
  version: 1,
  stores: [
    { name: 'calculator', keyPath: 'id' },
    { name: 'passwordGenerator', keyPath: 'id' },
    { name: 'todoList', keyPath: 'id' },
    { name: 'textUtils', keyPath: 'id' },
    { name: 'qrCodeGenerator', keyPath: 'id' },
    { name: 'unitConverter', keyPath: 'id' },
    { name: 'colorGenerator', keyPath: 'id' },
    { name: 'bmiCalculator', keyPath: 'id' },
    { name: 'dateCalculator', keyPath: 'id' },
    { name: 'preferences', keyPath: 'id' }
  ]
};

interface UniversalExportData {
  version: string;
  exportDate: string;
  application: string;
  tools: Record<string, any>;
  preferences: Record<string, any>;
  metadata: {
    totalSize: number;
    toolCount: number;
    exportFormat: string;
  };
}

interface ExportOptions {
  includePreferences?: boolean;
  includeHistory?: boolean;
  selectedTools?: string[];
}

export const useUniversalExportImport = () => {
  const { toast } = useToast();
  const {
    saveData,
    loadData,
    deleteData,
    getAllKeys,
    exportAllData,
    clearAllData,
    getStorageInfo,
    isInitialized
  } = useIndexedDBManager(DB_CONFIG);

  // Export universel optimisé
  const exportUniversalData = useCallback(async (options: ExportOptions = {}) => {
    try {
      if (!isInitialized) {
        throw new Error('IndexedDB non initialisé');
      }

      console.log('🚀 Début export universel...');
      
      // Récupérer toutes les données
      const allToolsData = await exportAllData();
      const storageInfo = await getStorageInfo();
      
      // Filtrer les outils si spécifié
      let toolsToExport = allToolsData;
      if (options.selectedTools && options.selectedTools.length > 0) {
        toolsToExport = Object.fromEntries(
          Object.entries(allToolsData).filter(([tool]) => options.selectedTools!.includes(tool))
        );
      }

      // Préparer les données d'export
      const exportData: UniversalExportData = {
        version: "2.1.0",
        exportDate: new Date().toISOString(),
        application: "Outils Pratiques",
        tools: toolsToExport,
        preferences: options.includePreferences ? (allToolsData.preferences || {}) : {},
        metadata: {
          totalSize: storageInfo.estimatedSize, // Using estimatedSize instead of usage
          toolCount: Object.keys(toolsToExport).length,
          exportFormat: "universal-json"
        }
      };

      // Créer et télécharger le fichier
      const dataString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([dataString], { type: 'application/json' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `outils-pratiques-universal-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Export réussi",
        description: `${Object.keys(toolsToExport).length} outils exportés`,
      });

      console.log('✅ Export universel terminé');
      return true;
    } catch (error) {
      console.error('❌ Erreur export universel:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les données",
        variant: "destructive",
      });
      return false;
    }
  }, [exportAllData, getStorageInfo, isInitialized, toast]);

  // Import universel optimisé
  const importUniversalData = useCallback(async (file: File, mergeMode: 'replace' | 'merge' = 'replace') => {
    try {
      if (!isInitialized) {
        throw new Error('IndexedDB non initialisé');
      }

      console.log('🚀 Début import universel...');
      
      const text = await file.text();
      const importData: UniversalExportData = JSON.parse(text);
      
      // Validation basique
      if (!importData.tools || !importData.version) {
        throw new Error('Format de fichier incorrect');
      }

      // Import des données
      let importCount = 0;
      
      for (const [toolName, toolData] of Object.entries(importData.tools)) {
        if (mergeMode === 'replace') {
          // En mode remplacement, on supprime d'abord les données existantes
          const existingKeys = await getAllKeys(toolName);
          for (const key of existingKeys) {
            await deleteData(toolName, key);
          }
        }
        
        // Sauvegarder les nouvelles données
        const success = await saveData(toolName, 'main', toolData);
        if (success) {
          importCount++;
        }
      }

      // Import des préférences si présentes
      if (importData.preferences && Object.keys(importData.preferences).length > 0) {
        await saveData('preferences', 'main', importData.preferences);
      }

      toast({
        title: "Import réussi",
        description: `${importCount} outils importés`,
      });

      console.log('✅ Import universel terminé');
      return true;
    } catch (error) {
      console.error('❌ Erreur import universel:', error);
      toast({
        title: "Erreur d'import",
        description: "Format de fichier incorrect ou erreur de traitement",
        variant: "destructive",
      });
      return false;
    }
  }, [saveData, deleteData, getAllKeys, isInitialized, toast]);

  // Reset universel
  const resetUniversalData = useCallback(async () => {
    try {
      if (!isInitialized) {
        throw new Error('IndexedDB non initialisé');
      }

      const success = await clearAllData();
      
      if (success) {
        toast({
          title: "Réinitialisation réussie",
          description: "Toutes les données ont été supprimées",
        });
      }

      return success;
    } catch (error) {
      console.error('❌ Erreur reset universel:', error);
      toast({
        title: "Erreur de réinitialisation",
        description: "Impossible de supprimer toutes les données",
        variant: "destructive",
      });
      return false;
    }
  }, [clearAllData, isInitialized, toast]);

  // Obtenir les statistiques de stockage
  const getUniversalStats = useCallback(async () => {
    try {
      if (!isInitialized) {
        return null;
      }

      const allData = await exportAllData();
      const storageInfo = await getStorageInfo();
      
      const toolNames = Object.keys(allData).filter(tool => tool !== 'preferences');
      
      return {
        totalTools: toolNames.length,
        totalDataPoints: Object.values(allData).reduce((total, data) => {
          if (Array.isArray(data)) return total + data.length;
          if (typeof data === 'object' && data !== null) return total + Object.keys(data).length;
          return total + 1;
        }, 0),
        storageUsed: storageInfo.estimatedSize, // Using estimatedSize instead of usage
        storageQuota: storageInfo.quota,
        lastActivity: new Date().toISOString(),
        toolsStats: Object.fromEntries(
          toolNames.map(tool => [
            tool,
            {
              itemCount: Array.isArray(allData[tool]) ? allData[tool].length : 1,
              lastUpdated: new Date().toISOString()
            }
          ])
        )
      };
    } catch (error) {
      console.error('❌ Erreur stats universelles:', error);
      return null;
    }
  }, [exportAllData, getStorageInfo, isInitialized]);

  // Obtenir la liste des outils disponibles
  const getAvailableTools = useCallback(async () => {
    try {
      if (!isInitialized) {
        return [];
      }

      const allData = await exportAllData();
      return Object.keys(allData).filter(tool => tool !== 'preferences');
    } catch (error) {
      console.error('❌ Erreur liste outils:', error);
      return [];
    }
  }, [exportAllData, isInitialized]);

  // Obtenir les données d'un outil spécifique
  const getToolData = useCallback(async (toolName: string) => {
    try {
      if (!isInitialized) {
        return null;
      }

      return await loadData(toolName, 'main');
    } catch (error) {
      console.error(`❌ Erreur données outil ${toolName}:`, error);
      return null;
    }
  }, [loadData, isInitialized]);

  return {
    exportUniversalData,
    importUniversalData,
    resetUniversalData,
    getUniversalStats,
    getAvailableTools,
    getToolData,
    isInitialized
  };
};
