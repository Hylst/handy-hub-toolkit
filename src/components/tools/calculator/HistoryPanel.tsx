
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { History, RotateCcw, Calculator, Copy, MoreHorizontal } from "lucide-react";

interface HistoryPanelProps {
  history: string[];
  setHistory: (history: string[]) => void;
  display: string;
  setDisplay?: (display: string) => void;
  setWaitingForNewValue?: (waiting: boolean) => void;
  copyToClipboard: (text: string) => void;
}

export const HistoryPanel = ({
  history,
  setHistory,
  copyToClipboard
}: HistoryPanelProps) => {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 flex-wrap">
          <History className="w-5 h-5 flex-shrink-0" />
          <span className="text-lg sm:text-xl">Historique des calculs</span>
          <Badge variant="secondary" className="text-xs">{history.length}/20</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50">
              <DropdownMenuItem onClick={() => setHistory([])}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Effacer l'historique
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => copyToClipboard(history.join('\n'))}>
                <Copy className="w-4 h-4 mr-2" />
                Copier tout l'historique
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <ScrollArea className="h-60">
          {history.length === 0 ? (
            <div className="text-center py-8">
              <Calculator className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">Aucun calcul effectué</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">L'historique apparaîtra ici</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((calc, index) => (
                <div 
                  key={index} 
                  className="group p-2 sm:p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-xs sm:text-sm font-mono cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors border border-gray-200 dark:border-gray-700"
                  onClick={() => {
                    const result = calc.split(" = ")[1];
                    if (result) {
                      // Note: Dans une implémentation complète, on passerait setDisplay et setWaitingForNewValue
                      console.log('Résultat sélectionné:', result);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800 dark:text-gray-200 break-all">{calc}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        const result = calc.split(" = ")[1];
                        if (result) copyToClipboard(result);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 flex-shrink-0 ml-2"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Cliquez pour utiliser le résultat
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
