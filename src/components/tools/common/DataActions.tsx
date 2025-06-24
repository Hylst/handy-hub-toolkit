
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Download, Upload, RotateCcw, AlertTriangle, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DataActionsProps {
  isLoading?: boolean;
  isResetting?: boolean;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

export const DataActions = ({
  isLoading = false,
  isResetting = false,
  onExport,
  onImport,
  onReset
}: DataActionsProps) => {
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleResetConfirm = () => {
    onReset();
    setShowResetDialog(false);
  };

  return (
    <Card className="border-2 border-orange-200 dark:border-orange-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Download className="w-5 h-5 text-orange-600" />
          Actions sur les Données
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Export/Import */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Button
              onClick={onExport}
              disabled={isLoading || isResetting}
              className="w-full"
              variant="outline"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Exporter toutes les données
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Télécharger un fichier JSON avec toutes vos données
            </p>
          </div>

          <div className="space-y-2">
            <div>
              <Input
                type="file"
                accept=".json"
                onChange={onImport}
                disabled={isLoading || isResetting}
                className="hidden"
                id="universal-import"
              />
              <Button
                onClick={() => document.getElementById('universal-import')?.click()}
                disabled={isLoading || isResetting}
                className="w-full"
                variant="outline"
              >
                <Upload className="w-4 h-4 mr-2" />
                Importer des données
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Restaurer à partir d'un fichier JSON
            </p>
          </div>
        </div>

        <Separator />

        {/* Reset avec confirmation */}
        <div className="text-center space-y-3">
          <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={isLoading || isResetting}
              >
                {isResetting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RotateCcw className="w-4 h-4 mr-2" />
                )}
                Réinitialiser toutes les données
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Confirmer la réinitialisation
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action va supprimer définitivement toutes les données stockées localement 
                  pour tous les outils. Cette action est irréversible.
                  <br /><br />
                  Êtes-vous sûr de vouloir continuer ?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleResetConfirm}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Oui, tout supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <p className="text-xs text-red-500">
            ⚠️ Action irréversible - Exportez vos données avant de réinitialiser
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
