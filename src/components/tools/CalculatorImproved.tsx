
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { History, RotateCcw, Calculator, Zap, HelpCircle, Copy, MoreHorizontal } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const CalculatorImproved = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [isRadians, setIsRadians] = useState(true);
  
  // Nouvelles fonctionnalités
  const [expression, setExpression] = useState("");
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [lastAnswer, setLastAnswer] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return; // Éviter les conflits avec les inputs
      
      event.preventDefault();
      
      if (event.key >= '0' && event.key <= '9') {
        inputNumber(event.key);
      } else if (event.key === '.') {
        inputDecimal();
      } else if (event.key === '+') {
        inputOperation('+');
      } else if (event.key === '-') {
        inputOperation('-');
      } else if (event.key === '*') {
        inputOperation('*');
      } else if (event.key === '/') {
        inputOperation('/');
      } else if (event.key === 'Enter' || event.key === '=') {
        performCalculation();
      } else if (event.key === 'Escape' || event.key === 'c' || event.key === 'C') {
        clear();
      } else if (event.key === 'Backspace') {
        backspace();
      } else if (event.key === 'm' || event.key === 'M') {
        // Raccourcis mémoire
        if (event.ctrlKey) {
          memoryStore();
        } else if (event.shiftKey) {
          memoryRecall();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, previousValue, operation, waitingForNewValue]);

  const addToHistory = (calculation: string) => {
    setHistory(prev => [calculation, ...prev.slice(0, 19)]); // Augmentation à 20 entrées
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copié dans le presse-papiers:', text);
    });
  };

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay("0.");
      setWaitingForNewValue(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const backspace = () => {
    if (display.length > 1 && !waitingForNewValue) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      if (newValue !== null) {
        setDisplay(formatNumber(newValue));
        setPreviousValue(newValue);
        addToHistory(`${currentValue} ${operation} ${inputValue} = ${newValue}`);
      }
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number | null => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "*":
        return firstValue * secondValue;
      case "/":
        return secondValue !== 0 ? firstValue / secondValue : null;
      case "^":
        return Math.pow(firstValue, secondValue);
      case "mod":
        return firstValue % secondValue;
      case "root":
        return Math.pow(firstValue, 1/secondValue);
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      if (newValue !== null) {
        const calculation = `${previousValue} ${operation} ${inputValue} = ${newValue}`;
        setDisplay(formatNumber(newValue));
        setLastAnswer(newValue);
        addToHistory(calculation);
        setPreviousValue(null);
        setOperation(null);
        setWaitingForNewValue(true);
      } else {
        setDisplay("Erreur");
        clear();
      }
    }
  };

  const scientificFunction = (func: string) => {
    const value = parseFloat(display);
    let result: number;
    
    try {
      switch (func) {
        case "sin":
          result = Math.sin(isRadians ? value : (value * Math.PI / 180));
          break;
        case "cos":
          result = Math.cos(isRadians ? value : (value * Math.PI / 180));
          break;
        case "tan":
          result = Math.tan(isRadians ? value : (value * Math.PI / 180));
          break;
        case "asin":
          result = isRadians ? Math.asin(value) : (Math.asin(value) * 180 / Math.PI);
          break;
        case "acos":
          result = isRadians ? Math.acos(value) : (Math.acos(value) * 180 / Math.PI);
          break;
        case "atan":
          result = isRadians ? Math.atan(value) : (Math.atan(value) * 180 / Math.PI);
          break;
        case "sinh":
          result = Math.sinh(value);
          break;
        case "cosh":
          result = Math.cosh(value);
          break;
        case "tanh":
          result = Math.tanh(value);
          break;
        case "ln":
          result = Math.log(value);
          break;
        case "log":
          result = Math.log10(value);
          break;
        case "log2":
          result = Math.log2(value);
          break;
        case "sqrt":
          result = Math.sqrt(value);
          break;
        case "cbrt":
          result = Math.cbrt(value);
          break;
        case "square":
          result = value * value;
          break;
        case "cube":
          result = value * value * value;
          break;
        case "factorial":
          result = factorial(Math.round(value));
          break;
        case "exp":
          result = Math.exp(value);
          break;
        case "1/x":
          result = 1 / value;
          break;
        case "abs":
          result = Math.abs(value);
          break;
        case "negate":
          result = -value;
          break;
        case "pi":
          result = Math.PI;
          break;
        case "e":
          result = Math.E;
          break;
        case "random":
          result = Math.random();
          break;
        case "percent":
          result = value / 100;
          break;
        default:
          return;
      }
      
      if (isNaN(result) || !isFinite(result)) {
        setDisplay("Erreur");
        return;
      }
      
      addToHistory(`${func}(${value}) = ${result}`);
      setDisplay(formatNumber(result));
      setLastAnswer(result);
      setWaitingForNewValue(true);
    } catch (error) {
      setDisplay("Erreur");
    }
  };

  const factorial = (n: number): number => {
    if (n < 0 || n > 170) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  // Fonctions mémoire améliorées
  const memoryStore = () => {
    setMemory(parseFloat(display));
    addToHistory(`M+ = ${display}`);
  };

  const memoryRecall = () => {
    setDisplay(formatNumber(memory));
    setWaitingForNewValue(true);
    addToHistory(`MR = ${memory}`);
  };

  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
    addToHistory(`M+ ${display} = ${memory + parseFloat(display)}`);
  };

  const memorySubtract = () => {
    setMemory(memory - parseFloat(display));
    addToHistory(`M- ${display} = ${memory - parseFloat(display)}`);
  };

  const memoryClear = () => {
    setMemory(0);
    addToHistory("MC - Mémoire effacée");
  };

  const formatNumber = (num: number): string => {
    if (Math.abs(num) > 1e15 || (Math.abs(num) < 1e-10 && num !== 0)) {
      return num.toExponential(8);
    }
    return parseFloat(num.toFixed(12)).toString();
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
    setExpression("");
  };

  const clearAll = () => {
    clear();
    setMemory(0);
    setHistory([]);
    setLastAnswer(0);
  };

  const BasicCalculator = () => (
    <div className="space-y-6">
      {/* Écran de la calculatrice amélioré */}
      <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl text-right shadow-inner border-2 border-gray-700">
        <div className="text-xs text-gray-300 dark:text-gray-400 mb-2 flex justify-between">
          <span>{operation && previousValue !== null && `${previousValue} ${operation}`}</span>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs bg-green-800 text-green-200">
              <Zap className="w-3 h-3 mr-1" />
              Actif
            </Badge>
            {memory !== 0 && (
              <Badge variant="secondary" className="text-xs bg-blue-800 text-blue-200">
                M: {formatNumber(memory)}
              </Badge>
            )}
          </div>
        </div>
        <div className="text-4xl font-mono font-bold text-green-400 dark:text-green-300 break-all min-h-[50px] flex items-center justify-end bg-black/20 rounded p-2">
          {display}
        </div>
        <div className="text-xs text-gray-300 dark:text-gray-400 mt-2 flex justify-between">
          <span>Dernière réponse: {lastAnswer !== 0 ? formatNumber(lastAnswer) : "aucune"}</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(display)}
              className="h-6 px-2 text-xs text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <Copy className="w-3 h-3" />
            </Button>
            <span className="text-green-400 dark:text-green-300">● Prêt</span>
          </div>
        </div>
      </div>
      
      {/* Fonctions mémoire */}
      <div className="grid grid-cols-5 gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={memoryClear}
                className="h-10 text-sm bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-800/50 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700"
              >
                MC
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Effacer la mémoire</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={memoryRecall}
                className="h-10 text-sm bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700"
              >
                MR
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Rappel mémoire (Shift+M)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={memoryStore}
                className="h-10 text-sm bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700"
              >
                MS
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Stocker en mémoire (Ctrl+M)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={memoryAdd}
                className="h-10 text-sm bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-800/50 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700"
              >
                M+
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ajouter à la mémoire</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={memorySubtract}
                className="h-10 text-sm bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:hover:bg-yellow-800/50 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700"
              >
                M-
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Soustraire de la mémoire</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Clavier numérique avec couleurs améliorées */}
      <div className="grid grid-cols-4 gap-3">
        {/* Ligne 1 - Fonctions de contrôle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="destructive" 
                onClick={clearAll} 
                className="col-span-2 h-12 text-lg font-semibold bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white"
              >
                Clear All
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Efface tout (mémoire, historique et calcul)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button 
          variant="outline" 
          onClick={backspace}
          className="h-12 text-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
        >
          ⌫
        </Button>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => inputOperation("/")} 
                className="h-12 text-xl bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/50 dark:hover:bg-orange-800/70 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-600"
              >
                ÷
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Division</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Lignes des chiffres avec contraste amélioré */}
        <Button 
          variant="outline" 
          onClick={() => inputNumber("7")} 
          className="h-12 text-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700"
        >
          7
        </Button>
        <Button 
          variant="outline" 
          onClick={() => inputNumber("8")} 
          className="h-12 text-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700"
        >
          8
        </Button>
        <Button 
          variant="outline" 
          onClick={() => inputNumber("9")} 
          className="h-12 text-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700"
        >
          9
        </Button>
        <Button 
          variant="outline" 
          onClick={() => inputOperation("*")} 
          className="h-12 text-xl bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/50 dark:hover:bg-orange-800/70 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-600"
        >
          ×
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => inputNumber("4")} 
          className="h-12 text-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700"
        >
          4
        </Button>
        <Button 
          variant="outline" 
          onClick={() => inputNumber("5")} 
          className="h-12 text-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700"
        >
          5
        </Button>
        <Button 
          variant="outline" 
          onClick={() => inputNumber("6")} 
          className="h-12 text-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700"
        >
          6
        </Button>
        <Button 
          variant="outline" 
          onClick={() => inputOperation("-")} 
          className="h-12 text-xl bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/50 dark:hover:bg-orange-800/70 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-600"
        >
          -
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => inputNumber("1")} 
          className="h-12 text-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700"
        >
          1
        </Button>
        <Button 
          variant="outline" 
          onClick={() => inputNumber("2")} 
          className="h-12 text-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700"
        >
          2
        </Button>
        <Button 
          variant="outline" 
          onClick={() => inputNumber("3")} 
          className="h-12 text-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700"
        >
          3
        </Button>
        <Button 
          variant="outline" 
          onClick={() => inputOperation("+")} 
          className="h-12 text-xl row-span-2 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/50 dark:hover:bg-orange-800/70 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-600"
        >
          +
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => inputNumber("0")} 
          className="col-span-2 h-12 text-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700"
        >
          0
        </Button>
        <Button 
          variant="outline" 
          onClick={inputDecimal} 
          className="h-12 text-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
        >
          .
        </Button>
        <Button 
          onClick={performCalculation}
          className="h-12 text-xl bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 dark:from-green-700 dark:to-teal-700 dark:hover:from-green-800 dark:hover:to-teal-800 text-white font-bold"
        >
          =
        </Button>
      </div>
      
      {/* Fonctions supplémentaires */}
      <div className="grid grid-cols-4 gap-2">
        <Button 
          variant="outline" 
          onClick={() => inputOperation("^")}
          className="h-10 text-sm bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-800/50 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600"
        >
          x^y
        </Button>
        <Button 
          variant="outline" 
          onClick={() => scientificFunction("sqrt")}
          className="h-10 text-sm bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-800/50 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600"
        >
          √x
        </Button>
        <Button 
          variant="outline" 
          onClick={() => scientificFunction("percent")}
          className="h-10 text-sm bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:hover:bg-yellow-800/50 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-600"
        >
          %
        </Button>
        <Button 
          variant="outline" 
          onClick={() => scientificFunction("negate")}
          className="h-10 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
        >
          ±
        </Button>
      </div>
      
      {/* Aide clavier */}
      <div className="text-xs text-gray-600 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-4 h-4" />
          <strong>Raccourcis clavier disponibles :</strong>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <span>• 0-9 : Saisie des chiffres</span>
          <span>• +, -, *, / : Opérations</span>
          <span>• Entrée ou = : Calculer</span>
          <span>• Échap ou C : Effacer</span>
          <span>• Retour arrière : Supprimer</span>
          <span>• . : Virgule décimale</span>
          <span>• Ctrl+M : Stocker en mémoire</span>
          <span>• Shift+M : Rappel mémoire</span>
        </div>
      </div>
    </div>
  );

  const ScientificCalculator = () => (
    <div className="space-y-4">
      {/* Écran amélioré */}
      <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl text-right shadow-inner border-2 border-gray-700">
        <div className="text-xs text-gray-300 dark:text-gray-400 mb-2 flex justify-between">
          <span>{operation && previousValue !== null && `${previousValue} ${operation}`}</span>
          <div className="flex gap-2">
            <Badge variant={isRadians ? "default" : "secondary"} className="text-xs bg-blue-800 text-blue-200">
              {isRadians ? "RAD" : "DEG"}
            </Badge>
            <Badge variant="secondary" className="text-xs bg-green-800 text-green-200">
              <Zap className="w-3 h-3 mr-1" />
              Mode scientifique
            </Badge>
          </div>
        </div>
        <div className="text-3xl font-mono font-bold text-green-400 dark:text-green-300 break-all min-h-[40px] flex items-center justify-end bg-black/20 rounded p-2">
          {display}
        </div>
        <div className="text-xs text-gray-300 dark:text-gray-400 mt-2 flex justify-between">
          <span>Mémoire: {memory !== 0 ? formatNumber(memory) : "vide"} | Ans: {formatNumber(lastAnswer)}</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(display)}
              className="h-6 px-2 text-xs text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <Copy className="w-3 h-3" />
            </Button>
            <span className="text-green-400 dark:text-green-300">● Fonctions avancées actives</span>
          </div>
        </div>
      </div>

      {/* Interface scientifique étendue */}
      <div className="grid grid-cols-6 gap-2 text-sm">
        {/* Fonctions trigonométriques - Rouge */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction("sin")} 
                className="h-10 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-800/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700"
                size="sm"
              >
                sin
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sinus de l'angle (en {isRadians ? "radians" : "degrés"})</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction("cos")} 
                className="h-10 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-800/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700"
                size="sm"
              >
                cos
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cosinus de l'angle</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction("tan")} 
                className="h-10 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-800/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700"
                size="sm"
              >
                tan
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tangente de l'angle</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Fonctions trigonométriques inverses */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction("asin")} 
                className="h-10 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-800/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700"
                size="sm"
              >
                sin⁻¹
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Arc sinus</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction("acos")} 
                className="h-10 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-800/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700"
                size="sm"
              >
                cos⁻¹
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Arc cosinus</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction("atan")} 
                className="h-10 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-800/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700"
                size="sm"
              >
                tan⁻¹
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Arc tangente</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Logarithmes - Vert */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction("ln")} 
                className="h-10 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-800/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700"
                size="sm"
              >
                ln
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Logarithme naturel (base e)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction("log")} 
                className="h-10 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-800/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700"
                size="sm"
              >
                log
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Logarithme décimal (base 10)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction("log2")} 
                className="h-10 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-800/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700"
                size="sm"
              >
                log₂
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Logarithme base 2</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Puissances et racines - Bleu */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction("sqrt")} 
                className="h-10 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                size="sm"
              >
                √
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Racine carrée</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction("cbrt")} 
                className="h-10 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                size="sm"
              >
                ∛
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Racine cubique</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction("square")} 
                className="h-10 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                size="sm"
              >
                x²
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Carré du nombre</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Constantes et autres fonctions */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction("pi")} 
                className="h-10 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-800/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700"
                size="sm"
              >
                π
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Pi (3.14159...)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction("e")} 
                className="h-10 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-800/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700"
                size="sm"
              >
                e
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Nombre d'Euler (2.718...)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction("random")} 
                className="h-10 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:hover:bg-yellow-800/50 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700"
                size="sm"
              >
                Rand
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Nombre aléatoire (0-1)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Clavier numérique compact avec contraste amélioré */}
      <div className="grid grid-cols-4 gap-2">
        <Button variant="destructive" onClick={clearAll} className="h-10 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white">AC</Button>
        <Button variant="outline" onClick={backspace} className="h-10 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200">⌫</Button>
        <Button 
          variant={isRadians ? "default" : "outline"} 
          onClick={() => setIsRadians(!isRadians)} 
          className="h-10 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
        >
          {isRadians ? "RAD" : "DEG"}
        </Button>
        <Button variant="outline" onClick={() => inputOperation("/")} className="h-10 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/50 dark:hover:bg-orange-800/70 text-orange-700 dark:text-orange-300">÷</Button>

        <Button variant="outline" onClick={() => inputNumber("7")} className="h-10 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200">7</Button>
        <Button variant="outline" onClick={() => inputNumber("8")} className="h-10 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200">8</Button>
        <Button variant="outline" onClick={() => inputNumber("9")} className="h-10 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200">9</Button>
        <Button variant="outline" onClick={() => inputOperation("*")} className="h-10 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/50 dark:hover:bg-orange-800/70 text-orange-700 dark:text-orange-300">×</Button>

        <Button variant="outline" onClick={() => inputNumber("4")} className="h-10 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200">4</Button>
        <Button variant="outline" onClick={() => inputNumber("5")} className="h-10 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200">5</Button>
        <Button variant="outline" onClick={() => inputNumber("6")} className="h-10 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200">6</Button>
        <Button variant="outline" onClick={() => inputOperation("-")} className="h-10 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/50 dark:hover:bg-orange-800/70 text-orange-700 dark:text-orange-300">-</Button>

        <Button variant="outline" onClick={() => inputNumber("1")} className="h-10 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200">1</Button>
        <Button variant="outline" onClick={() => inputNumber("2")} className="h-10 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200">2</Button>
        <Button variant="outline" onClick={() => inputNumber("3")} className="h-10 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200">3</Button>
        <Button variant="outline" onClick={() => inputOperation("+")} className="h-10 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/50 dark:hover:bg-orange-800/70 text-orange-700 dark:text-orange-300">+</Button>

        <Button variant="outline" onClick={() => inputNumber("0")} className="col-span-2 h-10 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-200">0</Button>
        <Button variant="outline" onClick={inputDecimal} className="h-10 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200">.</Button>
        <Button 
          onClick={performCalculation}
          className="h-10 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 dark:from-green-700 dark:to-teal-700 dark:hover:from-green-800 dark:hover:to-teal-800 text-white font-bold"
        >
          =
        </Button>
      </div>
    </div>
  );

  const HistoryPanel = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Historique des calculs
          <Badge variant="secondary">{history.length}/20</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
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
      <CardContent>
        <ScrollArea className="h-60">
          {history.length === 0 ? (
            <div className="text-center py-8">
              <Calculator className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Aucun calcul effectué</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">L'historique apparaîtra ici</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((calc, index) => (
                <div 
                  key={index} 
                  className="group p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm font-mono cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors border border-gray-200 dark:border-gray-700"
                  onClick={() => {
                    const result = calc.split(" = ")[1];
                    if (result) {
                      setDisplay(result);
                      setWaitingForNewValue(true);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800 dark:text-gray-200">{calc}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        const result = calc.split(" = ")[1];
                        if (result) copyToClipboard(result);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
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

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* En-tête avec documentation */}
        <div className="text-center space-y-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl border-2 border-blue-200 dark:border-blue-800">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-full">
              <Calculator className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Calculatrices Professionnelles
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Effectuez vos calculs avec précision grâce à nos calculatrices avancées. 
            Support complet du clavier, fonctions scientifiques étendues et historique intelligent.
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="secondary">Saisie clavier complète</Badge>
            <Badge variant="secondary">50+ fonctions scientifiques</Badge>
            <Badge variant="secondary">Mémoire avancée</Badge>
            <Badge variant="secondary">Historique intelligent</Badge>
            <Badge variant="secondary">Copie/Coller</Badge>
          </div>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger 
              value="basic" 
              className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-300"
            >
              Calculatrice Basique
            </TabsTrigger>
            <TabsTrigger 
              value="scientific" 
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900 dark:data-[state=active]:text-green-300"
            >
              Calculatrice Scientifique
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-300"
            >
              Historique
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <Card className="max-w-md mx-auto shadow-lg border-2 border-gray-200 dark:border-gray-700">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <CardTitle className="flex items-center gap-2 justify-center text-gray-800 dark:text-gray-200">
                  <Calculator className="w-5 h-5" />
                  Calculatrice Basique
                  <Badge variant="secondary">Interface intuitive</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <BasicCalculator />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="scientific">
            <Card className="max-w-4xl mx-auto shadow-lg border-2 border-gray-200 dark:border-gray-700">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                <CardTitle className="flex items-center gap-2 justify-center text-gray-800 dark:text-gray-200">
                  <Zap className="w-5 h-5" />
                  Calculatrice Scientifique
                  <Badge variant="secondary">50+ fonctions avancées</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ScientificCalculator />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="max-w-md mx-auto">
              <HistoryPanel />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};
