
import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

export interface FallbackStorageManager {
  isInitialized: boolean;
  isLoading: boolean;
  saveData: (storeName: string, key: string, data: any) => Promise<boolean>;
  loadData: (storeName: string, key: string) => Promise<any | null>;
  deleteData: (storeName: string, key: string) => Promise<boolean>;
  getAllKeys: (storeName: string) => Promise<string[]>;
  clearAllData: () => Promise<boolean>;
  exportAllData: () => Promise<any>;
}

export const useFallbackStorage = (): FallbackStorageManager => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Use localStorage as fallback
  const saveData = useCallback(async (storeName: string, key: string, data: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      const storageKey = `${storeName}_${key}`;
      const storedData = {
        id: key,
        data,
        timestamp: Date.now(),
        checksum: btoa(JSON.stringify(data)).slice(0, 16)
      };
      localStorage.setItem(storageKey, JSON.stringify(storedData));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder les données localement",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const loadData = useCallback(async (storeName: string, key: string): Promise<any | null> => {
    setIsLoading(true);
    try {
      const storageKey = `${storeName}_${key}`;
      const stored = localStorage.getItem(storageKey);
      if (!stored) return null;
      
      const parsedData = JSON.parse(stored);
      return parsedData.data;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteData = useCallback(async (storeName: string, key: string): Promise<boolean> => {
    try {
      const storageKey = `${storeName}_${key}`;
      localStorage.removeItem(storageKey);
      return true;
    } catch (error) {
      console.error('Error deleting from localStorage:', error);
      return false;
    }
  }, []);

  const getAllKeys = useCallback(async (storeName: string): Promise<string[]> => {
    try {
      const keys: string[] = [];
      const prefix = `${storeName}_`;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keys.push(key.substring(prefix.length));
        }
      }
      return keys;
    } catch (error) {
      console.error('Error getting keys from localStorage:', error);
      return [];
    }
  }, []);

  const clearAllData = useCallback(async (): Promise<boolean> => {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('_') && !key.startsWith('theme'))) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      toast({
        title: "Données supprimées",
        description: "Toutes les données ont été supprimées avec succès",
      });
      
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }, [toast]);

  const exportAllData = useCallback(async (): Promise<any> => {
    const exportData: any = {};
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('_') && !key.startsWith('theme')) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              exportData[key] = JSON.parse(data);
            } catch {
              exportData[key] = data;
            }
          }
        }
      }
      
      return {
        exportDate: new Date().toISOString(),
        version: 1,
        data: exportData
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      return {};
    }
  }, []);

  return {
    isInitialized: true,
    isLoading,
    saveData,
    loadData,
    deleteData,
    getAllKeys,
    clearAllData,
    exportAllData
  };
};
