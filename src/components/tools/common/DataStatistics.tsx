
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AppStatistics {
  totalTools: number;
  totalDataPoints: number;
  storageUsed: number;
  storageQuota: number;
  lastActivity: string;
  toolsStats: Record<string, { itemCount: number; lastUpdated: string }>;
}

interface DataStatisticsProps {
  stats: AppStatistics;
}

export const DataStatistics = ({ stats }: DataStatisticsProps) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const storagePercentage = Math.round((stats.storageUsed / Math.max(stats.storageQuota, 1)) * 100);

  const getProgressBarClass = (percentage: number) => {
    if (percentage > 80) return 'bg-red-500';
    if (percentage > 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
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
  );
};
