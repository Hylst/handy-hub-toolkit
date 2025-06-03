
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';
import { useUniversalDataManager } from '@/hooks/useUniversalDataManager';
import { useDexieDB } from '@/hooks/useDexieDB';
import { useToast } from '@/hooks/use-toast';
import { DataStatistics } from './DataStatistics';
import { DataActions } from './DataActions';
import { TechnicalInfo } from './TechnicalInfo';
import { SystemTest } from './SystemTest';
import { PerformanceMonitor } from './PerformanceMonitor';

interface AppStatistics {
  totalTools: number;
  totalDataPoints: number;
  storageUsed: number;
  storageQuota: number;
  lastActivity: string;
  toolsStats: Record<string, { itemCount: number; lastUpdated: string }>;
}

export const UniversalDataManager = () => {
  const { toast } = useToast();
  const { getStorageStats } = useDexieDB();
  const {
    exportUniversalData,
    importUniversalData,
    resetUniversalData,
    getUniversalStats
  } = useUniversalDataManager();

  const [stats, setStats] = useState<AppStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showTests, setShowTests] = useState(false);

  // Charger les statistiques avec Dexie
  useEffect(() => {
    const loadStats = async () => {
      try {
        const universalStats = await getUniversalStats();
        const storageStats = await getStorageStats();
        
        if (universalStats && storageStats) {
          const mockStats: AppStatistics = {
            totalTools: universalStats.tools?.length || 0,
            totalDataPoints: storageStats.totalRecords,
            storageUsed: storageStats.estimatedSize,
            storageQuota: 50 * 1024 * 1024, // 50MB par défaut
            lastActivity: universalStats.lastActivity || new Date().toISOString(),
            toolsStats: universalStats.tools?.reduce((acc: any, tool: string) => {
              acc[tool] = {
                itemCount: 1,
                lastUpdated: new Date().toISOString()
              };
              return acc;
            }, {}) || {}
          };
          
          setStats(mockStats);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des stats:', error);
      }
    };

    loadStats();
    
    // Rafraîchir les stats toutes les 30 secondes
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, [getUniversalStats, getStorageStats]);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      await exportUniversalData({
        includeHistory: true,
        includePreferences: true
      });
      
      // Rafraîchir les stats après export
      const universalStats = await getUniversalStats();
      if (universalStats) {
        // Mettre à jour les stats...
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const success = await importUniversalData(file, 'replace');
      
      if (success) {
        // Rafraîchir les stats après import
        const universalStats = await getUniversalStats();
        if (universalStats) {
          // Mettre à jour les stats...
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
    } finally {
      setIsLoading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const success = await resetUniversalData();
      
      if (success) {
        toast({
          title: "Réinitialisation terminée",
          description: "Toutes les données ont été supprimées",
        });
        
        // Rafraîchir les stats
        setStats(null);
      }
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Monitor de performance */}
      <PerformanceMonitor />

      {/* Titre principal */}
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              Gestionnaire Universel des Données (v2.1)
            </div>
            <button
              onClick={() => setShowTests(!showTests)}
              className="text-sm bg-green-100 hover:bg-green-200 px-3 py-1 rounded"
            >
              {showTests ? 'Masquer' : 'Tests'}
            </button>
          </CardTitle>
        </CardHeader>
        {showTests && (
          <CardContent>
            <SystemTest />
          </CardContent>
        )}
      </Card>

      {/* Statistiques */}
      {stats && <DataStatistics stats={stats} />}

      {/* Actions principales */}
      <DataActions
        isLoading={isLoading}
        isResetting={isResetting}
        onExport={handleExport}
        onImport={handleImport}
        onReset={handleReset}
      />

      {/* Informations techniques */}
      <TechnicalInfo />

      {/* Nouvelles fonctionnalités */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">🚀 Nouvelles Fonctionnalités v2.1</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xs space-y-1">
            <div>✅ <strong>Dexie Integration:</strong> Base de données IndexedDB plus robuste</div>
            <div>✅ <strong>Auto-save optimisé:</strong> Sauvegarde automatique avec debouncing</div>
            <div>✅ <strong>Sync Supabase:</strong> Synchronisation temps réel améliorée</div>
            <div>✅ <strong>Performance Monitor:</strong> Surveillance en temps réel</div>
            <div>✅ <strong>Tests intégrés:</strong> Validation automatique du système</div>
            <div>✅ <strong>Export/Import universel:</strong> Gestion complète des données</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
