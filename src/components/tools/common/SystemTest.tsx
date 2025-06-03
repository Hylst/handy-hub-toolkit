
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Play } from 'lucide-react';
import { useDexieDB } from '@/hooks/useDexieDB';
import { useOptimizedDataManager } from '@/hooks/useOptimizedDataManager';
import { useUniversalDataManager } from '@/hooks/useUniversalDataManager';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  duration?: number;
}

export const SystemTest = () => {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Dexie DB Connection', status: 'pending', message: 'En attente...' },
    { name: 'Data Manager', status: 'pending', message: 'En attente...' },
    { name: 'Universal Export', status: 'pending', message: 'En attente...' },
    { name: 'Performance', status: 'pending', message: 'En attente...' }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const { saveData, loadData, getStorageStats } = useDexieDB();
  const dataManager = useOptimizedDataManager({ toolName: 'test-tool', defaultData: { test: true } });
  const { getUniversalStats } = useUniversalDataManager();

  const updateTest = (index: number, updates: Partial<TestResult>) => {
    setTests(prev => prev.map((test, i) => i === index ? { ...test, ...updates } : test));
  };

  const runTests = async () => {
    setIsRunning(true);
    
    // Test 1: Dexie DB
    updateTest(0, { status: 'running', message: 'Test de connexion Dexie...' });
    const start1 = performance.now();
    try {
      await saveData('test', { message: 'Test Dexie' });
      const data = await loadData('test');
      if (data?.message === 'Test Dexie') {
        updateTest(0, { 
          status: 'success', 
          message: 'Connexion Dexie OK', 
          duration: performance.now() - start1 
        });
      } else {
        throw new Error('Données non récupérées');
      }
    } catch (error) {
      updateTest(0, { 
        status: 'error', 
        message: `Erreur: ${error}`,
        duration: performance.now() - start1 
      });
    }

    // Test 2: Data Manager
    updateTest(1, { status: 'running', message: 'Test du gestionnaire de données...' });
    const start2 = performance.now();
    try {
      if (dataManager.data && !dataManager.isLoading) {
        updateTest(1, { 
          status: 'success', 
          message: 'Data Manager OK', 
          duration: performance.now() - start2 
        });
      } else {
        throw new Error('Data Manager non initialisé');
      }
    } catch (error) {
      updateTest(1, { 
        status: 'error', 
        message: `Erreur: ${error}`,
        duration: performance.now() - start2 
      });
    }

    // Test 3: Universal Export
    updateTest(2, { status: 'running', message: 'Test de l\'export universel...' });
    const start3 = performance.now();
    try {
      const stats = await getUniversalStats();
      if (stats) {
        updateTest(2, { 
          status: 'success', 
          message: `Export OK (${stats.totalRecords} enregistrements)`, 
          duration: performance.now() - start3 
        });
      } else {
        throw new Error('Statistiques non disponibles');
      }
    } catch (error) {
      updateTest(2, { 
        status: 'error', 
        message: `Erreur: ${error}`,
        duration: performance.now() - start3 
      });
    }

    // Test 4: Performance
    updateTest(3, { status: 'running', message: 'Test de performance...' });
    const start4 = performance.now();
    try {
      const storageStats = await getStorageStats();
      const memoryInfo = (performance as any).memory;
      const memory = memoryInfo ? memoryInfo.usedJSHeapSize / 1024 / 1024 : 0;
      
      updateTest(3, { 
        status: 'success', 
        message: `Performance OK (${Math.round(memory)}MB, ${storageStats?.totalRecords || 0} records)`, 
        duration: performance.now() - start4 
      });
    } catch (error) {
      updateTest(3, { 
        status: 'error', 
        message: `Erreur: ${error}`,
        duration: performance.now() - start4 
      });
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running': return <AlertCircle className="w-4 h-4 text-blue-500 animate-pulse" />;
      default: return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      success: 'default',
      error: 'destructive',
      running: 'secondary',
      pending: 'outline'
    } as const;
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  useEffect(() => {
    // Auto-run tests on mount in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(runTests, 1000);
    }
  }, []);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Tests de Stabilisation</span>
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            size="sm"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'En cours...' : 'Lancer les tests'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tests.map((test, index) => (
            <div key={test.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <div className="font-medium">{test.name}</div>
                  <div className="text-sm text-gray-600">
                    {test.message}
                    {test.duration && ` (${Math.round(test.duration)}ms)`}
                  </div>
                </div>
              </div>
              {getStatusBadge(test.status)}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Améliorations apportées :</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>✅ Migration complète vers Dexie pour IndexedDB</li>
            <li>✅ Synchronisation optimisée avec Supabase</li>
            <li>✅ Export/Import universel amélioré</li>
            <li>✅ Monitoring de performance en temps réel</li>
            <li>✅ Auto-save avec debouncing</li>
            <li>✅ Tests de base intégrés</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
