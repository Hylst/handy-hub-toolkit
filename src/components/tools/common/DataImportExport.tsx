
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, RotateCcw, Cloud, CloudOff, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DataImportExportProps {
  onExport: () => void;
  onImport: (file: File) => Promise<boolean>;
  onReset: () => void;
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: string | null;
  toolName: string;
}

export const DataImportExport = ({
  onExport,
  onImport,
  onReset,
  isOnline,
  isSyncing,
  lastSyncTime,
  toolName
}: DataImportExportProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await onImport(file);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base lg:text-lg">
          <span className="flex items-center gap-2">
            📁 Gestion des Données
          </span>
          <div className="flex items-center gap-2">
            {isSyncing ? (
              <Badge variant="outline" className="text-xs">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Synchro...
              </Badge>
            ) : (
              <Badge variant={isOnline ? "default" : "secondary"} className="text-xs">
                {isOnline ? (
                  <>
                    <Cloud className="w-3 h-3 mr-1" />
                    En ligne
                  </>
                ) : (
                  <>
                    <CloudOff className="w-3 h-3 mr-1" />
                    Hors ligne
                  </>
                )}
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status de synchronisation */}
        {lastSyncTime && (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Dernière sync : {format(new Date(lastSyncTime), "dd/MM/yyyy 'à' HH:mm", { locale: fr })}
          </div>
        )}

        {/* Actions Import/Export */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Button
              onClick={onExport}
              className="w-full text-xs lg:text-sm"
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter JSON
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Sauvegardez vos données
            </p>
          </div>

          <div className="space-y-2">
            <div>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
                id={`file-import-${toolName}`}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full text-xs lg:text-sm"
                variant="outline"
              >
                <Upload className="w-4 h-4 mr-2" />
                Importer JSON
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Restaurez vos données
            </p>
          </div>
        </div>

        <Separator />

        {/* Reset des données */}
        <div className="text-center space-y-2">
          <Button
            onClick={onReset}
            variant="destructive"
            size="sm"
            className="text-xs lg:text-sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
          <p className="text-xs text-red-500">
            ⚠️ Supprime toutes les données
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
