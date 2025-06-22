
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { History, Trash2, Search, Download, Upload, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { CalculationHistoryEntry } from "../types";
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
} from "@/components/ui/alert-dialog";

interface CalculationHistoryTabProps {
  history: CalculationHistoryEntry[];
  onClearHistory: () => void;
  onDeleteEntry: (id: string) => void;
  onExportHistory: () => void;
  onImportHistory: (file: File) => void;
}

export const CalculationHistoryTab = ({
  history,
  onClearHistory,
  onDeleteEntry,
  onExportHistory,
  onImportHistory
}: CalculationHistoryTabProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredHistory = history.filter(entry => {
    const matchesSearch = searchTerm === "" || 
      entry.calculation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.result.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || entry.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportHistory(file);
    }
    event.target.value = '';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: "Le résultat a été copié dans le presse-papiers.",
    });
  };

  const uniqueTypes = Array.from(new Set(history.map(entry => entry.type)));

  return (
    <Card className="shadow-lg border-2">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50">
        <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
          <History className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-600" />
          Historique des Calculs Complet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 lg:space-y-6 p-4 lg:p-6">
        {/* Contrôles de recherche et filtres */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher dans l'historique..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
            >
              Tous ({history.length})
            </Button>
            {uniqueTypes.map(type => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(type)}
              >
                {type} ({history.filter(h => h.type === type).length})
              </Button>
            ))}
          </div>
        </div>

        {/* Actions sur l'historique */}
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportHistory}
              className="text-green-600 hover:text-green-700"
              disabled={history.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
              onClick={() => document.getElementById('history-import')?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Importer
            </Button>
            <input
              id="history-import"
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={history.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Effacer tout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer tout l'historique des calculs ? 
                  Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={onClearHistory}>
                  Supprimer tout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Liste de l'historique */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {history.length === 0 
                ? "Aucun calcul dans l'historique" 
                : "Aucun résultat trouvé pour votre recherche"}
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredHistory.map((entry) => (
              <div 
                key={entry.id} 
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 rounded-lg border hover:shadow-md transition-shadow gap-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
                  <Badge variant="outline" className="self-start sm:self-center">
                    {entry.type}
                  </Badge>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
                    <span 
                      className="font-mono text-sm cursor-pointer hover:text-blue-600 transition-colors break-all"
                      onClick={() => copyToClipboard(entry.calculation)}
                      title="Cliquer pour copier"
                    >
                      {entry.calculation}
                    </span>
                    <span className="text-gray-400 hidden sm:inline">→</span>
                    <span 
                      className="font-semibold text-sm cursor-pointer hover:text-green-600 transition-colors break-all"
                      onClick={() => copyToClipboard(entry.result)}
                      title="Cliquer pour copier"
                    >
                      {entry.result}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {format(entry.timestamp, "dd/MM/yyyy HH:mm", { locale: fr })}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteEntry(entry.id)}
                    className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                    title="Supprimer cette entrée"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistiques */}
        {history.length > 0 && (
          <div className="border-t pt-4 mt-6">
            <h4 className="font-semibold mb-2">Statistiques</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                <div className="font-bold text-blue-600">{history.length}</div>
                <div className="text-gray-600">Total</div>
              </div>
              <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                <div className="font-bold text-green-600">{uniqueTypes.length}</div>
                <div className="text-gray-600">Types</div>
              </div>
              <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                <div className="font-bold text-purple-600">
                  {Math.round((history.length / Math.max(1, Math.ceil((Date.now() - (history[history.length - 1]?.timestamp.getTime() || Date.now())) / (1000 * 60 * 60 * 24)))) * 10) / 10}
                </div>
                <div className="text-gray-600">Par jour</div>
              </div>
              <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                <div className="font-bold text-orange-600">{filteredHistory.length}</div>
                <div className="text-gray-600">Affiché</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
