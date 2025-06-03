
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, Database, Wifi } from 'lucide-react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  dbOperations: number;
  networkStatus: 'online' | 'offline';
  lastUpdate: string;
}

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    dbOperations: 0,
    networkStatus: navigator.onLine ? 'online' : 'offline',
    lastUpdate: new Date().toISOString()
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mesurer les performances de rendu
    const startTime = performance.now();
    
    const updateMetrics = () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Estimer l'usage mémoire (approximatif)
      const memoryInfo = (performance as any).memory;
      const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize / 1024 / 1024 : 0;
      
      setMetrics(prev => ({
        ...prev,
        renderTime: Math.round(renderTime * 100) / 100,
        memoryUsage: Math.round(memoryUsage * 100) / 100,
        lastUpdate: new Date().toISOString()
      }));
    };

    // Observer le statut réseau
    const handleOnline = () => setMetrics(prev => ({ ...prev, networkStatus: 'online' }));
    const handleOffline = () => setMetrics(prev => ({ ...prev, networkStatus: 'offline' }));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Mise à jour initiale
    setTimeout(updateMetrics, 100);
    
    // Mise à jour périodique
    const interval = setInterval(() => {
      const memoryInfo = (performance as any).memory;
      const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize / 1024 / 1024 : 0;
      
      setMetrics(prev => ({
        ...prev,
        memoryUsage: Math.round(memoryUsage * 100) / 100,
        lastUpdate: new Date().toISOString()
      }));
    }, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  // Afficher seulement en dev ou sur demande
  if (!isVisible && process.env.NODE_ENV === 'production') {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 w-8 h-8 bg-blue-500 text-white rounded-full text-xs z-50"
        title="Afficher les métriques de performance"
      >
        📊
      </button>
    );
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-2 bg-blue-500 text-white rounded-lg text-xs z-50"
        title="Afficher les métriques de performance"
      >
        Performance
      </button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 border-2 border-blue-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Performance Monitor
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 text-green-600" />
              <span className="text-xs font-medium">Rendu</span>
            </div>
            <div className="text-sm font-bold text-green-600">
              {metrics.renderTime}ms
            </div>
          </div>
          
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="flex items-center justify-center gap-1">
              <Database className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-medium">Mémoire</span>
            </div>
            <div className="text-sm font-bold text-blue-600">
              {metrics.memoryUsage}MB
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="w-3 h-3" />
            <span className="text-xs">Réseau</span>
          </div>
          <Badge variant={metrics.networkStatus === 'online' ? 'default' : 'secondary'}>
            {metrics.networkStatus}
          </Badge>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Dernière MAJ: {new Date(metrics.lastUpdate).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};
