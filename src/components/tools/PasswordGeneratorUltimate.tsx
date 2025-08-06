
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { RefreshCw, Save, Settings, Key, History, Star, Shield, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePasswordGeneratorAdvanced } from "./passwordGenerator/hooks/usePasswordGeneratorAdvanced";
import { PasswordDisplayAdvanced } from "./passwordGenerator/PasswordDisplayAdvanced";
import { PasswordSettingsLegacy } from "./passwordGenerator/PasswordSettingsLegacy";
import { PasswordHistoryLegacy } from "./passwordGenerator/PasswordHistoryLegacy";
import { PasswordTemplatesAdvanced } from "./passwordGenerator/PasswordTemplatesAdvanced";
import { PasswordAnalyzer } from "./passwordGenerator/PasswordAnalyzer";
import { DataImportExport } from "./common/DataImportExport";

export const PasswordGeneratorUltimate = () => {
  const {
    currentPassword,
    settings,
    setSettings,
    history,
    templates,
    stats,
    generatePassword,
    applyTemplate,
    toggleFavorite,
    markAsCopied,
    analyzeStrength,
    currentStrength,
    isLoading,
    isOnline,
    isSyncing,
    lastSyncTime,
    exportData,
    importData,
    resetData
  } = usePasswordGeneratorAdvanced();

  const [customPassword, setCustomPassword] = useState('');
  const [activeTab, setActiveTab] = useState('generator');

  const handleCopyPassword = (password: string, entryId?: string) => {
    navigator.clipboard.writeText(password);
    if (entryId) {
      markAsCopied(entryId);
    }
    toast({
      title: "Mot de passe copié !",
      description: "Le mot de passe a été copié dans le presse-papiers.",
    });
  };

  const handleGenerateAndCopy = () => {
    generatePassword();
    if (currentPassword) {
      handleCopyPassword(currentPassword);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
          <p className="text-gray-500">Chargement du générateur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 lg:space-y-6">
      {/* En-tête amélioré */}
      <Card className="shadow-xl border-2 border-purple-200 dark:border-purple-800">
        <CardHeader className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-950/50 dark:via-indigo-950/50 dark:to-blue-950/50">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl">
                <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-200">
                  Générateur de Mots de Passe Ultimate
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Génération avancée avec analyse de sécurité en temps réel
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                <Zap className="w-3 h-3 mr-1" />
                {stats.totalGenerated} générés
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                <Star className="w-3 h-3 mr-1" />
                {stats.averageStrength}% force moy.
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 lg:p-6">
          <PasswordDisplayAdvanced
            password={currentPassword}
            strength={currentStrength}
            onCopy={(password) => handleCopyPassword(password)}
            stats={stats}
          />
        </CardContent>
      </Card>

      {/* Navigation par onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto bg-gray-100 dark:bg-gray-800">
          <TabsTrigger 
            value="generator"
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-3 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-300"
          >
            <Settings className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Générateur</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analyzer"
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-3 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-300"
          >
            <Shield className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Analyseur</span>
          </TabsTrigger>
          <TabsTrigger 
            value="templates"
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-3 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-300"
          >
            <Key className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Templates</span>
          </TabsTrigger>
          <TabsTrigger 
            value="history"
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-3 data-[state=active]:bg-green-100 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900 dark:data-[state=active]:text-green-300"
          >
            <History className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Historique</span>
          </TabsTrigger>
          <TabsTrigger 
            value="export"
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-3 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 dark:data-[state=active]:bg-orange-900 dark:data-[state=active]:text-orange-300"
          >
            <Save className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Export</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <PasswordSettingsLegacy
            settings={settings}
            onSettingsChange={setSettings}
            templates={templates}
            onApplyTemplate={applyTemplate}
          />
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={generatePassword} 
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Générer un mot de passe
            </Button>
            <Button 
              onClick={handleGenerateAndCopy} 
              variant="outline"
              size="lg"
              className="sm:w-auto border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-950/50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Générer & Copier
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="analyzer">
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Shield className="w-5 h-5" />
                Analyseur de Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Testez votre mot de passe :</label>
                <Input
                  type="password"
                  placeholder="Entrez un mot de passe à analyser..."
                  value={customPassword}
                  onChange={(e) => setCustomPassword(e.target.value)}
                  className="font-mono"
                />
              </div>
              <PasswordAnalyzer 
                password={customPassword}
                analyzeStrength={analyzeStrength}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <PasswordTemplatesAdvanced
            templates={templates}
            currentTemplate={settings.template}
            onApplyTemplate={applyTemplate}
          />
        </TabsContent>

        <TabsContent value="history">
          <PasswordHistoryLegacy
            history={history}
            templates={templates}
            onCopy={handleCopyPassword}
            onToggleFavorite={toggleFavorite}
          />
        </TabsContent>

        <TabsContent value="export">
          <DataImportExport
            onExport={exportData}
            onImport={importData}
            onReset={resetData}
            isOnline={isOnline}
            isSyncing={isSyncing}
            lastSyncTime={lastSyncTime}
            toolName="Mots de passe"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
