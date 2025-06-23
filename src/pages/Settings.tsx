
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon } from 'lucide-react';
import { AppSettings } from '@/components/tools/common/AppSettings';
import { UniversalDataManager } from '@/components/tools/common/UniversalDataManager';

const Settings = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* En-tête */}
        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl">
              <SettingsIcon className="w-6 h-6 text-blue-600" />
              Paramètres de l'Application
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gérez vos préférences et vos données
            </p>
          </CardHeader>
        </Card>

        {/* Paramètres de l'application */}
        <AppSettings />

        <Separator className="my-6" />

        {/* Gestionnaire de données universel */}
        <UniversalDataManager />
      </div>
    </div>
  );
};

export default Settings;
