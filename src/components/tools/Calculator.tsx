import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { History, RotateCcw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Calculator = () => {
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
      } else if (event.key === 'Delete') {
        clearAll();
      } else if (event.key === '%') {
        scientificFunction('percent');
      } else if (event.key === '^') {
        inputOperation('^');
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
      case "mod":
        return firstValue % secondValue;
      case "nCr":
        return combination(firstValue, secondValue);
      case "nPr":
        return permutation(firstValue, secondValue);
      case "gcd":
        return gcd(firstValue, secondValue);
      case "lcm":
        return lcm(firstValue, secondValue);
      case "=":
        return secondValue;
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
        case "asin":
          result = Math.asin(value);
          if (!isRadians) result = result * 180 / Math.PI;
          break;
        case "acos":
          result = Math.acos(value);
          if (!isRadians) result = result * 180 / Math.PI;
          break;
        case "atan":
          result = Math.atan(value);
          if (!isRadians) result = result * 180 / Math.PI;
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
        case "10^x":
          result = Math.pow(10, value);
          break;
        case "2^x":
          result = Math.pow(2, value);
          break;
        case "1/x":
          result = 1 / value;
          break;
        case "abs":
          result = Math.abs(value);
          break;
        case "ceil":
          result = Math.ceil(value);
          break;
        case "floor":
          result = Math.floor(value);
          break;
        case "round":
          result = Math.round(value);
          break;
        case "percent":
          result = value / 100;
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
        case "gamma":
          result = gamma(value);
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

  const combination = (n: number, r: number): number => {
    if (r > n || r < 0) return NaN;
    return factorial(n) / (factorial(r) * factorial(n - r));
  };

  const permutation = (n: number, r: number): number => {
    if (r > n || r < 0) return NaN;
    return factorial(n) / factorial(n - r);
  };

  const gcd = (a: number, b: number): number => {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  };

  const lcm = (a: number, b: number): number => {
    return Math.abs(a * b) / gcd(a, b);
  };

  const gamma = (z: number): number => {
    // Approximation de Stirling pour la fonction gamma
    if (z < 0.5) {
      return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    }
    z -= 1;
    let x = 0.99999999999980993;
    const coefficients = [
      676.5203681218851, -1259.1392167224028, 771.32342877765313,
      -176.61502916214059, 12.507343278686905, -0.13857109526572012,
      9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    
    for (let i = 0; i < coefficients.length; i++) {
      x += coefficients[i] / (z + i + 1);
    }
    
    const t = z + coefficients.length - 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
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

  const memoryStore = () => {
    setMemory(parseFloat(display));
  };

  const memoryRecall = () => {
    setDisplay(formatNumber(memory));
    setWaitingForNewValue(true);
  };

  const memoryClear = () => {
    setMemory(0);
  };

  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
  };

  const BasicCalculator = () => (
    <div className="space-y-4">
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-right">
        <div className="text-xs text-gray-500 mb-1">
          {operation && previousValue !== null && `${previousValue} ${operation}`}
        </div>
        <div className="text-3xl font-mono font-bold text-gray-800 dark:text-gray-100 break-all">
          {display}
        </div>
        <div className="text-xs text-gray-500 mt-1 flex justify-between">
          <span>Mémoire: {memory !== 0 ? memory : "vide"}</span>
          <span className="text-green-600">Clavier activé</span>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        <Button variant="destructive" onClick={clearAll} className="col-span-2">
          Clear All
        </Button>
        <Button variant="outline" onClick={() => inputOperation("/")} className="text-lg">
          ÷
        </Button>
        <Button variant="outline" onClick={() => inputOperation("*")} className="text-lg">
          ×
        </Button>
        
        <Button variant="outline" onClick={() => inputNumber("7")} className="text-lg">7</Button>
        <Button variant="outline" onClick={() => inputNumber("8")} className="text-lg">8</Button>
        <Button variant="outline" onClick={() => inputNumber("9")} className="text-lg">9</Button>
        <Button variant="outline" onClick={() => inputOperation("-")} className="text-lg">-</Button>
        
        <Button variant="outline" onClick={() => inputNumber("4")} className="text-lg">4</Button>
        <Button variant="outline" onClick={() => inputNumber("5")} className="text-lg">5</Button>
        <Button variant="outline" onClick={() => inputNumber("6")} className="text-lg">6</Button>
        <Button variant="outline" onClick={() => inputOperation("+")} className="text-lg row-span-2">+</Button>
        
        <Button variant="outline" onClick={() => inputNumber("1")} className="text-lg">1</Button>
        <Button variant="outline" onClick={() => inputNumber("2")} className="text-lg">2</Button>
        <Button variant="outline" onClick={() => inputNumber("3")} className="text-lg">3</Button>
        
        <Button variant="outline" onClick={() => inputNumber("0")} className="col-span-2 text-lg">0</Button>
        <Button variant="outline" onClick={inputDecimal} className="text-lg">.</Button>
        <Button 
          onClick={performCalculation}
          className="bg-gradient-to-r from-blue-600 to-teal-600 text-lg"
        >
          =
        </Button>
      </div>
      
      <div className="text-xs text-gray-500 p-2 bg-gray-50 dark:bg-gray-800 rounded">
        <strong>Raccourcis clavier:</strong> 0-9 (nombres), +,-,*,/ (opérations), Enter/= (résultat), Échap (effacer), Backspace (supprimer), Del (tout effacer)
      </div>
    </div>
  );

  const ScientificCalculator = () => (
    <div className="space-y-4">
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-right">
        <div className="text-xs text-gray-500 mb-1 flex justify-between">
          <span>{operation && previousValue !== null && `${previousValue} ${operation}`}</span>
          <Badge variant={isRadians ? "default" : "secondary"}>
            {isRadians ? "RAD" : "DEG"}
          </Badge>
        </div>
        <div className="text-3xl font-mono font-bold text-gray-800 dark:text-gray-100 break-all">
          {display}
        </div>
        <div className="text-xs text-gray-500 mt-1 flex justify-between">
          <span>Mémoire: {memory !== 0 ? memory : "vide"}</span>
          <span className="text-green-600">Clavier activé</span>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 text-sm">
        {/* Ligne 1 - Fonctions mémoire et mode */}
        <Button variant="outline" onClick={memoryClear} size="sm">MC</Button>
        <Button variant="outline" onClick={memoryRecall} size="sm">MR</Button>
        <Button variant="outline" onClick={memoryStore} size="sm">MS</Button>
        <Button variant="outline" onClick={memoryAdd} size="sm">M+</Button>
        <Button 
          variant={isRadians ? "default" : "outline"} 
          onClick={() => setIsRadians(!isRadians)} 
          size="sm"
        >
          {isRadians ? "RAD" : "DEG"}
        </Button>
        <Button variant="destructive" onClick={clearAll} size="sm">AC</Button>

        {/* Ligne 2 - Fonctions trigonométriques */}
        <Button variant="outline" onClick={() => scientificFunction("sin")} size="sm">sin</Button>
        <Button variant="outline" onClick={() => scientificFunction("cos")} size="sm">cos</Button>
        <Button variant="outline" onClick={() => scientificFunction("tan")} size="sm">tan</Button>
        <Button variant="outline" onClick={() => scientificFunction("asin")} size="sm">sin⁻¹</Button>
        <Button variant="outline" onClick={() => scientificFunction("acos")} size="sm">cos⁻¹</Button>
        <Button variant="outline" onClick={() => scientificFunction("atan")} size="sm">tan⁻¹</Button>

        {/* Ligne 3 - Fonctions hyperboliques */}
        <Button variant="outline" onClick={() => scientificFunction("sinh")} size="sm">sinh</Button>
        <Button variant="outline" onClick={() => scientificFunction("cosh")} size="sm">cosh</Button>
        <Button variant="outline" onClick={() => scientificFunction("tanh")} size="sm">tanh</Button>
        <Button variant="outline" onClick={() => scientificFunction("gamma")} size="sm">Γ</Button>
        <Button variant="outline" onClick={() => inputOperation("nCr")} size="sm">nCr</Button>
        <Button variant="outline" onClick={() => inputOperation("nPr")} size="sm">nPr</Button>

        {/* Ligne 4 - Logarithmes et exponentielles */}
        <Button variant="outline" onClick={() => scientificFunction("ln")} size="sm">ln</Button>
        <Button variant="outline" onClick={() => scientificFunction("log")} size="sm">log₁₀</Button>
        <Button variant="outline" onClick={() => scientificFunction("log2")} size="sm">log₂</Button>
        <Button variant="outline" onClick={() => scientificFunction("exp")} size="sm">eˣ</Button>
        <Button variant="outline" onClick={() => scientificFunction("10^x")} size="sm">10ˣ</Button>
        <Button variant="outline" onClick={() => scientificFunction("2^x")} size="sm">2ˣ</Button>

        {/* Ligne 5 - Puissances et racines */}
        <Button variant="outline" onClick={() => inputOperation("^")} size="sm">xʸ</Button>
        <Button variant="outline" onClick={() => scientificFunction("sqrt")} size="sm">√</Button>
        <Button variant="outline" onClick={() => scientificFunction("cbrt")} size="sm">∛</Button>
        <Button variant="outline" onClick={() => scientificFunction("square")} size="sm">x²</Button>
        <Button variant="outline" onClick={() => scientificFunction("cube")} size="sm">x³</Button>
        <Button variant="outline" onClick={() => scientificFunction("1/x")} size="sm">1/x</Button>

        {/* Ligne 6 - Fonctions spéciales */}
        <Button variant="outline" onClick={() => scientificFunction("factorial")} size="sm">x!</Button>
        <Button variant="outline" onClick={() => scientificFunction("abs")} size="sm">|x|</Button>
        <Button variant="outline" onClick={() => scientificFunction("ceil")} size="sm">⌈x⌉</Button>
        <Button variant="outline" onClick={() => scientificFunction("floor")} size="sm">⌊x⌋</Button>
        <Button variant="outline" onClick={() => scientificFunction("round")} size="sm">round</Button>
        <Button variant="outline" onClick={() => scientificFunction("percent")} size="sm">%</Button>

        {/* Ligne 7 - Constantes et opérations */}
        <Button variant="outline" onClick={() => scientificFunction("pi")} size="sm">π</Button>
        <Button variant="outline" onClick={() => scientificFunction("e")} size="sm">e</Button>
        <Button variant="outline" onClick={() => scientificFunction("random")} size="sm">rand</Button>
        <Button variant="outline" onClick={() => inputOperation("mod")} size="sm">mod</Button>
        <Button variant="outline" onClick={() => inputOperation("gcd")} size="sm">pgcd</Button>
        <Button variant="outline" onClick={() => inputOperation("lcm")} size="sm">ppcm</Button>

        {/* Lignes 8-10 - Clavier numérique */}
        <Button variant="outline" onClick={() => inputNumber("7")} className="text-lg">7</Button>
        <Button variant="outline" onClick={() => inputNumber("8")} className="text-lg">8</Button>
        <Button variant="outline" onClick={() => inputNumber("9")} className="text-lg">9</Button>
        <Button variant="outline" onClick={() => inputOperation("/")} className="text-lg">÷</Button>
        <Button variant="outline" onClick={backspace} className="col-span-2">⌫</Button>

        <Button variant="outline" onClick={() => inputNumber("4")} className="text-lg">4</Button>
        <Button variant="outline" onClick={() => inputNumber("5")} className="text-lg">5</Button>
        <Button variant="outline" onClick={() => inputNumber("6")} className="text-lg">6</Button>
        <Button variant="outline" onClick={() => inputOperation("*")} className="text-lg">×</Button>
        <Button variant="outline" onClick={() => inputNumber("(")} size="sm">(</Button>
        <Button variant="outline" onClick={() => inputNumber(")")} size="sm">)</Button>

        <Button variant="outline" onClick={() => inputNumber("1")} className="text-lg">1</Button>
        <Button variant="outline" onClick={() => inputNumber("2")} className="text-lg">2</Button>
        <Button variant="outline" onClick={() => inputNumber("3")} className="text-lg">3</Button>
        <Button variant="outline" onClick={() => inputOperation("-")} className="text-lg">-</Button>
        <Button variant="outline" onClick={() => scientificFunction("negate")} className="col-span-2">±</Button>

        <Button variant="outline" onClick={() => inputNumber("0")} className="col-span-2 text-lg">0</Button>
        <Button variant="outline" onClick={inputDecimal} className="text-lg">.</Button>
        <Button variant="outline" onClick={() => inputOperation("+")} className="text-lg">+</Button>
        <Button 
          onClick={performCalculation}
          className="bg-gradient-to-r from-blue-600 to-teal-600 text-lg col-span-2"
        >
          =
        </Button>
      </div>
      
      <div className="text-xs text-gray-500 p-2 bg-gray-50 dark:bg-gray-800 rounded">
        <strong>Raccourcis clavier:</strong> 0-9, +,-,*,/,^,%, Enter/=, Échap, Backspace, Del
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
                  className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm font-mono cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
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
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basique</TabsTrigger>
          <TabsTrigger value="scientific">Scientifique</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Calculatrice Basique
                <Badge variant="secondary">Clavier Activé</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BasicCalculator />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scientific">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Calculatrice Scientifique
                <Badge variant="secondary">Fonctions Avancées</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
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
  );
};
