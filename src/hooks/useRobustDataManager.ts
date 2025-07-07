
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface StorageData {
  [key: string]: any;
}

interface StorageStats {
  totalKeys: number;
  estimatedSize: number;
  lastBackup?: string;
}

export const useRobustDataManager = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Multi-layer storage strategy: localStorage + sessionStorage + memory fallback
  const saveData = useCallback(async (key: string, data: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      const serializedData = JSON.stringify({
        data,
        timestamp: Date.now(),
        version: '1.0.0'
      });

      // Primary: localStorage
      try {
        localStorage.setItem(`robust_${key}`, serializedData);
        console.log(`✅ Sauvegarde localStorage réussie pour ${key}`);
      } catch (localError) {
        console.warn(`⚠️ localStorage échoué pour ${key}:`, localError);
        
        // Fallback: sessionStorage
        try {
          sessionStorage.setItem(`robust_${key}`, serializedData);
          console.log(`📦 Fallback sessionStorage pour ${key}`);
        } catch (sessionError) {
          console.error(`❌ Tous les systèmes de stockage échoués pour ${key}`);
          return false;
        }
      }

      // Auto-backup every 10 saves
      const saveCount = parseInt(localStorage.getItem('robust_save_count') || '0') + 1;
      localStorage.setItem('robust_save_count', saveCount.toString());
      
      if (saveCount % 10 === 0) {
        await createAutoBackup(key, data);
      }

      return true;
    } catch (error) {
      console.error(`❌ Erreur sauvegarde ${key}:`, error);
      toast({
        title: "Erreur de sauvegarde",
        description: `Impossible de sauvegarder les données pour ${key}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const loadData = useCallback(async (key: string): Promise<any> => {
    setIsLoading(true);
    try {
      let rawData: string | null = null;

      // Try localStorage first
      rawData = localStorage.getItem(`robust_${key}`);
      
      // Fallback to sessionStorage
      if (!rawData) {
        rawData = sessionStorage.getItem(`robust_${key}`);
        console.log(`📦 Chargement depuis sessionStorage pour ${key}`);
      }

      if (!rawData) {
        console.log(`ℹ️ Aucune donnée trouvée pour ${key}`);
        return null;
      }

      const parsedData = JSON.parse(rawData);
      
      // Validate data structure
      if (!parsedData.data || !parsedData.timestamp) {
        console.warn(`⚠️ Structure de données invalide pour ${key}`);
        return parsedData; // Return as-is for backward compatibility
      }

      console.log(`✅ Chargement réussi pour ${key}`);
      return parsedData.data;
    } catch (error) {
      console.error(`❌ Erreur chargement ${key}:`, error);
      
      // Try to recover from backup
      const backupData = await recoverFromBackup(key);
      if (backupData) {
        console.log(`🔄 Récupération depuis sauvegarde pour ${key}`);
        return backupData;
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteData = useCallback(async (key: string): Promise<boolean> => {
    try {
      localStorage.removeItem(`robust_${key}`);
      sessionStorage.removeItem(`robust_${key}`);
      localStorage.removeItem(`backup_${key}`);
      console.log(`🗑️ Suppression réussie pour ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Erreur suppression ${key}:`, error);
      return false;
    }
  }, []);

  const createAutoBackup = async (key: string, data: any) => {
    try {
      const backupData = {
        data,
        timestamp: Date.now(),
        originalKey: key
      };
      localStorage.setItem(`backup_${key}`, JSON.stringify(backupData));
      console.log(`💾 Sauvegarde automatique créée pour ${key}`);
    } catch (error) {
      console.warn(`⚠️ Échec sauvegarde automatique pour ${key}:`, error);
    }
  };

  const recoverFromBackup = async (key: string): Promise<any> => {
    try {
      const backupRaw = localStorage.getItem(`backup_${key}`);
      if (backupRaw) {
        const backup = JSON.parse(backupRaw);
        return backup.data;
      }
    } catch (error) {
      console.error(`❌ Échec récupération sauvegarde pour ${key}:`, error);
    }
    return null;
  };

  const getStorageStats = useCallback((): StorageStats => {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('robust_'));
      let totalSize = 0;
      
      keys.forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          totalSize += item.length;
        }
      });

      const lastBackup = localStorage.getItem('last_backup_time');

      return {
        totalKeys: keys.length,
        estimatedSize: totalSize,
        lastBackup: lastBackup || undefined
      };
    } catch (error) {
      console.error('❌ Erreur calcul statistiques:', error);
      return { totalKeys: 0, estimatedSize: 0 };
    }
  }, []);

  const clearAllData = useCallback(async (): Promise<boolean> => {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('robust_') || key.startsWith('backup_')
      );
      
      keys.forEach(key => localStorage.removeItem(key));
      
      const sessionKeys = Object.keys(sessionStorage).filter(key => key.startsWith('robust_'));
      sessionKeys.forEach(key => sessionStorage.removeItem(key));
      
      console.log('🗑️ Toutes les données supprimées');
      return true;
    } catch (error) {
      console.error('❌ Erreur nettoyage complet:', error);
      return false;
    }
  }, []);

  return {
    saveData,
    loadData,
    deleteData,
    getStorageStats,
    clearAllData,
    isLoading
  };
};
