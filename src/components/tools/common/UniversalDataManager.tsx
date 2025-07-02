
import { useState, useEffect, useCallback, useRef } from 'react';
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
  
  const loadingRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Chargement des statistiques optimisé avec debounce
  const loadStats = useCallback(async () => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
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
          storageQuota: 50 * 1024 * 1024,
          lastActivity: universalStats.lastActivity || new Date().toISOString(),
          toolsStats: universalStats.tools?.reduce((acc: Record<string, { itemCount: number; lastUpdated: string }>, tool: string) => {
            acc[tool] = {
              itemCount: 1,
              lastUpdated: new Date().toISOString()
            };
            return acc;
          }, {} as Record<string, { itemCount: number; lastUpdated: string }>) || {}
        };
        
        setStats(mockStats);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    } finally {
      loadingRef.current = false;
    }
  }, [getUniversalStats, getStorageStats]);

  // Chargement initial et rafraîchissement périodique
  useEffect(() => {
    // Chargement immédiat
    loadStats();
    
    // Rafraîchissement toutes les 2 minutes
    const interval = setInterval(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(loadStats, 1000);
    }, 120000);
    
    return () => {
      clearInterval(interval);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loadStats]);

  // Handlers optimisés
  const handleExport = useCallback(async () => {
    setIsLoading(true);
    try {
      const success = await exportUniversalData({
        includeHistory: true,
        includePreferences: true
      });
      
      if (success) {
        toast({
          title: "Export réussi",
          description: "Toutes les données ont été exportées",
        });
      }
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
  }, [exportUniversalData, toast]);

  const handleImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
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
        
        // Recharger les stats après un délai
        setTimeout(loadStats, 2000);
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
  }, [importUniversalData, toast, loadStats]);

  const handleReset = useCallback(async () => {
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
  }, [resetUniversalData, toast]);

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
            <div>✅ <strong>Hooks simplifiés:</strong> Chaîne de dépendances nettoyée</div>
            <div>✅ <strong>Debouncing amélioré:</strong> Moins de charge système</div>
            <div>✅ <strong>Gestion d'erreurs:</strong> Messages plus clairs</div>
            <div>✅ <strong>Transactions optimisées:</strong> Opérations par batch</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
