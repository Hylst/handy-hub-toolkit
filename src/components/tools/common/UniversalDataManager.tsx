
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

  // Charger les statistiques avec un debounce simple
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const loadStats = async () => {
      try {
        const [universalStats, storageStats] = await Promise.all([
          getUniversalStats(),
          getStorageStats()
        ]);
        
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

    // Chargement initial immédiat
    loadStats();
    
    // Ensuite rafraîchir toutes les minutes seulement
    const interval = setInterval(() => {
      timeoutId = setTimeout(loadStats, 500); // Debounce de 500ms
    }, 60000); // Toutes les 60 secondes
    
    return () => {
      clearInterval(interval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [getUniversalStats, getStorageStats]);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      await exportUniversalData({
        includeHistory: true,
        includePreferences: true
      });
      
      toast({
        title: "Export réussi",
        description: "Toutes les données ont été exportées",
      });
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les données",
        variant: "destructive",
      });
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
        toast({
          title: "Import réussi",
          description: "Les données ont été importées avec succès",
        });
        
        // Recharger les stats après un court délai
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      toast({
        title: "Erreur d'import",
        description: "Impossible d'importer les données",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
        
        setStats(null);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      toast({
        title: "Erreur de réinitialisation",
        description: "Impossible de supprimer toutes les données",
        variant: "destructive",
      });
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
              Gestionnaire Universel des Données (v2.2)
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
          <CardTitle className="text-sm">🚀 Nouvelles Fonctionnalités v2.2</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xs space-y-1">
            <div>✅ <strong>IndexedDB unifié:</strong> Migration complète vers Dexie</div>
            <div>✅ <strong>Performance optimisée:</strong> Réduction des appels redondants</div>
            <div>✅ <strong>Tests stabilisés:</strong> Suppression des hooks non initialisés</div>
            <div>✅ <strong>Interface cohérente:</strong> Cartes d'outils uniformisées</div>
            <div>✅ <strong>Debouncing amélioré:</strong> Moins de charge système</div>
            <div>✅ <strong>Gestion d'erreurs:</strong> Messages plus clairs</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
