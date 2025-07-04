
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';
import { AppSettings } from '@/components/tools/common/AppSettings';
import { LLMSettings } from '@/components/tools/productivity/components/LLMSettings';

const Settings = () => {
  return (
    <div className="space-y-6">
      {/* En-tête simplifié */}
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-xl">
            <SettingsIcon className="w-5 h-5 text-blue-600" />
            Paramètres Utilisateur
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gérez vos préférences personnelles
          </p>
        </CardHeader>
      </Card>

      {/* Paramètres de l'application */}
      <AppSettings />

      {/* Configuration des modèles LLM - maintenant intégrée directement */}
      <LLMSettings />

      {/* Note d'information */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">💡 Conseil</p>
            <p>Pour gérer vos données et effectuer des exports/imports complets, utilisez le "Gestionnaire de Données" accessible depuis le menu principal.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
