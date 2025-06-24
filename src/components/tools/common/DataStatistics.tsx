
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, HardDrive, Clock, Archive } from 'lucide-react';
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
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const storagePercentage = stats.storageQuota > 0 
    ? Math.round((stats.storageUsed / stats.storageQuota) * 100)
    : 0;

  return (
    <Card className="border-2 border-green-200 dark:border-green-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="w-5 h-5 text-green-600" />
          Statistiques de Stockage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Statistiques principales */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-blue-600">{stats.totalTools}</div>
            <div className="text-xs text-gray-500">Outils actifs</div>
          </div>
          
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-green-600">{stats.totalDataPoints}</div>
            <div className="text-xs text-gray-500">Éléments stockés</div>
          </div>
          
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-orange-600">
              {formatBytes(stats.storageUsed)}
            </div>
            <div className="text-xs text-gray-500">Espace utilisé</div>
          </div>
          
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-purple-600">{storagePercentage}%</div>
            <div className="text-xs text-gray-500">Quota utilisé</div>
          </div>
        </div>

        {/* Barre de progression du stockage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <HardDrive className="w-4 h-4" />
              Stockage
            </span>
            <span className="text-gray-500">
              {formatBytes(stats.storageUsed)} / {formatBytes(stats.storageQuota)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                storagePercentage > 80 
                  ? 'bg-red-500' 
                  : storagePercentage > 60 
                    ? 'bg-orange-500' 
                    : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(storagePercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Dernière activité */}
        <div className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>Dernière activité</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {format(new Date(stats.lastActivity), "dd/MM/yyyy 'à' HH:mm", { locale: fr })}
          </Badge>
        </div>

        {/* Liste des outils avec données */}
        {Object.keys(stats.toolsStats).length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Archive className="w-4 h-4" />
              Outils avec données ({Object.keys(stats.toolsStats).length})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {Object.entries(stats.toolsStats).map(([tool, stats]) => (
                <div key={tool} className="flex items-center justify-between text-xs bg-gray-50 dark:bg-gray-800 rounded p-2">
                  <span className="font-medium capitalize">{tool.replace('-', ' ')}</span>
                  <Badge variant="secondary" className="text-xs">
                    {stats.itemCount} items
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
