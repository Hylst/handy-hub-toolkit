
import { AppSettings } from '@/components/tools/common/AppSettings';
import { UniversalDataManager } from '@/components/tools/common/UniversalDataManager';
import { ToolContainer } from '@/components/ui/tool-container';
import { ToolHeader } from '@/components/ui/tool-header';
import { Settings } from 'lucide-react';

export const SettingsPage = () => {
  const headerBadges = [
    "Mode offline/online",
    "Synchronisation cloud",
    "Export/Import universel",
    "Gestion des données"
  ];

  return (
    <ToolContainer variant="wide" spacing="lg">
      <div className="space-y-6">
        <ToolHeader
          title="Paramètres & Gestion des Données"
          subtitle="Configurez votre expérience et gérez vos données"
          description="Contrôlez le mode de fonctionnement de l'application, la synchronisation des données et gérez vos exports/imports."
          icon={<Settings className="w-8 h-8" />}
          badges={headerBadges}
          gradient="blue"
        />

        <div className="grid gap-6">
          <AppSettings />
          <UniversalDataManager />
        </div>
      </div>
    </ToolContainer>
  );
};
