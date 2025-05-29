
import { useState, useEffect } from "react";

export const useCalculatorState = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [isRadians, setIsRadians] = useState(true);
  const [lastAnswer, setLastAnswer] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;
      
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
    setHistory(prev => [calculation, ...prev.slice(0, 19)]);
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
  };

  const clearAll = () => {
    clear();
    setMemory(0);
    setHistory([]);
    setLastAnswer(0);
  };

  return {
    display,
    previousValue,
    operation,
    waitingForNewValue,
    memory,
    history,
    isRadians,
    lastAnswer,
    setHistory,
    setIsRadians,
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
    clear,
    clearAll,
    copyToClipboard,
    formatNumber
  };
};
