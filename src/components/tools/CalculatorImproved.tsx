
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { History, RotateCcw, Calculator, Zap, HelpCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const CalculatorImproved = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [isRadians, setIsRadians] = useState(true);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, previousValue, operation, waitingForNewValue]);

  const addToHistory = (calculation: string) => {
    setHistory(prev => [calculation, ...prev.slice(0, 9)]);
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
        case "ln":
          result = Math.log(value);
          break;
        case "log":
          result = Math.log10(value);
          break;
        case "sqrt":
          result = Math.sqrt(value);
          break;
        case "square":
          result = value * value;
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
        case "pi":
          result = Math.PI;
          break;
        case "e":
          result = Math.E;
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

  const formatNumber = (num: number): string => {
    if (Math.abs(num) > 1e10 || (Math.abs(num) < 1e-6 && num !== 0)) {
      return num.toExponential(6);
    }
    return parseFloat(num.toFixed(10)).toString();
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const clearAll = () => {
    clear();
    setMemory(0);
    setHistory([]);
  };

  const BasicCalculator = () => (
    <div className="space-y-6">
      {/* Écran de la calculatrice */}
      <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl text-right shadow-inner border-2 border-gray-700">
        <div className="text-xs text-gray-400 mb-2 flex justify-between">
          <span>{operation && previousValue !== null && `${previousValue} ${operation}`}</span>
          <Badge variant="secondary" className="text-xs">
            <Zap className="w-3 h-3 mr-1" />
            Clavier activé
          </Badge>
        </div>
        <div className="text-4xl font-mono font-bold text-green-400 break-all min-h-[50px] flex items-center justify-end">
          {display}
        </div>
        <div className="text-xs text-gray-400 mt-2 flex justify-between">
          <span>Mémoire: {memory !== 0 ? memory : "vide"}</span>
          <span className="text-green-500">● Prêt</span>
        </div>
      </div>
      
      {/* Clavier numérique avec couleurs par fonction */}
      <div className="grid grid-cols-4 gap-3">
        {/* Ligne 1 - Fonctions de contrôle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="destructive" 
                onClick={clearAll} 
                className="col-span-2 h-12 text-lg font-semibold bg-red-600 hover:bg-red-700"
              >
                Clear All
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Efface tout (mémoire, historique et calcul)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => inputOperation("/")} 
                className="h-12 text-xl bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300"
              >
                ÷
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Division</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => inputOperation("*")} 
                className="h-12 text-xl bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300"
              >
                ×
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Multiplication</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Ligne 2 - Chiffres 7,8,9 et soustraction */}
        <Button 
          variant="outline" 
          onClick={() => inputNumber("7")} 
          className="h-12 text-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200"
        >
          7
        </Button>
        <Button 
          variant="outline" 
          onClick={() => inputNumber("8")} 
          className="h-12 text-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200"
        >
          8
        </Button>
        <Button 
          variant="outline" 
          onClick={() => inputNumber("9")} 
          className="h-12 text-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200"
        >
          9
        </Button>
        <Button 
          variant="outline" 
          onClick={() => inputOperation("-")} 
          className="h-12 text-xl bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300"
        >
          -
        </Button>
        
        {/* Ligne 3 - Chiffres 4,5,6 et addition */}
        <Button 
          variant="outline" 
          onClick={() => inputNumber("4")} 
          className="h-12 text-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200"
        >
          4
        </Button>
        <Button 
          variant="outline" 
          onClick={() => inputNumber("5")} 
          className="h-12 text-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200"
        >
          5
        </Button>
        <Button 
          variant="outline" 
          onClick={() => inputNumber("6")} 
          className="h-12 text-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200"
        >
          6
        </Button>
        <Button 
          variant="outline" 
          onClick={() => inputOperation("+")} 
          className="h-12 text-xl row-span-2 bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300"
        >
          +
        </Button>
        
        {/* Ligne 4 - Chiffres 1,2,3 */}
        <Button 
          variant="outline" 
          onClick={() => inputNumber("1")} 
          className="h-12 text-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200"
        >
          1
        </Button>
        <Button 
          variant="outline" 
          onClick={() => inputNumber("2")} 
          className="h-12 text-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200"
        >
          2
        </Button>
        <Button 
          variant="outline" 
          onClick={() => inputNumber("3")} 
          className="h-12 text-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200"
        >
          3
        </Button>
        
        {/* Ligne 5 - 0, virgule et égal */}
        <Button 
          variant="outline" 
          onClick={() => inputNumber("0")} 
          className="col-span-2 h-12 text-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200"
        >
          0
        </Button>
        <Button 
          variant="outline" 
          onClick={inputDecimal} 
          className="h-12 text-xl bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
        >
          .
        </Button>
        <Button 
          onClick={performCalculation}
          className="h-12 text-xl bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold"
        >
          =
        </Button>
      </div>
      
      {/* Aide clavier */}
      <div className="text-xs text-gray-600 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-4 h-4" />
          <strong>Raccourcis clavier disponibles :</strong>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <span>• 0-9 : Saisie des chiffres</span>
          <span>• +, -, *, / : Opérations</span>
          <span>• Entrée ou = : Calculer</span>
          <span>• Échap : Effacer</span>
          <span>• Retour arrière : Supprimer</span>
          <span>• . : Virgule décimale</span>
        </div>
      </div>
    </div>
  );

  const ScientificCalculator = () => (
    <div className="space-y-4">
      {/* Écran amélioré */}
      <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl text-right shadow-inner border-2 border-gray-700">
        <div className="text-xs text-gray-400 mb-2 flex justify-between">
          <span>{operation && previousValue !== null && `${previousValue} ${operation}`}</span>
          <div className="flex gap-2">
            <Badge variant={isRadians ? "default" : "secondary"} className="text-xs">
              {isRadians ? "RAD" : "DEG"}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Mode scientifique
            </Badge>
          </div>
        </div>
        <div className="text-3xl font-mono font-bold text-green-400 break-all min-h-[40px] flex items-center justify-end">
          {display}
        </div>
        <div className="text-xs text-gray-400 mt-2 flex justify-between">
          <span>Mémoire: {memory !== 0 ? memory : "vide"}</span>
          <span className="text-green-500">● Fonctions avancées actives</span>
        </div>
      </div>

      {/* Interface scientifique compacte */}
      <div className="grid grid-cols-6 gap-2 text-sm">
        {/* Fonctions trigonométriques - Rouge */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction("sin")} 
                className="h-10 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
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
                className="h-10 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
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
                className="h-10 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
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

        {/* Logarithmes - Vert */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction("ln")} 
                className="h-10 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
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
                className="h-10 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
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

        {/* Constantes - Violet */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction("pi")} 
                className="h-10 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
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

        {/* Puissances et racines - Bleu */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction("sqrt")} 
                className="h-10 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
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
                onClick={() => scientificFunction("square")} 
                className="h-10 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
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
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction("1/x")} 
                className="h-10 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                size="sm"
              >
                1/x
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Inverse du nombre</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Autres fonctions */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction("factorial")} 
                className="h-10 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200"
                size="sm"
              >
                x!
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Factorielle du nombre</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction("exp")} 
                className="h-10 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                size="sm"
              >
                eˣ
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Exponentielle (e puissance x)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => scientificFunction("e")} 
                className="h-10 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
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
      </div>

      {/* Clavier numérique standard */}
      <div className="grid grid-cols-4 gap-2">
        <Button variant="destructive" onClick={clearAll} className="h-10">AC</Button>
        <Button variant="outline" onClick={backspace} className="h-10">⌫</Button>
        <Button 
          variant={isRadians ? "default" : "outline"} 
          onClick={() => setIsRadians(!isRadians)} 
          className="h-10"
        >
          {isRadians ? "RAD" : "DEG"}
        </Button>
        <Button variant="outline" onClick={() => inputOperation("/")} className="h-10 bg-orange-100 text-orange-700">÷</Button>

        <Button variant="outline" onClick={() => inputNumber("7")} className="h-10 bg-blue-50 text-blue-800">7</Button>
        <Button variant="outline" onClick={() => inputNumber("8")} className="h-10 bg-blue-50 text-blue-800">8</Button>
        <Button variant="outline" onClick={() => inputNumber("9")} className="h-10 bg-blue-50 text-blue-800">9</Button>
        <Button variant="outline" onClick={() => inputOperation("*")} className="h-10 bg-orange-100 text-orange-700">×</Button>

        <Button variant="outline" onClick={() => inputNumber("4")} className="h-10 bg-blue-50 text-blue-800">4</Button>
        <Button variant="outline" onClick={() => inputNumber("5")} className="h-10 bg-blue-50 text-blue-800">5</Button>
        <Button variant="outline" onClick={() => inputNumber("6")} className="h-10 bg-blue-50 text-blue-800">6</Button>
        <Button variant="outline" onClick={() => inputOperation("-")} className="h-10 bg-orange-100 text-orange-700">-</Button>

        <Button variant="outline" onClick={() => inputNumber("1")} className="h-10 bg-blue-50 text-blue-800">1</Button>
        <Button variant="outline" onClick={() => inputNumber("2")} className="h-10 bg-blue-50 text-blue-800">2</Button>
        <Button variant="outline" onClick={() => inputNumber("3")} className="h-10 bg-blue-50 text-blue-800">3</Button>
        <Button variant="outline" onClick={() => inputOperation("+")} className="h-10 bg-orange-100 text-orange-700">+</Button>

        <Button variant="outline" onClick={() => inputNumber("0")} className="col-span-2 h-10 bg-blue-50 text-blue-800">0</Button>
        <Button variant="outline" onClick={inputDecimal} className="h-10 bg-gray-100 text-gray-700">.</Button>
        <Button 
          onClick={performCalculation}
          className="h-10 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold"
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
          <Button variant="outline" size="sm" onClick={() => setHistory([])}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-40">
          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucun calcul effectué</p>
          ) : (
            <div className="space-y-2">
              {history.map((calc, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-mono cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    const result = calc.split(" = ")[1];
                    if (result) {
                      setDisplay(result);
                      setWaitingForNewValue(true);
                    }
                  }}
                >
                  {calc}
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
        <div className="text-center space-y-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl border-2 border-blue-200">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-full">
              <Calculator className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Calculatrices Avancées
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Effectuez vos calculs avec précision grâce à notre calculatrice basique ou scientifique. 
            Support complet du clavier et historique des opérations.
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary">Saisie clavier</Badge>
            <Badge variant="secondary">Fonctions scientifiques</Badge>
            <Badge variant="secondary">Historique sauvegardé</Badge>
          </div>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger 
              value="basic" 
              className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
            >
              Calculatrice Basique
            </TabsTrigger>
            <TabsTrigger 
              value="scientific" 
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
            >
              Calculatrice Scientifique
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
            >
              Historique
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <Card className="max-w-md mx-auto shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="flex items-center gap-2 justify-center">
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
            <Card className="max-w-4xl mx-auto shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                <CardTitle className="flex items-center gap-2 justify-center">
                  <Zap className="w-5 h-5" />
                  Calculatrice Scientifique
                  <Badge variant="secondary">30+ fonctions avancées</Badge>
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
