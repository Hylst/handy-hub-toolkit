
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, RotateCcw, Code, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProgrammerCalculatorProps {
  history: string[];
  setHistory: (history: string[]) => void;
  clearAll: () => void;
}

type NumberBase = 'dec' | 'hex' | 'oct' | 'bin';

export const ProgrammerCalculator: React.FC<ProgrammerCalculatorProps> = ({
  history,
  setHistory,
  clearAll,
}) => {
  const [value, setValue] = useState<string>("0");
  const [inputBase, setInputBase] = useState<NumberBase>('dec');
  const [expression, setExpression] = useState<string>("");
  const { toast } = useToast();

  const addToHistory = (calculation: string) => {
    setHistory([calculation, ...history.slice(0, 19)]);
  };

  // Convert number between bases
  const convertToBase = (num: number, base: NumberBase): string => {
    switch (base) {
      case 'dec': return num.toString(10);
      case 'hex': return num.toString(16).toUpperCase();
      case 'oct': return num.toString(8);
      case 'bin': return num.toString(2);
      default: return num.toString(10);
    }
  };

  const parseFromBase = (str: string, base: NumberBase): number => {
    switch (base) {
      case 'dec': return parseInt(str, 10);
      case 'hex': return parseInt(str, 16);
      case 'oct': return parseInt(str, 8);
      case 'bin': return parseInt(str, 2);
      default: return parseInt(str, 10);
    }
  };

  const getCurrentNumber = (): number => {
    return parseFromBase(value, inputBase) || 0;
  };

  const setCurrentNumber = (num: number) => {
    setValue(convertToBase(num, inputBase));
  };

  // Bitwise operations
  const performBitwiseOperation = (op: string) => {
    const currentNum = getCurrentNumber();
    
    switch (op) {
      case 'NOT':
        const result = ~currentNum;
        const expr = `NOT ${value}(${inputBase})`;
        addToHistory(`${expr} = ${convertToBase(result, inputBase)}`);
        setCurrentNumber(result);
        break;
      case 'LSH':
        const lshResult = currentNum << 1;
        const lshExpr = `${value}(${inputBase}) << 1`;
        addToHistory(`${lshExpr} = ${convertToBase(lshResult, inputBase)}`);
        setCurrentNumber(lshResult);
        break;
      case 'RSH':
        const rshResult = currentNum >> 1;
        const rshExpr = `${value}(${inputBase}) >> 1`;
        addToHistory(`${rshExpr} = ${convertToBase(rshResult, inputBase)}`);
        setCurrentNumber(rshResult);
        break;
    }
  };

  const performBinaryOperation = (op: string) => {
    if (expression) {
      const prevNum = parseFromBase(expression.split(' ')[0], inputBase);
      const currentNum = getCurrentNumber();
      let result = 0;
      
      switch (op) {
        case 'AND': result = prevNum & currentNum; break;
        case 'OR': result = prevNum | currentNum; break;
        case 'XOR': result = prevNum ^ currentNum; break;
        case 'NAND': result = ~(prevNum & currentNum); break;
        case 'NOR': result = ~(prevNum | currentNum); break;
        default: return;
      }
      
      const expr = `${expression} ${op} ${value}(${inputBase})`;
      addToHistory(`${expr} = ${convertToBase(result, inputBase)}`);
      setCurrentNumber(result);
      setExpression("");
    } else {
      setExpression(`${value} ${op}`);
    }
  };

  const handleNumberInput = (digit: string) => {
    const validDigits = {
      'bin': '01',
      'oct': '01234567',
      'dec': '0123456789',
      'hex': '0123456789ABCDEF'
    };

    if (validDigits[inputBase].includes(digit)) {
      setValue(prev => prev === "0" ? digit : prev + digit);
    }
  };

  const clearLocal = () => {
    setValue("0");
    setExpression("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: `${text} copié dans le presse-papiers`,
    });
  };

  const currentNumber = getCurrentNumber();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-lg border-2">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50">
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Calculatrice Programmeur
            <Badge variant="secondary" className="text-xs">Bases numériques</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Affichage simultané des 4 bases */}
          <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border">
            <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
              <span>HEX</span>
              <span>DEC</span>
              <span>OCT</span>
              <span>BIN</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className={`p-2 rounded text-center font-mono ${inputBase === 'hex' ? 'bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-600' : 'bg-white dark:bg-gray-800'}`}>
                {convertToBase(currentNumber, 'hex')}
              </div>
              <div className={`p-2 rounded text-center font-mono ${inputBase === 'dec' ? 'bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-600' : 'bg-white dark:bg-gray-800'}`}>
                {convertToBase(currentNumber, 'dec')}
              </div>
              <div className={`p-2 rounded text-center font-mono ${inputBase === 'oct' ? 'bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-600' : 'bg-white dark:bg-gray-800'}`}>
                {convertToBase(currentNumber, 'oct')}
              </div>
              <div className={`p-2 rounded text-center font-mono text-xs break-all ${inputBase === 'bin' ? 'bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-600' : 'bg-white dark:bg-gray-800'}`}>
                {convertToBase(currentNumber, 'bin')}
              </div>
            </div>
          </div>

          {/* Base selector */}
          <div className="flex gap-2">
            <Select value={inputBase} onValueChange={(value: NumberBase) => setInputBase(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dec">DEC (10)</SelectItem>
                <SelectItem value="hex">HEX (16)</SelectItem>
                <SelectItem value="oct">OCT (8)</SelectItem>
                <SelectItem value="bin">BIN (2)</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={clearLocal}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Display */}
          <div className="space-y-2">
            {expression && (
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
                {expression}
              </div>
            )}
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="text-right text-xl font-mono bg-gray-50 dark:bg-gray-900"
              placeholder="0"
            />
          </div>

          {/* Opérations logiques principales */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="default"
              onClick={() => performBinaryOperation('AND')}
              className="h-12 text-sm bg-green-600 hover:bg-green-700"
            >
              AND
            </Button>
            <Button
              variant="default"
              onClick={() => performBinaryOperation('OR')}
              className="h-12 text-sm bg-blue-600 hover:bg-blue-700"
            >
              OR
            </Button>
            <Button
              variant="default"
              onClick={() => performBinaryOperation('XOR')}
              className="h-12 text-sm bg-purple-600 hover:bg-purple-700"
            >
              XOR
            </Button>
          </div>

          {/* Opérations logiques avancées */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="default"
              onClick={() => performBinaryOperation('NAND')}
              className="h-12 text-sm bg-orange-600 hover:bg-orange-700"
            >
              NAND
            </Button>
            <Button
              variant="default"
              onClick={() => performBinaryOperation('NOR')}
              className="h-12 text-sm bg-red-600 hover:bg-red-700"
            >
              NOR
            </Button>
            <Button
              variant="default"
              onClick={() => performBitwiseOperation('NOT')}
              className="h-12 text-sm bg-gray-600 hover:bg-gray-700"
            >
              NOT
            </Button>
          </div>

          {/* Chiffres hexadécimaux */}
          {inputBase === 'hex' && (
            <div className="grid grid-cols-3 gap-2">
              {['A', 'B', 'C', 'D', 'E', 'F'].map(digit => (
                <Button
                  key={digit}
                  variant="outline"
                  onClick={() => handleNumberInput(digit)}
                  className="h-12 text-lg bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:hover:bg-yellow-800/50"
                >
                  {digit}
                </Button>
              ))}
            </div>
          )}

          {/* Chiffres numériques */}
          <div className="grid grid-cols-4 gap-2">
            {['7', '8', '9'].map(digit => (
              <Button
                key={digit}
                variant="outline"
                onClick={() => handleNumberInput(digit)}
                className="h-12 text-lg"
                disabled={
                  (inputBase === 'oct' && parseInt(digit) >= 8) ||
                  (inputBase === 'bin' && parseInt(digit) >= 2)
                }
              >
                {digit}
              </Button>
            ))}
            <Button
              variant="default"
              onClick={() => performBitwiseOperation('LSH')}
              className="h-12 text-sm bg-indigo-600 hover:bg-indigo-700"
            >
              &lt;&lt;
            </Button>

            {['4', '5', '6'].map(digit => (
              <Button
                key={digit}
                variant="outline"
                onClick={() => handleNumberInput(digit)}
                className="h-12 text-lg"
                disabled={inputBase === 'bin' && parseInt(digit) >= 2}
              >
                {digit}
              </Button>
            ))}
            <Button
              variant="default"
              onClick={() => performBitwiseOperation('RSH')}
              className="h-12 text-sm bg-indigo-600 hover:bg-indigo-700"
            >
              &gt;&gt;
            </Button>

            {['1', '2', '3'].map(digit => (
              <Button
                key={digit}
                variant="outline"
                onClick={() => handleNumberInput(digit)}
                className="h-12 text-lg"
                disabled={inputBase === 'bin' && parseInt(digit) >= 2}
              >
                {digit}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => copyToClipboard(value)}
              className="h-12"
            >
              <Copy className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              onClick={() => handleNumberInput('0')}
              className="col-span-4 h-12 text-lg"
            >
              0
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Conversions panel amélioré */}
      <Card className="shadow-lg border-2">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50">
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-green-600 dark:text-green-400" />
            Conversions & Informations
            <Badge variant="secondary" className="text-xs">Temps réel</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <span className="font-medium text-blue-700 dark:text-blue-300">Décimal (DEC):</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg">{convertToBase(currentNumber, 'dec')}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(convertToBase(currentNumber, 'dec'))}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <span className="font-medium text-orange-700 dark:text-orange-300">Hexadécimal (HEX):</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg">0x{convertToBase(currentNumber, 'hex')}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard('0x' + convertToBase(currentNumber, 'hex'))}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <span className="font-medium text-purple-700 dark:text-purple-300">Octal (OCT):</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg">0{convertToBase(currentNumber, 'oct')}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard('0' + convertToBase(currentNumber, 'oct'))}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <span className="font-medium text-green-700 dark:text-green-300">Binaire (BIN):</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg break-all">0b{convertToBase(currentNumber, 'bin')}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard('0b' + convertToBase(currentNumber, 'bin'))}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bit representation avec groupement par 8 bits */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Représentation 32-bit (par octets):</h4>
            <div className="font-mono text-xs break-all bg-white dark:bg-gray-800 p-3 rounded border space-y-1">
              {convertToBase(currentNumber, 'bin').padStart(32, '0').match(/.{1,8}/g)?.map((byte, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-500">Byte {3-index}:</span>
                  <span>{byte}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Informations:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Bits utilisés:</span>
                <span className="font-mono">{Math.max(1, Math.floor(Math.log2(Math.abs(currentNumber) || 1)) + 1)}</span>
              </div>
              <div className="flex justify-between">
                <span>Signe:</span>
                <span className="font-mono">{currentNumber >= 0 ? 'Positif' : 'Négatif'}</span>
              </div>
              <div className="flex justify-between">
                <span>Parité:</span>
                <span className="font-mono">{currentNumber % 2 === 0 ? 'Pair' : 'Impair'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
