
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  Upload, 
  RefreshCw, 
  Trash2, 
  CloudSync, 
  Wifi, 
  WifiOff,
  FileText,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DataImportExportProps {
  onExport: () => void;
  onImport: (file: File) => Promise<boolean>;
  onReset: () => void;
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime?: string;
  toolName: string;
  onExportGoogleTasks?: () => void;
  onExportICalendar?: () => void;
}

export const DataImportExport = ({
  onExport,
  onImport,
  onReset,
  isOnline,
  isSyncing,
  lastSyncTime,
  toolName,
  onExportGoogleTasks,
  onExportICalendar
}: DataImportExportProps) => {
  const [isImporting, setIsImporting] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await onImport(file);
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  const formatLastSync = (timestamp?: string) => {
    if (!timestamp) return 'Jamais';
    
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Erreur';
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <CloudSync className="w-5 h-5 text-blue-600" />
            Gestion des données - {toolName}
          </span>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Wifi className="w-3 h-3 mr-1" />
                En ligne
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                <WifiOff className="w-3 h-3 mr-1" />
                Hors ligne
              </Badge>
            )}
            
            {isSyncing && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                Sync...
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Statut de synchronisation */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Dernière sauvegarde :
            </span>
            <span className="font-medium">
              {formatLastSync(lastSyncTime)}
            </span>
          </div>
        </div>

        <Separator />

        {/* Export standard */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">
            Export des données
          </h3>
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={onExport}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </Button>

            {/* Exports spécialisés pour les tâches */}
            {onExportGoogleTasks && (
              <Button
                onClick={onExportGoogleTasks}
                variant="outline"
                className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <FileText className="w-4 h-4" />
                Google Tasks
              </Button>
            )}

            {onExportICalendar && (
              <Button
                onClick={onExportICalendar}
                variant="outline"
                className="flex items-center gap-2 border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <Calendar className="w-4 h-4" />
                iCalendar
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Import */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">
            Import des données
          </h3>
          
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              disabled={isImporting}
              className="flex-1"
              autoComplete="off"
            />
            <Button
              disabled={isImporting}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {isImporting ? 'Import...' : 'Import'}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Reset */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">
            Réinitialisation
          </h3>
          
          <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Réinitialiser
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Confirmer la réinitialisation
                </DialogTitle>
                <DialogDescription>
                  Cette action supprimera définitivement toutes les données de {toolName}. 
                  Cette opération ne peut pas être annulée.
                </DialogDescription>
              </DialogHeader>
              
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  Assurez-vous d'avoir exporté vos données importantes avant de continuer.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowResetDialog(false)}
                >
                  Annuler
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onReset();
                    setShowResetDialog(false);
                  }}
                >
                  Réinitialiser
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Informations de sauvegarde */}
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <p className="flex items-center gap-1 mb-1">
            <CloudSync className="w-3 h-3" />
            <strong>Sauvegarde automatique active</strong>
          </p>
          <p>• Vos données sont sauvegardées automatiquement à chaque modification</p>
          <p>• Sauvegarde locale (navigateur) + fallback localStorage</p>
          <p>• Utilisez l'export pour sauvegarder sur votre appareil</p>
        </div>
      </CardContent>
    </Card>
  );
};
