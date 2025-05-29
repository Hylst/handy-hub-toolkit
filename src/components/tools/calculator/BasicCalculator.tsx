
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, Zap, HelpCircle } from "lucide-react";

interface BasicCalculatorProps {
  display: string;
  previousValue: number | null;
  operation: string | null;
  memory: number;
  lastAnswer: number;
  inputNumber: (num: string) => void;
  inputDecimal: () => void;
  backspace: () => void;
  inputOperation: (op: string) => void;
  performCalculation: () => void;
  scientificFunction: (func: string) => void;
  memoryStore: () => void;
  memoryRecall: () => void;
  memoryAdd: () => void;
  memorySubtract: () => void;
  memoryClear: () => void;
  clear: () => void;
  clearAll: () => void;
  copyToClipboard: (text: string) => void;
}

export const BasicCalculator = ({
  display,
  previousValue,
  operation,
  memory,
  lastAnswer,
  inputNumber,
  inputDecimal,
  backspace,
  inputOperation,
  performCalculation,
  scientificFunction,
  memoryStore,
  memoryRecall,
  memoryAdd,
  memorySubtract,
  memoryClear,
  clearAll,
  copyToClipboard
}: BasicCalculatorProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Écran de la calculatrice */}
      <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl text-right shadow-inner border-2 border-gray-700">
        <div className="text-xs text-gray-300 mb-2 flex justify-between items-center">
          <span className="truncate">{operation && previousValue !== null && `${previousValue} ${operation}`}</span>
          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
            <Badge variant="secondary" className="text-xs bg-green-800 text-green-200">
              <Zap className="w-3 h-3 mr-1" />
              Actif
            </Badge>
            {memory !== 0 && (
              <Badge variant="secondary" className="text-xs bg-blue-800 text-blue-200">
                M: {memory.toString().slice(0, 6)}
              </Badge>
            )}
          </div>
        </div>
        <div className="text-2xl sm:text-4xl font-mono font-bold text-green-400 break-all min-h-[40px] sm:min-h-[50px] flex items-center justify-end bg-black/20 rounded p-2">
          {display}
        </div>
        <div className="text-xs text-gray-300 mt-2 flex justify-between items-center">
          <span className="truncate">Dernière réponse: {lastAnswer !== 0 ? lastAnswer.toString().slice(0, 10) : "aucune"}</span>
          <div className="flex gap-2 items-center flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(display)}
              className="h-6 px-2 text-xs text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <Copy className="w-3 h-3" />
            </Button>
            <span className="text-green-400">● Prêt</span>
          </div>
        </div>
      </div>
      
      {/* Fonctions mémoire */}
      <div className="grid grid-cols-5 gap-1 sm:gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              onClick={memoryClear}
              className="h-8 sm:h-10 text-xs sm:text-sm bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-800/50 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700"
            >
              MC
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Effacer la mémoire</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              onClick={memoryRecall}
              className="h-8 sm:h-10 text-xs sm:text-sm bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700"
            >
              MR
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Rappel mémoire (Shift+M)</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              onClick={memoryStore}
              className="h-8 sm:h-10 text-xs sm:text-sm bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700"
            >
              MS
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Stocker en mémoire (Ctrl+M)</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              onClick={memoryAdd}
              className="h-8 sm:h-10 text-xs sm:text-sm bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-800/50 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700"
            >
              M+
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ajouter à la mémoire</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              onClick={memorySubtract}
              className="h-8 sm:h-10 text-xs sm:text-sm bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:hover:bg-yellow-800/50 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700"
            >
              M-
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Soustraire de la mémoire</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      {/* Clavier numérique */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {/* Ligne 1 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="destructive" 
              onClick={clearAll} 
              className="col-span-2 h-10 sm:h-12 text-sm sm:text-lg font-semibold bg-red-600 hover:bg-red-700 text-white"
            >
              Clear All
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Efface tout (mémoire, historique et calcul)</p>
          </TooltipContent>
        </Tooltip>
        
        <Button 
          variant="outline" 
          onClick={backspace}
          className="h-10 sm:h-12 text-sm sm:text-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          ⌫
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => inputOperation("/")} 
          className="h-10 sm:h-12 text-lg sm:text-xl bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/50 dark:hover:bg-orange-800/70 text-orange-700 dark:text-orange-300"
        >
          ÷
        </Button>
        
        {/* Lignes des chiffres */}
        {[7, 8, 9].map(num => (
          <Button 
            key={num}
            variant="outline" 
            onClick={() => inputNumber(num.toString())} 
            className="h-10 sm:h-12 text-lg sm:text-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200"
          >
            {num}
          </Button>
        ))}
        <Button 
          variant="outline" 
          onClick={() => inputOperation("*")} 
          className="h-10 sm:h-12 text-lg sm:text-xl bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/50 dark:hover:bg-orange-800/70 text-orange-700 dark:text-orange-300"
        >
          ×
        </Button>
        
        {[4, 5, 6].map(num => (
          <Button 
            key={num}
            variant="outline" 
            onClick={() => inputNumber(num.toString())} 
            className="h-10 sm:h-12 text-lg sm:text-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200"
          >
            {num}
          </Button>
        ))}
        <Button 
          variant="outline" 
          onClick={() => inputOperation("-")} 
          className="h-10 sm:h-12 text-lg sm:text-xl bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/50 dark:hover:bg-orange-800/70 text-orange-700 dark:text-orange-300"
        >
          -
        </Button>
        
        {[1, 2, 3].map(num => (
          <Button 
            key={num}
            variant="outline" 
            onClick={() => inputNumber(num.toString())} 
            className="h-10 sm:h-12 text-lg sm:text-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200"
          >
            {num}
          </Button>
        ))}
        <Button 
          variant="outline" 
          onClick={() => inputOperation("+")} 
          className="h-10 sm:h-12 text-lg sm:text-xl row-span-2 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/50 dark:hover:bg-orange-800/70 text-orange-700 dark:text-orange-300"
        >
          +
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => inputNumber("0")} 
          className="col-span-2 h-10 sm:h-12 text-lg sm:text-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200"
        >
          0
        </Button>
        <Button 
          variant="outline" 
          onClick={inputDecimal} 
          className="h-10 sm:h-12 text-lg sm:text-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          .
        </Button>
        <Button 
          onClick={performCalculation}
          className="h-10 sm:h-12 text-lg sm:text-xl bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold"
        >
          =
        </Button>
      </div>
      
      {/* Fonctions supplémentaires */}
      <div className="grid grid-cols-4 gap-1 sm:gap-2">
        <Button 
          variant="outline" 
          onClick={() => inputOperation("^")}
          className="h-8 sm:h-10 text-xs sm:text-sm bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-800/50 text-purple-700 dark:text-purple-300"
        >
          x^y
        </Button>
        <Button 
          variant="outline" 
          onClick={() => scientificFunction("sqrt")}
          className="h-8 sm:h-10 text-xs sm:text-sm bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-800/50 text-purple-700 dark:text-purple-300"
        >
          √x
        </Button>
        <Button 
          variant="outline" 
          onClick={() => scientificFunction("percent")}
          className="h-8 sm:h-10 text-xs sm:text-sm bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:hover:bg-yellow-800/50 text-yellow-700 dark:text-yellow-300"
        >
          %
        </Button>
        <Button 
          variant="outline" 
          onClick={() => scientificFunction("negate")}
          className="h-8 sm:h-10 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          ±
        </Button>
      </div>
      
      {/* Aide clavier */}
      <div className="text-xs text-gray-600 dark:text-gray-400 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-4 h-4" />
          <strong>Raccourcis clavier :</strong>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs">
          <span>• 0-9 : Chiffres</span>
          <span>• +, -, *, / : Opérations</span>
          <span>• Entrée/= : Calculer</span>
          <span>• Échap/C : Effacer</span>
          <span>• Retour : Supprimer</span>
          <span>• . : Virgule</span>
          <span>• Ctrl+M : Mémoire</span>
          <span>• Shift+M : Rappel</span>
        </div>
      </div>
    </div>
  );
};
