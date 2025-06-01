
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TextAnalyzer } from './textUtils/TextAnalyzer';
import { TextFormatter } from './textUtils/TextFormatter';
import { TextTransformer } from './textUtils/TextTransformer';
import { TextGenerator } from './textUtils/TextGenerator';
import { TextComparator } from './textUtils/TextComparator';
import { MarkdownTools } from './textUtils/MarkdownTools';
import { SEOAnalyzer } from './textUtils/SEOAnalyzer';
import { TextExtractor } from './textUtils/TextExtractor';
import { DataImportExport } from './common/DataImportExport';
import { useOfflineDataManager } from '@/hooks/useOfflineDataManager';
import { FileText, BarChart3, Type, Shuffle, Copy, FileCode, Search, FileDown } from 'lucide-react';

export const TextUtilsAdvanced = () => {
  const {
    data: textUtilsData,
    setData,
    exportData,
    importData,
    resetData,
    isOnline,
    isSyncing,
    lastSyncTime
  } = useOfflineDataManager({
    toolName: 'text-utils-advanced',
    defaultData: {}
  });

  const [activeTab, setActiveTab] = useState('analyzer');

  const handleDataChange = (newData: any) => {
    const updatedData = {
      ...(textUtilsData || {}),
      [activeTab]: newData,
      lastModified: new Date().toISOString()
    };
    setData(updatedData);
  };

  const tabs = [
    {
      id: 'analyzer',
      label: 'Analyseur',
      icon: BarChart3,
      component: TextAnalyzer
    },
    {
      id: 'formatter',
      label: 'Formatage',
      icon: Type,
      component: TextFormatter
    },
    {
      id: 'transformer',
      label: 'Transformation',
      icon: Shuffle,
      component: TextTransformer
    },
    {
      id: 'generator',
      label: 'Générateur',
      icon: Copy,
      component: TextGenerator
    },
    {
      id: 'comparator',
      label: 'Comparaison',
      icon: FileText,
      component: TextComparator
    },
    {
      id: 'markdown',
      label: 'Markdown',
      icon: FileCode,
      component: MarkdownTools
    },
    {
      id: 'seo',
      label: 'SEO',
      icon: Search,
      component: SEOAnalyzer
    },
    {
      id: 'extractor',
      label: 'Extraction',
      icon: FileDown,
      component: TextExtractor
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
            <FileText className="w-5 h-5 text-blue-600" />
            Utilitaires Texte Avancés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Suite complète d'outils pour l'analyse, la transformation et l'optimisation de texte.
          </p>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Tools Panel */}
        <div className="xl:col-span-3">
          <Card>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 h-auto p-1">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="flex flex-col items-center gap-1 p-2 text-xs"
                      >
                        <IconComponent className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                
                {tabs.map((tab) => {
                  const TabComponent = tab.component;
                  return (
                    <TabsContent key={tab.id} value={tab.id} className="p-4 lg:p-6">
                      <TabComponent
                        data={textUtilsData?.[tab.id] || {}}
                        onDataChange={handleDataChange}
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
            toolName="text-utils-advanced"
          />

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Statistiques rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{tabs.length}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Outils disponibles</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-lg font-bold text-green-600">{activeTab}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Outil actif</div>
              </div>
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">💡 Conseil</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Utilisez les différents onglets pour accéder à tous les outils de manipulation de texte. 
                Vos données sont automatiquement sauvegardées.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
