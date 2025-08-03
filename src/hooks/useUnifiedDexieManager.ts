
import Dexie, { Table } from 'dexie';
import { useCallback } from 'react';
import { useToast } from './use-toast';

// Enhanced types for the unified database
export interface UnifiedStoredData {
  id: string;
  tool: string;
  data: any;
  timestamp: number;
  lastModified: string;
  checksum?: string;
  synced: boolean;
  version?: string;
}

export interface UserPreference {
  id: string;
  tool: string;
  preferences: any;
  timestamp: number;
}

export interface ExportHistory {
  id: string;
  type: string;
  timestamp: number;
  metadata: any;
}

// Unified Dexie database with proper schema
class UnifiedToolsDatabase extends Dexie {
  storedData!: Table<UnifiedStoredData>;
  userPreferences!: Table<UserPreference>;
  exportHistory!: Table<ExportHistory>;

  constructor() {
    super('UnifiedToolsAppDatabase');
    
    // Single unified version for all tools
    this.version(1).stores({
      storedData: '&id, tool, timestamp, synced, lastModified',
      userPreferences: '&id, tool, timestamp',
      exportHistory: '&id, type, timestamp'
    });
  }
}

// Single database instance
export const unifiedDb = new UnifiedToolsDatabase();

export const useUnifiedDexieManager = () => {
  const { toast } = useToast();

  const calculateChecksum = useCallback((data: any): string => {
    try {
      const jsonString = JSON.stringify(data);
      const encoded = encodeURIComponent(jsonString);
      let hash = 0;
      for (let i = 0; i < encoded.length; i++) {
        const char = encoded.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash).toString(16);
    } catch (error) {
      console.warn('Erreur calcul checksum:', error);
      return Date.now().toString(16);
    }
  }, []);

  const saveData = useCallback(async (tool: string, key: string, data: any): Promise<boolean> => {
    try {
      const id = `${tool}-${key}`;
      const timestamp = Date.now();
      const checksum = calculateChecksum(data);
      
      await unifiedDb.storedData.put({
        id,
        tool,
        data,
        timestamp,
        lastModified: new Date().toISOString(),
        checksum,
        synced: false,
        version: '2.0'
      });
      
      console.log(`✅ Données sauvegardées avec Dexie unifié pour ${tool}:${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Erreur Dexie unifié pour ${tool}:${key}:`, error);
      
      // Fallback vers localStorage si Dexie échoue
      try {
        localStorage.setItem(`unified-fallback-${tool}-${key}`, JSON.stringify(data));
        console.log(`📦 Fallback localStorage pour ${tool}:${key}`);
        return true;
      } catch (localError) {
        console.error(`❌ Erreur localStorage pour ${tool}:${key}:`, localError);
        return false;
      }
    }
  }, [calculateChecksum]);

  const loadData = useCallback(async (tool: string, key: string): Promise<any> => {
    try {
      const id = `${tool}-${key}`;
      const record = await unifiedDb.storedData.get(id);
      
      if (record) {
        const calculatedChecksum = calculateChecksum(record.data);
        if (record.checksum && record.checksum !== calculatedChecksum) {
          console.warn(`⚠️ Checksum invalide pour ${tool}:${key}`);
        }
        
        console.log(`✅ Données chargées avec Dexie unifié pour ${tool}:${key}`);
        return record.data;
      }
      
      // Fallback vers localStorage si pas de données Dexie
      try {
        const fallbackData = localStorage.getItem(`unified-fallback-${tool}-${key}`);
        if (fallbackData) {
          console.log(`📦 Fallback chargé depuis localStorage pour ${tool}:${key}`);
          return JSON.parse(fallbackData);
        }
      } catch (localError) {
        console.warn(`⚠️ Erreur localStorage fallback pour ${tool}:${key}:`, localError);
      }
      
      return null;
    } catch (error) {
      console.error(`❌ Erreur de chargement Dexie unifié pour ${tool}:${key}:`, error);
      
      // Fallback vers localStorage
      try {
        const fallbackData = localStorage.getItem(`unified-fallback-${tool}-${key}`);
        if (fallbackData) {
          console.log(`📦 Fallback chargé depuis localStorage pour ${tool}:${key}`);
          return JSON.parse(fallbackData);
        }
      } catch (localError) {
        console.warn(`⚠️ Erreur localStorage fallback pour ${tool}:${key}:`, localError);
      }
      
      return null;
    }
  }, [calculateChecksum]);

  const deleteData = useCallback(async (tool: string, key: string): Promise<boolean> => {
    try {
      const id = `${tool}-${key}`;
      await unifiedDb.storedData.delete(id);
      
      // Nettoyer aussi le fallback localStorage
      localStorage.removeItem(`unified-fallback-${tool}-${key}`);
      
      console.log(`🗑️ Données supprimées avec Dexie unifié pour ${tool}:${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Erreur de suppression Dexie unifié pour ${tool}:${key}:`, error);
      
      // Fallback vers localStorage
      try {
        localStorage.removeItem(`unified-fallback-${tool}-${key}`);
        return true;
      } catch (localError) {
        console.error(`❌ Erreur localStorage suppression pour ${tool}:${key}:`, localError);
        return false;
      }
    }
  }, []);

  const getAllKeys = useCallback(async (tool: string): Promise<string[]> => {
    try {
      const records = await unifiedDb.storedData.where('tool').equals(tool).toArray();
      return records.map(record => record.id.replace(`${tool}-`, ''));
    } catch (error) {
      console.error(`❌ Erreur getAllKeys Dexie unifié pour ${tool}:`, error);
      return [];
    }
  }, []);

  const exportAllData = useCallback(async (): Promise<Record<string, any>> => {
    try {
      const allRecords = await unifiedDb.storedData.toArray();
      const result: Record<string, any> = {};
      
      allRecords.forEach(record => {
        if (!result[record.tool]) {
          result[record.tool] = {};
        }
        const key = record.id.replace(`${record.tool}-`, '');
        result[record.tool][key] = record.data;
      });
      
      return result;
    } catch (error) {
      console.error('❌ Erreur exportAllData Dexie unifié:', error);
      return {};
    }
  }, []);

  const clearAllData = useCallback(async (): Promise<boolean> => {
    try {
      await unifiedDb.storedData.clear();
      await unifiedDb.userPreferences.clear();
      await unifiedDb.exportHistory.clear();
      console.log('🗑️ Toutes les données Dexie unifié supprimées');
      return true;
    } catch (error) {
      console.error('❌ Erreur clearAllData Dexie unifié:', error);
      return false;
    }
  }, []);

  const getStorageInfo = useCallback(async () => {
    try {
      const dataCount = await unifiedDb.storedData.count();
      const prefsCount = await unifiedDb.userPreferences.count();
      const historyCount = await unifiedDb.exportHistory.count();
      
      // Estimation de la taille
      const allData = await exportAllData();
      const estimatedSize = JSON.stringify(allData).length;
      
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return {
          totalRecords: dataCount + prefsCount + historyCount,
          dataRecords: dataCount,
          preferencesRecords: prefsCount,
          historyRecords: historyCount,
          estimatedSize,
          quota: estimate.quota || 0
        };
      }

      return {
        totalRecords: dataCount + prefsCount + historyCount,
        dataRecords: dataCount,
        preferencesRecords: prefsCount,
        historyRecords: historyCount,
        estimatedSize,
        quota: 0
      };
    } catch (error) {
      console.error('❌ Erreur getStorageInfo Dexie unifié:', error);
      return {
        totalRecords: 0,
        dataRecords: 0,
        preferencesRecords: 0,
        historyRecords: 0,
        estimatedSize: 0,
        quota: 0
      };
    }
  }, [exportAllData]);

  return {
    saveData,
    loadData,
    deleteData,
    getAllKeys,
    exportAllData,
    clearAllData,
    getStorageInfo,
    isInitialized: true,
    isLoading: false,
    db: unifiedDb
  };
};
