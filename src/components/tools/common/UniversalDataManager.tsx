
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Upload, 
  RotateCcw, 
  Database, 
  HardDrive,
  Activity,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { useUniversalExportImport } from '@/hooks/useUniversalExportImport';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const storagePercentage = stats 
    ? Math.round((stats.storageUsed / Math.max(stats.storageQuota, 1)) * 100)
    : 0;

  // Determine progress bar color based on usage
  const getProgressBarClass = (percentage: number) => {
    if (percentage > 80) return 'bg-red-500';
    if (percentage > 60) return 'bg-yellow-500';
    return 'bg-green-500';
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
      {stats && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="w-4 h-4" />
              Statistiques de l'Application
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.totalTools}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Outils</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.totalDataPoints}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Données</div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{formatFileSize(stats.storageUsed)}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Utilisé</div>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{formatFileSize(stats.storageQuota)}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Quota</div>
              </div>
            </div>

            {/* Barre de progression du stockage */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Utilisation du stockage</span>
                <span className="text-sm text-gray-500">{storagePercentage}%</span>
              </div>
              <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${getProgressBarClass(storagePercentage)}`}
                  style={{ width: `${storagePercentage}%` }}
                />
              </div>
              {storagePercentage > 80 && (
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <AlertTriangle className="w-3 h-3" />
                  Stockage presque plein
                </div>
              )}
            </div>

            {/* Dernière activité */}
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Dernière activité : {format(new Date(stats.lastActivity), "dd/MM/yyyy 'à' HH:mm", { locale: fr })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions principales */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <HardDrive className="w-4 h-4" />
            Gestion des Données
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Export */}
            <div className="space-y-2">
              <Button
                onClick={handleExport}
                disabled={isLoading || isResetting}
                className="w-full"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                {isLoading ? 'Export en cours...' : 'Exporter Tout'}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Sauvegarde complète de l'application
              </p>
            </div>

            {/* Import */}
            <div className="space-y-2">
              <div>
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  disabled={isLoading || isResetting}
                  className="w-full"
                  id="universal-import"
                />
                <label
                  htmlFor="universal-import"
                  className="sr-only"
                >
                  Importer un fichier de sauvegarde
                </label>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Restaurer depuis une sauvegarde
              </p>
            </div>
          </div>

          <Separator />

          {/* Reset avec confirmation */}
          <div className="text-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isLoading || isResetting}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {isResetting ? 'Suppression...' : 'Tout Réinitialiser'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Confirmer la réinitialisation
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action va supprimer définitivement TOUTES les données de l'application :
                    <br />
                    • Tous vos projets et tâches
                    <br />
                    • Tous vos objectifs et notes
                    <br />
                    • Tout l'historique des outils
                    <br />
                    • Toutes vos préférences
                    <br /><br />
                    Cette action est irréversible. Voulez-vous continuer ?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReset}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Oui, tout supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-xs text-red-500 mt-2">
              ⚠️ Supprime définitivement toutes les données
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Informations techniques */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="w-4 h-4" />
            Informations Techniques
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm">IndexedDB activé</span>
            <Badge variant="outline" className="text-xs">Performant</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-500" />
            <span className="text-sm">Stockage local sécurisé</span>
            <Badge variant="outline" className="text-xs">Hors ligne</Badge>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-purple-500" />
            <span className="text-sm">Synchronisation automatique</span>
            <Badge variant="outline" className="text-xs">Temps réel</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
