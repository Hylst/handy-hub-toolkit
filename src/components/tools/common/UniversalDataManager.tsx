
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';
import { useUniversalExportImport } from '@/hooks/useUniversalExportImport';
import { useToast } from '@/hooks/use-toast';
import { DataStatistics } from './DataStatistics';
import { DataActions } from './DataActions';
import { TechnicalInfo } from './TechnicalInfo';

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
  const {
    exportAllAppData,
    importAllAppData,
    resetAllAppData,
    getAppStatistics,
    isInitialized
  } = useUniversalExportImport();

  const [stats, setStats] = useState<AppStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Charger les statistiques
  useEffect(() => {
    const loadStats = async () => {
      if (isInitialized) {
        const appStats = await getAppStatistics();
        setStats(appStats);
      }
    };

    loadStats();
    
    // Rafraîchir les stats toutes les 30 secondes
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, [isInitialized, getAppStatistics]);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      await exportAllAppData({
        includeHistory: true,
        includePreferences: true,
        format: 'json'
      });
      
      // Rafraîchir les stats après export
      const newStats = await getAppStatistics();
      setStats(newStats);
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
      const success = await importAllAppData(file, { mergeMode: 'replace' });
      
      if (success) {
        // Rafraîchir les stats après import
        const newStats = await getAppStatistics();
        setStats(newStats);
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
      const success = await resetAllAppData();
      
      if (success) {
        toast({
          title: "Réinitialisation terminée",
          description: "Toutes les données ont été supprimées",
        });
        
        // Rafraîchir les stats
        const newStats = await getAppStatistics();
        setStats(newStats);
      }
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
    } finally {
      setIsResetting(false);
    }
  };

  if (!isInitialized) {
    return (
      <Card className="border-2">
        <CardContent className="p-6 text-center">
          <Database className="w-8 h-8 mx-auto mb-4 text-gray-400 animate-pulse" />
          <p className="text-gray-500">Initialisation de la base de données...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Titre principal */}
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="w-5 h-5 text-blue-600" />
            Gestionnaire Universel des Données
          </CardTitle>
        </CardHeader>
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
    </div>
  );
};
