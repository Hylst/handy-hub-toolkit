
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, Cloud, CloudOff, Download, Upload, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface UserAppSettings {
  offline_mode: boolean;
  sync_enabled: boolean;
  last_sync?: string;
}

export const AppSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<UserAppSettings>({
    offline_mode: false,
    sync_enabled: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Détecter le statut en ligne/hors ligne
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Charger les paramètres utilisateur
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_app_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Erreur lors du chargement des paramètres:', error);
          return;
        }

        if (data) {
          setSettings({
            offline_mode: data.offline_mode || false,
            sync_enabled: data.sync_enabled !== false,
            last_sync: data.last_sync || undefined
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  // Sauvegarder les paramètres
  const saveSettings = async (newSettings: Partial<UserAppSettings>) => {
    if (!user) return;

    setIsSaving(true);
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      const { error } = await supabase
        .from('user_app_settings')
        .upsert({
          user_id: user.id,
          offline_mode: updatedSettings.offline_mode,
          sync_enabled: updatedSettings.sync_enabled,
          last_sync: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      setSettings(updatedSettings);
      
      toast({
        title: "Paramètres sauvegardés",
        description: "Vos préférences ont été mises à jour",
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleOfflineModeToggle = async (enabled: boolean) => {
    await saveSettings({ offline_mode: enabled });
    
    toast({
      title: enabled ? "Mode hors ligne activé" : "Mode en ligne activé",
      description: enabled 
        ? "Les données sont sauvegardées localement uniquement"
        : "Synchronisation avec le serveur activée",
    });
  };

  const handleSyncToggle = async (enabled: boolean) => {
    await saveSettings({ sync_enabled: enabled });
  };

  // Export des données universelles
  const handleExportData = () => {
    try {
      const exportData = {
        version: "2.1.0",
        exportDate: new Date().toISOString(),
        user: user?.email,
        settings: settings,
        note: "Export des paramètres utilisateur depuis ToolSuite Pro"
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `toolsuite-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export réussi",
        description: "Les paramètres ont été exportés avec succès",
      });
    } catch (error) {
      console.error('Erreur d\'export:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les paramètres",
        variant: "destructive",
      });
    }
  };

  // Import des données
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        if (importedData.settings) {
          await saveSettings(importedData.settings);
          toast({
            title: "Import réussi",
            description: "Les paramètres ont été importés avec succès",
          });
        } else {
          throw new Error('Format de fichier incorrect');
        }
      } catch (error) {
        console.error('Erreur d\'import:', error);
        toast({
          title: "Erreur d'import",
          description: "Format de fichier incorrect ou données corrompues",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Chargement des paramètres...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Statut de connexion */}
      <Card className="border-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Paramètres de l'Application
            </div>
            <div className="flex items-center gap-2">
              {isSaving && (
                <Badge variant="outline" className="text-xs">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Sauvegarde...
                </Badge>
              )}
              <Badge variant={isOnline ? "default" : "secondary"} className="text-xs">
                {isOnline ? (
                  <>
                    <Wifi className="w-3 h-3 mr-1" />
                    En ligne
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 mr-1" />
                    Hors ligne
                  </>
                )}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mode offline/online */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {settings.offline_mode ? (
                    <CloudOff className="w-4 h-4 text-orange-500" />
                  ) : (
                    <Cloud className="w-4 h-4 text-blue-500" />
                  )}
                  <span className="font-medium">Mode de fonctionnement</span>
                </div>
                <p className="text-sm text-gray-500">
                  {settings.offline_mode 
                    ? "Les données sont sauvegardées localement uniquement"
                    : "Synchronisation automatique avec le serveur"
                  }
                </p>
              </div>
              <Switch
                checked={!settings.offline_mode}
                onCheckedChange={(checked) => handleOfflineModeToggle(!checked)}
                disabled={isSaving}
              />
            </div>

            {/* Synchronisation */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-medium">Synchronisation automatique</span>
                <p className="text-sm text-gray-500">
                  Synchroniser automatiquement les données en arrière-plan
                </p>
              </div>
              <Switch
                checked={settings.sync_enabled}
                onCheckedChange={handleSyncToggle}
                disabled={isSaving || settings.offline_mode}
              />
            </div>
          </div>

          {/* Dernière synchronisation */}
          {settings.last_sync && !settings.offline_mode && (
            <div className="text-xs text-gray-500 text-center">
              Dernière sync : {format(new Date(settings.last_sync), "dd/MM/yyyy 'à' HH:mm", { locale: fr })}
            </div>
          )}

          <Separator />

          {/* Import/Export */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Gestion des données</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={handleExportData}
                variant="outline"
                className="w-full text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter paramètres
              </Button>
              
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                  id="import-settings"
                />
                <Button
                  onClick={() => document.getElementById('import-settings')?.click()}
                  variant="outline"
                  className="w-full text-sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Importer paramètres
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
