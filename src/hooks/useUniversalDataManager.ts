
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
  const { getAllData, clearAllData, getStorageStats } = useDexieDB();

  // Export universel optimisé
  const exportUniversalData = useCallback(async (options: UniversalExportOptions = {}) => {
    try {
      console.log('🚀 Début export universel optimisé...');
      
      const allData = await getAllData();
      const stats = await getStorageStats();
      
      // Filtrer les outils si spécifié
      let filteredData = allData;
      if (options.selectedTools) {
        filteredData = Object.fromEntries(
          Object.entries(allData).filter(([tool]) => options.selectedTools!.includes(tool))
        );
      }

      const universalData: UniversalData = {
        version: "2.1.0",
        exportDate: new Date().toISOString(),
        application: "Outils Pratiques",
        tools: filteredData,
        metadata: {
          totalSize: stats?.estimatedSize || 0,
          toolCount: Object.keys(filteredData).length,
          exportOptions: options
        }
      };

      const dataString = JSON.stringify(universalData, null, 2);
      
      // Compression optionnelle (simple pour l'instant)
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
  }, [getAllData, getStorageStats, toast]);

  // Import universel optimisé
  const importUniversalData = useCallback(async (file: File, mergeMode: 'replace' | 'merge' = 'replace') => {
    try {
      console.log('🚀 Début import universel optimisé...');
      
      const text = await file.text();
      const universalData: UniversalData = JSON.parse(text);
      
      // Validation
      if (!universalData.tools || !universalData.version) {
        throw new Error('Format de fichier incorrect');
      }

      const { db } = useDexieDB();
      
      // Import en transaction pour assurer la cohérence
      await db.transaction('rw', db.storedData, async () => {
        if (mergeMode === 'replace') {
          // Supprimer les données existantes des outils à importer
          const toolsToImport = Object.keys(universalData.tools);
          for (const tool of toolsToImport) {
            await db.storedData.where('tool').equals(tool).delete();
          }
        }

        // Importer les nouvelles données
        for (const [tool, data] of Object.entries(universalData.tools)) {
          await db.storedData.put({
            id: `${tool}-main`,
            tool,
            data,
            timestamp: Date.now(),
            lastModified: new Date().toISOString(),
            synced: false
          });
        }
      });

      toast({
        title: "Import universel réussi",
        description: `${Object.keys(universalData.tools).length} outils importés`,
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
  }, [toast]);

  // Reset universel
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

  // Statistiques globales
  const getUniversalStats = useCallback(async () => {
    try {
      const stats = await getStorageStats();
      const allData = await getAllData();
      
      return {
        ...stats,
        tools: Object.keys(allData),
        lastActivity: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Erreur stats universelles:', error);
      return null;
    }
  }, [getStorageStats, getAllData]);

  return {
    exportUniversalData,
    importUniversalData,
    resetUniversalData,
    getUniversalStats
  };
};
