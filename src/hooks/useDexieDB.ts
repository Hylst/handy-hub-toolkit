import Dexie, { Table } from 'dexie';

// Types pour la base de données
export interface StoredData {
  id: string;
  tool: string;
  data: any;
  timestamp: number;
  lastModified: string;
  checksum?: string;
  synced: boolean;
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

// Base de données Dexie avec version corrigée
class ToolsDatabase extends Dexie {
  storedData!: Table<StoredData>;
  userPreferences!: Table<UserPreference>;
  exportHistory!: Table<ExportHistory>;

  constructor() {
    super('ToolsAppDatabase');
    
    // Version augmentée pour corriger le problème de schéma
    this.version(15).stores({
      storedData: '&id, tool, timestamp, synced',
      userPreferences: '&id, tool, timestamp',
      exportHistory: '&id, type, timestamp'
    });
  }
}

// Instance singleton
export const db = new ToolsDatabase();

// Hook pour utiliser Dexie avec gestion d'erreur améliorée
export const useDexieDB = () => {
  const calculateChecksum = (data: any): string => {
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
  };

  const saveData = async (tool: string, data: any): Promise<boolean> => {
    try {
      const id = `${tool}-main`;
      const timestamp = Date.now();
      const checksum = calculateChecksum(data);
      
      await db.storedData.put({
        id,
        tool,
        data,
        timestamp,
        lastModified: new Date().toISOString(),
        checksum,
        synced: false
      });
      
      console.log(`✅ Données sauvegardées avec Dexie pour ${tool}`);
      return true;
    } catch (error) {
      console.error(`❌ Erreur Dexie pour ${tool}:`, error);
      
      // Fallback vers localStorage si Dexie échoue
      try {
        localStorage.setItem(`dexie-fallback-${tool}`, JSON.stringify(data));
        console.log(`📦 Fallback localStorage pour ${tool}`);
        return true;
      } catch (localError) {
        console.error(`❌ Erreur localStorage pour ${tool}:`, localError);
        return false;
      }
    }
  };

  const loadData = async (tool: string): Promise<any> => {
    try {
      const id = `${tool}-main`;
      const record = await db.storedData.get(id);
      
      if (record) {
        const calculatedChecksum = calculateChecksum(record.data);
        if (record.checksum && record.checksum !== calculatedChecksum) {
          console.warn(`⚠️ Checksum invalide pour ${tool}`);
        }
        
        console.log(`✅ Données chargées avec Dexie pour ${tool}`);
        return record.data;
      }
      
      // Fallback vers localStorage si pas de données Dexie
      try {
        const fallbackData = localStorage.getItem(`dexie-fallback-${tool}`);
        if (fallbackData) {
          console.log(`📦 Fallback chargé depuis localStorage pour ${tool}`);
          return JSON.parse(fallbackData);
        }
      } catch (localError) {
        console.warn(`⚠️ Erreur localStorage fallback pour ${tool}:`, localError);
      }
      
      return null;
    } catch (error) {
      console.error(`❌ Erreur de chargement Dexie pour ${tool}:`, error);
      
      // Fallback vers localStorage
      try {
        const fallbackData = localStorage.getItem(`dexie-fallback-${tool}`);
        if (fallbackData) {
          console.log(`📦 Fallback chargé depuis localStorage pour ${tool}`);
          return JSON.parse(fallbackData);
        }
      } catch (localError) {
        console.warn(`⚠️ Erreur localStorage fallback pour ${tool}:`, localError);
      }
      
      return null;
    }
  };

  const deleteData = async (tool: string): Promise<boolean> => {
    try {
      const id = `${tool}-main`;
      await db.storedData.delete(id);
      
      // Nettoyer aussi le fallback localStorage
      localStorage.removeItem(`dexie-fallback-${tool}`);
      
      console.log(`🗑️ Données supprimées avec Dexie pour ${tool}`);
      return true;
    } catch (error) {
      console.error(`❌ Erreur de suppression Dexie pour ${tool}:`, error);
      
      // Fallback vers localStorage
      try {
        localStorage.removeItem(`dexie-fallback-${tool}`);
        return true;
      } catch (localError) {
        console.error(`❌ Erreur localStorage suppression pour ${tool}:`, localError);
        return false;
      }
    }
  };

  const getAllData = async (): Promise<Record<string, any>> => {
    try {
      const allRecords = await db.storedData.toArray();
      const result: Record<string, any> = {};
      
      allRecords.forEach(record => {
        result[record.tool] = record.data;
      });
      
      return result;
    } catch (error) {
      console.error('❌ Erreur getAllData Dexie:', error);
      return {};
    }
  };

  const clearAllData = async (): Promise<boolean> => {
    try {
      await db.storedData.clear();
      await db.userPreferences.clear();
      console.log('🗑️ Toutes les données Dexie supprimées');
      return true;
    } catch (error) {
      console.error('❌ Erreur clearAllData Dexie:', error);
      return false;
    }
  };

  const getStorageStats = async () => {
    try {
      const dataCount = await db.storedData.count();
      const prefsCount = await db.userPreferences.count();
      const historyCount = await db.exportHistory.count();
      
      // Estimation de la taille
      const allData = await getAllData();
      const estimatedSize = JSON.stringify(allData).length;
      
      return {
        totalRecords: dataCount + prefsCount + historyCount,
        dataRecords: dataCount,
        preferencesRecords: prefsCount,
        historyRecords: historyCount,
        estimatedSize
      };
    } catch (error) {
      console.error('❌ Erreur getStorageStats:', error);
      return null;
    }
  };

  return {
    saveData,
    loadData,
    deleteData,
    getAllData,
    clearAllData,
    getStorageStats,
    db
  };
};
