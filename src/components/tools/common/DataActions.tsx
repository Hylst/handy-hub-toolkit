
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  RotateCcw, 
  HardDrive,
  AlertTriangle
} from 'lucide-react';
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
  isLoading: boolean;
  isResetting: boolean;
  onExport: () => Promise<void>;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onReset: () => Promise<void>;
}

export const DataActions = ({
  isLoading,
  isResetting,
  onExport,
  onImport,
  onReset
}: DataActionsProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <HardDrive className="w-4 h-4" />
          Gestion des Données
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export */}
          <div className="space-y-2">
            <Button
              onClick={onExport}
              disabled={isLoading || isResetting}
              className="w-full"
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              {isLoading ? 'Export en cours...' : 'Exporter Tout'}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Sauvegarde complète de l'application
            </p>
          </div>

          {/* Import */}
          <div className="space-y-2">
            <div>
              <Input
                type="file"
                accept=".json"
                onChange={onImport}
                disabled={isLoading || isResetting}
                className="w-full"
                id="universal-import"
              />
              <label
                htmlFor="universal-import"
                className="sr-only"
              >
                Importer un fichier de sauvegarde
              </label>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Restaurer depuis une sauvegarde
            </p>
          </div>
        </div>

        <Separator />

        {/* Reset avec confirmation */}
        <div className="text-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={isLoading || isResetting}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {isResetting ? 'Suppression...' : 'Tout Réinitialiser'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Confirmer la réinitialisation
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action va supprimer définitivement TOUTES les données de l'application :
                  <br />
                  • Tous vos projets et tâches
                  <br />
                  • Tous vos objectifs et notes
                  <br />
                  • Tout l'historique des outils
                  <br />
                  • Toutes vos préférences
                  <br /><br />
                  Cette action est irréversible. Voulez-vous continuer ?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onReset}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Oui, tout supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <p className="text-xs text-red-500 mt-2">
            ⚠️ Supprime définitivement toutes les données
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
