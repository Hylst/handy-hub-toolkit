
import { useState, useEffect, useCallback } from 'react';
import { useDataSync } from './useDataSync';
import { useToast } from './use-toast';

interface DataManagerOptions {
  toolName: string;
  defaultData?: any;
}

export const useOfflineDataManager = <T>({ toolName, defaultData = null }: DataManagerOptions) => {
  const { toast } = useToast();
  const { saveData, loadData, isOnline, isSyncing, lastSyncTime } = useDataSync(toolName);
  const [data, setData] = useState<T>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données au démarrage
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const loadedData = await loadData();
        if (loadedData) {
          setData(loadedData);
        } else {
          setData(defaultData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [toolName]);

  // Sauvegarder les données
  const updateData = useCallback(async (newData: T) => {
    setData(newData);
    try {
      await saveData(newData);
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder les données",
        variant: "destructive",
      });
    }
  }, [saveData, toast]);

  // Exporter les données en JSON
  const exportData = useCallback(() => {
    try {
      const dataToExport = {
        tool: toolName,
        exportDate: new Date().toISOString(),
        version: "1.0",
        data: data
      };
      
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${toolName}-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export réussi",
        description: "Les données ont été exportées avec succès",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les données",
        variant: "destructive",
      });
    }
  }, [data, toolName, toast]);

  // Importer les données depuis un fichier JSON
  const importData = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const importedData = JSON.parse(text);
      
      // Vérifier la structure des données
      if (!importedData.data || importedData.tool !== toolName) {
        throw new Error('Format de fichier incorrect');
      }
      
      await updateData(importedData.data);
      
      toast({
        title: "Import réussi",
        description: "Les données ont été importées avec succès",
      });
      
      return true;
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Erreur d'import",
        description: "Format de fichier incorrect ou données corrompues",
        variant: "destructive",
      });
      return false;
    }
  }, [toolName, updateData, toast]);

  // Réinitialiser les données
  const resetData = useCallback(async () => {
    await updateData(defaultData);
    toast({
      title: "Données réinitialisées",
      description: "Toutes les données ont été supprimées",
    });
  }, [defaultData, updateData, toast]);

  return {
    data,
    setData: updateData,
    isLoading,
    isOnline,
    isSyncing,
    lastSyncTime,
    exportData,
    importData,
    resetData
  };
};
