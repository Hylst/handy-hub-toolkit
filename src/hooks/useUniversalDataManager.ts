
import { useCallback } from 'react';
import { useDexieDB } from './useDexieDB';
import { useToast } from './use-toast';

interface UniversalExportOptions {
  includeHistory?: boolean;
  includePreferences?: boolean;
  selectedTools?: string[];
  compressed?: boolean;
}

interface UniversalData {
  version: string;
  exportDate: string;
  application: string;
  tools: Record<string, any>;
  metadata: {
    totalSize: number;
    toolCount: number;
    exportOptions: UniversalExportOptions;
  };
}

export const useUniversalDataManager = () => {
  const { toast } = useToast();
  const { getAllData, clearAllData, getStorageStats, db } = useDexieDB();

  // Export universel optimisé avec moins d'appels
  const exportUniversalData = useCallback(async (options: UniversalExportOptions = {}) => {
    try {
      console.log('🚀 Export universel optimisé...');
      
      // Un seul appel pour récupérer toutes les données
      const [allData, stats] = await Promise.all([
        getAllData(),
        getStorageStats()
      ]);
      
      // Filtrage en mémoire pour éviter les appels DB supplémentaires
      const filteredData = options.selectedTools 
        ? Object.fromEntries(
            Object.entries(allData).filter(([tool]) => options.selectedTools!.includes(tool))
          )
        : allData;

      const universalData: UniversalData = {
        version: "2.2.0",
        exportDate: new Date().toISOString(),
        application: "Outils Pratiques",
        tools: filteredData,
        metadata: {
          totalSize: stats?.estimatedSize || 0,
          toolCount: Object.keys(filteredData).length,
          exportOptions: options
        }
      };

      // Export optimisé
      const dataString = JSON.stringify(universalData, null, 2);
      const blob = new Blob([dataString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `outils-pratiques-universal-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      
      URL.revokeObjectURL(url);

      toast({
        title: "Export universel réussi",
        description: `${Object.keys(filteredData).length} outils exportés`,
      });

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
  }, [getAllData, getStorageStats, toast]);

  // Import universel optimisé avec transaction
  const importUniversalData = useCallback(async (file: File, mergeMode: 'replace' | 'merge' = 'replace') => {
    try {
      console.log('🚀 Import universel optimisé...');
      
      const text = await file.text();
      const universalData: UniversalData = JSON.parse(text);
      
      if (!universalData.tools || !universalData.version) {
        throw new Error('Format de fichier incorrect');
      }

      // Transaction unique pour l'import
      await db.transaction('rw', db.storedData, async () => {
        if (mergeMode === 'replace') {
          const toolsToImport = Object.keys(universalData.tools);
          // Suppression par batch pour optimiser
          for (const tool of toolsToImport) {
            await db.storedData.where('tool').equals(tool).delete();
          }
        }

        // Import par batch
        const dataToInsert = Object.entries(universalData.tools).map(([tool, data]) => ({
          id: `${tool}-main`,
          tool,
          data,
          timestamp: Date.now(),
          lastModified: new Date().toISOString(),
          synced: false
        }));

        await db.storedData.bulkPut(dataToInsert);
      });

      toast({
        title: "Import universel réussi",
        description: `${Object.keys(universalData.tools).length} outils importés`,
      });

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
  }, [db, toast]);

  // Reset optimisé
  const resetUniversalData = useCallback(async () => {
    try {
      await clearAllData();
      
      toast({
        title: "Reset universel réussi",
        description: "Toutes les données ont été supprimées",
      });

      return true;
    } catch (error) {
      console.error('❌ Erreur reset universel:', error);
      toast({
        title: "Erreur de reset",
        description: "Impossible de supprimer toutes les données",
        variant: "destructive",
      });
      return false;
    }
  }, [clearAllData, toast]);

  // Statistiques mises en cache
  const getUniversalStats = useCallback(async () => {
    try {
      const [stats, allData] = await Promise.all([
        getStorageStats(),
        getAllData()
      ]);
      
      return {
        ...stats,
        tools: Object.keys(allData),
        lastActivity: new Date().toISOString(),
        totalRecords: stats?.totalRecords || 0
      };
    } catch (error) {
      console.error('❌ Erreur stats universelles:', error);
      return {
        totalRecords: 0,
        tools: [],
        lastActivity: new Date().toISOString()
      };
    }
  }, [getStorageStats, getAllData]);

  return {
    exportUniversalData,
    importUniversalData,
    resetUniversalData,
    getUniversalStats
  };
};
