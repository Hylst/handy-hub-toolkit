
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, Zap } from "lucide-react";

interface ScientificCalculatorProps {
  display: string;
  previousValue: number | null;
  operation: string | null;
  memory: number;
  lastAnswer: number;
  isRadians: boolean;
  setIsRadians: (value: boolean) => void;
  inputNumber: (num: string) => void;
  inputDecimal: () => void;
  backspace: () => void;
  inputOperation: (op: string) => void;
  performCalculation: () => void;
  scientificFunction: (func: string) => void;
  clearAll: () => void;
  copyToClipboard: (text: string) => void;
  formatNumber: (num: number) => string;
}

export const ScientificCalculator = ({
  display,
  previousValue,
  operation,
  memory,
  lastAnswer,
  isRadians,
  setIsRadians,
  inputNumber,
  inputDecimal,
  backspace,
  inputOperation,
  performCalculation,
  scientificFunction,
  clearAll,
  copyToClipboard,
  formatNumber
}: ScientificCalculatorProps) => {
  return (
    <div className="space-y-4">
      {/* Écran amélioré */}
      <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl text-right shadow-inner border-2 border-gray-700">
        <div className="text-xs text-gray-300 mb-2 flex justify-between items-center flex-wrap gap-2">
          <span className="truncate">{operation && previousValue !== null && `${previousValue} ${operation}`}</span>
          <div className="flex gap-2 flex-shrink-0">
            <Badge variant={isRadians ? "default" : "secondary"} className="text-xs bg-blue-800 text-blue-200">
              {isRadians ? "RAD" : "DEG"}
            </Badge>
            <Badge variant="secondary" className="text-xs bg-green-800 text-green-200">
              <Zap className="w-3 h-3 mr-1" />
              Scientifique
            </Badge>
          </div>
        </div>
        <div className="text-xl sm:text-3xl font-mono font-bold text-green-400 break-all min-h-[32px] sm:min-h-[40px] flex items-center justify-end bg-black/20 rounded p-2">
          {display}
        </div>
        <div className="text-xs text-gray-300 mt-2 flex justify-between items-center flex-wrap gap-2">
          <span className="truncate">Mémoire: {memory !== 0 ? formatNumber(memory) : "vide"} | Ans: {formatNumber(lastAnswer)}</span>
          <div className="flex gap-2 items-center flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(display)}
              className="h-6 px-2 text-xs text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <Copy className="w-3 h-3" />
            </Button>
            <span className="text-green-400">● Fonctions actives</span>
          </div>
        </div>
      </div>

      {/* Interface scientifique étendue */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1 sm:gap-2 text-xs sm:text-sm">
        {/* Fonctions trigonométriques */}
        {[
          { func: "sin", color: "red", tooltip: `Sinus (${isRadians ? "radians" : "degrés"})` },
          { func: "cos", color: "red", tooltip: "Cosinus" },
          { func: "tan", color: "red", tooltip: "Tangente" },
          { func: "asin", label: "sin⁻¹", color: "red", tooltip: "Arc sinus" },
          { func: "acos", label: "cos⁻¹", color: "red", tooltip: "Arc cosinus" },
          { func: "atan", label: "tan⁻¹", color: "red", tooltip: "Arc tangente" }
        ].map(({ func, label, color, tooltip }) => (
          <Tooltip key={func}>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction(func)} 
                className={`h-8 sm:h-10 bg-${color}-50 hover:bg-${color}-100 dark:bg-${color}-900/30 dark:hover:bg-${color}-800/50 text-${color}-700 dark:text-${color}-300 border-${color}-200 dark:border-${color}-700`}
                size="sm"
              >
                {label || func}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        {/* Logarithmes */}
        {[
          { func: "ln", color: "green", tooltip: "Logarithme naturel (base e)" },
          { func: "log", color: "green", tooltip: "Logarithme décimal (base 10)" },
          { func: "log2", label: "log₂", color: "green", tooltip: "Logarithme base 2" },
          { func: "sqrt", label: "√", color: "blue", tooltip: "Racine carrée" },
          { func: "cbrt", label: "∛", color: "blue", tooltip: "Racine cubique" },
          { func: "square", label: "x²", color: "blue", tooltip: "Carré du nombre" }
        ].map(({ func, label, color, tooltip }) => (
          <Tooltip key={func}>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction(func)} 
                className={`h-8 sm:h-10 bg-${color}-50 hover:bg-${color}-100 dark:bg-${color}-900/30 dark:hover:bg-${color}-800/50 text-${color}-700 dark:text-${color}-300 border-${color}-200 dark:border-${color}-700`}
                size="sm"
              >
                {label || func}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        {/* Constantes et autres fonctions */}
        {[
          { func: "pi", label: "π", color: "purple", tooltip: "Pi (3.14159...)" },
          { func: "e", color: "purple", tooltip: "Nombre d'Euler (2.718...)" },
          { func: "random", label: "Rand", color: "yellow", tooltip: "Nombre aléatoire (0-1)" },
          { func: "factorial", label: "n!", color: "indigo", tooltip: "Factorielle" },
          { func: "exp", color: "purple", tooltip: "Exponentielle (e^x)" },
          { func: "abs", label: "|x|", color: "gray", tooltip: "Valeur absolue" }
        ].map(({ func, label, color, tooltip }) => (
          <Tooltip key={func}>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction(func)} 
                className={`h-8 sm:h-10 bg-${color}-50 hover:bg-${color}-100 dark:bg-${color}-900/30 dark:hover:bg-${color}-800/50 text-${color}-700 dark:text-${color}-300 border-${color}-200 dark:border-${color}-700`}
                size="sm"
              >
                {label || func}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Clavier numérique compact */}
      <div className="grid grid-cols-4 gap-1 sm:gap-2">
        <Button variant="destructive" onClick={clearAll} className="h-8 sm:h-10 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm">AC</Button>
        <Button variant="outline" onClick={backspace} className="h-8 sm:h-10 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-xs sm:text-sm">⌫</Button>
        <Button 
          variant={isRadians ? "default" : "outline"} 
          onClick={() => setIsRadians(!isRadians)} 
          className="h-8 sm:h-10 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm"
        >
          {isRadians ? "RAD" : "DEG"}
        </Button>
        <Button variant="outline" onClick={() => inputOperation("/")} className="h-8 sm:h-10 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/50 dark:hover:bg-orange-800/70 text-orange-700 dark:text-orange-300 text-xs sm:text-sm">÷</Button>

        {[7, 8, 9].map(num => (
          <Button key={num} variant="outline" onClick={() => inputNumber(num.toString())} className="h-8 sm:h-10 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200 text-xs sm:text-sm">{num}</Button>
        ))}
        <Button variant="outline" onClick={() => inputOperation("*")} className="h-8 sm:h-10 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/50 dark:hover:bg-orange-800/70 text-orange-700 dark:text-orange-300 text-xs sm:text-sm">×</Button>

        {[4, 5, 6].map(num => (
          <Button key={num} variant="outline" onClick={() => inputNumber(num.toString())} className="h-8 sm:h-10 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200 text-xs sm:text-sm">{num}</Button>
        ))}
        <Button variant="outline" onClick={() => inputOperation("-")} className="h-8 sm:h-10 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/50 dark:hover:bg-orange-800/70 text-orange-700 dark:text-orange-300 text-xs sm:text-sm">-</Button>

        {[1, 2, 3].map(num => (
          <Button key={num} variant="outline" onClick={() => inputNumber(num.toString())} className="h-8 sm:h-10 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200 text-xs sm:text-sm">{num}</Button>
        ))}
        <Button variant="outline" onClick={() => inputOperation("+")} className="h-8 sm:h-10 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/50 dark:hover:bg-orange-800/70 text-orange-700 dark:text-orange-300 text-xs sm:text-sm">+</Button>

        <Button variant="outline" onClick={() => inputNumber("0")} className="col-span-2 h-8 sm:h-10 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200 text-xs sm:text-sm">0</Button>
        <Button variant="outline" onClick={inputDecimal} className="h-8 sm:h-10 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-xs sm:text-sm">.</Button>
        <Button 
          onClick={performCalculation}
          className="h-8 sm:h-10 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm"
        >
          =
        </Button>
      </div>
    </div>
  );
};
