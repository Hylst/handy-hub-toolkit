
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

// Base de données Dexie
class ToolsDatabase extends Dexie {
  storedData!: Table<StoredData>;
  userPreferences!: Table<UserPreference>;
  exportHistory!: Table<ExportHistory>;

  constructor() {
    super('ToolsAppDatabase');
    
    this.version(1).stores({
      storedData: '&id, tool, timestamp, synced',
      userPreferences: '&id, tool, timestamp',
      exportHistory: '&id, type, timestamp'
    });
  }
}

// Instance singleton
export const db = new ToolsDatabase();

// Hook pour utiliser Dexie
export const useDexieDB = () => {
  const calculateChecksum = (data: any): string => {
    try {
      // Utiliser encodeURIComponent au lieu de btoa pour gérer les caractères spéciaux
      const jsonString = JSON.stringify(data);
      const encoded = encodeURIComponent(jsonString);
      // Créer un hash simple à partir de la chaîne encodée
      let hash = 0;
      for (let i = 0; i < encoded.length; i++) {
        const char = encoded.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convertir en 32bit integer
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
      return false;
    }
  };

  const loadData = async (tool: string): Promise<any> => {
    try {
      const id = `${tool}-main`;
      const record = await db.storedData.get(id);
      
      if (record) {
        // Vérifier la checksum
        const calculatedChecksum = calculateChecksum(record.data);
        if (record.checksum && record.checksum !== calculatedChecksum) {
          console.warn(`⚠️ Checksum invalide pour ${tool}`);
          return null;
        }
        
        console.log(`✅ Données chargées avec Dexie pour ${tool}`);
        return record.data;
      }
      
      return null;
    } catch (error) {
      console.error(`❌ Erreur de chargement Dexie pour ${tool}:`, error);
      return null;
    }
  };

  const deleteData = async (tool: string): Promise<boolean> => {
    try {
      const id = `${tool}-main`;
      await db.storedData.delete(id);
      console.log(`🗑️ Données supprimées avec Dexie pour ${tool}`);
      return true;
    } catch (error) {
      console.error(`❌ Erreur de suppression Dexie pour ${tool}:`, error);
      return false;
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
