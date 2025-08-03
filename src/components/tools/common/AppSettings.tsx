
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Cloud, CloudOff, Wifi, WifiOff, Loader2 } from 'lucide-react';
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
          .maybeSingle();

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

  // Sauvegarder les paramètres avec la logique UPDATE/INSERT appropriée
  const saveSettings = async (newSettings: Partial<UserAppSettings>) => {
    if (!user) return;

    setIsSaving(true);
    try {
      const updatedSettings = { ...settings, ...newSettings };
      const syncTime = new Date().toISOString();
      
      // D'abord vérifier si l'enregistrement existe
      const { data: existingData } = await supabase
        .from('user_app_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingData) {
        // L'enregistrement existe, faire un UPDATE
        const { error } = await supabase
          .from('user_app_settings')
          .update({
            offline_mode: updatedSettings.offline_mode,
            sync_enabled: updatedSettings.sync_enabled,
            last_sync: syncTime,
            updated_at: syncTime
          })
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }
      } else {
        // L'enregistrement n'existe pas, faire un INSERT
        const { error } = await supabase
          .from('user_app_settings')
          .insert({
            user_id: user.id,
            offline_mode: updatedSettings.offline_mode,
            sync_enabled: updatedSettings.sync_enabled,
            last_sync: syncTime,
            updated_at: syncTime
          });

        if (error) {
          throw error;
        }
      }

      // Mettre à jour l'état local seulement si la sauvegarde a réussi
      setSettings({
        ...updatedSettings,
        last_sync: syncTime
      });
      
      toast({
        title: "Paramètres sauvegardés",
        description: "Vos préférences ont été mises à jour",
      });
      
      console.log('✅ Paramètres utilisateur sauvegardés avec succès');
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
    await saveSettings({ offline_mode: !enabled });
    
    toast({
      title: !enabled ? "Mode hors ligne activé" : "Mode en ligne activé",
      description: !enabled 
        ? "Les données sont sauvegardées localement uniquement"
        : "Synchronisation avec le serveur activée",
    });
  };

  const handleSyncToggle = async (enabled: boolean) => {
    await saveSettings({ sync_enabled: enabled });
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
    <Card className="border-2">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Préférences de l'Application
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
      <CardContent className="space-y-6">
        {/* Mode offline/online */}
        <div className="space-y-4">
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
          <div className="text-xs text-gray-500 text-center pt-2 border-t">
            Dernière sync : {format(new Date(settings.last_sync), "dd/MM/yyyy 'à' HH:mm", { locale: fr })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
