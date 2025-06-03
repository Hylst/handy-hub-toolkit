
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Heart, Droplets, Moon, Dumbbell, Apple, Brain, Timer, Target, Activity, Scale } from 'lucide-react';
import { BMICalculatorAdvanced } from './health/BMICalculatorAdvanced';
import { WaterTracker } from './health/WaterTracker';
import { SleepTracker } from './health/SleepTracker';
import { ExerciseTracker } from './health/ExerciseTracker';
import { NutritionTracker } from './health/NutritionTracker';
import { MentalHealthTracker } from './health/MentalHealthTracker';
import { MedicationReminder } from './health/MedicationReminder';
import { FitnessGoals } from './health/FitnessGoals';
import { HealthMetrics } from './health/HealthMetrics';
import { WeightTracker } from './health/WeightTracker';
import { DataImportExport } from './common/DataImportExport';
import { useOfflineDataManager } from '@/hooks/useOfflineDataManager';

export const HealthWellnessSuite = () => {
  console.log('HealthWellnessSuite component loading...');
  
  const {
    data: healthData,
    setData,
    exportData,
    importData,
    resetData,
    isOnline,
    isSyncing,
    lastSyncTime
  } = useOfflineDataManager<Record<string, any>>({
    toolName: 'health-wellness-suite',
    defaultData: {}
  });

  const [activeTab, setActiveTab] = useState('bmi');

  const handleDataChange = (toolName: string, newData: any) => {
    console.log(`Data change for ${toolName}:`, newData);
    const currentData = healthData && typeof healthData === 'object' ? healthData : {};
    const updatedData = {
      ...currentData,
      [toolName]: newData,
      lastModified: new Date().toISOString()
    };
    setData(updatedData);
  };

  const tabs = [
    {
      id: 'bmi',
      label: 'IMC',
      icon: Scale,
      component: BMICalculatorAdvanced,
      category: 'Mesures'
    },
    {
      id: 'weight',
      label: 'Poids',
      icon: Activity,
      component: WeightTracker,
      category: 'Mesures'
    },
    {
      id: 'water',
      label: 'Hydratation',
      icon: Droplets,
      component: WaterTracker,
      category: 'Nutrition'
    },
    {
      id: 'nutrition',
      label: 'Nutrition',
      icon: Apple,
      component: NutritionTracker,
      category: 'Nutrition'
    },
    {
      id: 'sleep',
      label: 'Sommeil',
      icon: Moon,
      component: SleepTracker,
      category: 'Bien-être'
    },
    {
      id: 'exercise',
      label: 'Exercices',
      icon: Dumbbell,
      component: ExerciseTracker,
      category: 'Fitness'
    },
    {
      id: 'goals',
      label: 'Objectifs',
      icon: Target,
      component: FitnessGoals,
      category: 'Fitness'
    },
    {
      id: 'mental',
      label: 'Mental',
      icon: Brain,
      component: MentalHealthTracker,
      category: 'Bien-être'
    },
    {
      id: 'medication',
      label: 'Médicaments',
      icon: Timer,
      component: MedicationReminder,
      category: 'Santé'
    },
    {
      id: 'metrics',
      label: 'Métriques',
      icon: Heart,
      component: HealthMetrics,
      category: 'Santé'
    }
  ];

  const categories = [...new Set(tabs.map(tab => tab.category))];

  console.log('HealthWellnessSuite rendering with tabs:', tabs.length);

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <Card className="border-2 border-green-200 dark:border-green-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
            <Heart className="w-5 h-5 text-green-600" />
            Suite Santé & Bien-être
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Suivez votre santé physique et mentale avec des outils complets de monitoring et d'analyse.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {categories.map(category => (
              <Badge key={category} variant="outline" className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
        {/* Tools Panel */}
        <div className="xl:col-span-3">
          <Card>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-10 h-auto p-1 gap-1">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="flex flex-col items-center gap-1 p-2 text-xs min-h-16"
                      >
                        <IconComponent className="w-4 h-4 flex-shrink-0" />
                        <span className="text-center leading-tight">{tab.label}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                
                {tabs.map((tab) => {
                  const TabComponent = tab.component;
                  return (
                    <TabsContent key={tab.id} value={tab.id} className="p-3 lg:p-6">
                      <TabComponent
                        data={healthData?.[tab.id] || {}}
                        onDataChange={(data: any) => handleDataChange(tab.id, data)}
                      />
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Import/Export */}
          <DataImportExport
            onExport={exportData}
            onImport={importData}
            onReset={resetData}
            isOnline={isOnline}
            isSyncing={isSyncing}
            lastSyncTime={lastSyncTime}
            toolName="health-wellness-suite"
          />

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Vue d'ensemble</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-lg font-bold text-green-600">{tabs.length}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Outils santé</div>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-xs font-medium text-blue-600">{activeTab.replace('-', ' ')}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Outil actif</div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div className="text-lg font-bold text-purple-600">{categories.length}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Catégories</div>
              </div>
            </CardContent>
          </Card>

          {/* Category Guide */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">🏥 Catégories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map(category => {
                const categoryTabs = tabs.filter(tab => tab.category === category);
                return (
                  <div key={category} className="text-xs">
                    <div className="font-medium text-gray-700 dark:text-gray-300">{category}</div>
                    <div className="text-gray-500 dark:text-gray-400 ml-2">
                      {categoryTabs.length} outil{categoryTabs.length > 1 ? 's' : ''}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Health Tips */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">💡 Conseils Santé</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Utilisez ces outils quotidiennement pour maintenir une bonne santé. 
                Consultez toujours un professionnel de santé pour des conseils médicaux personnalisés.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
