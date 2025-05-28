
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRightLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UnitDefinition, TemperatureUnit, ConversionType } from '../types/unitTypes';
import { convertWithFactors, convertTemperature, convertCurrency, sanitizeInput } from '../utils/conversionUtils';
import { getDetailedExplanatoryNote } from '../utils/explanatoryNotes';

interface ConversionTabProps {
  title: string;
  icon: React.ReactNode;
  units: Record<string, UnitDefinition | TemperatureUnit>;
  defaultFromUnit: string;
  defaultToUnit: string;
  conversionType: ConversionType;
  color?: string;
}

export const ConversionTab: React.FC<ConversionTabProps> = ({
  title,
  icon,
  units,
  defaultFromUnit,
  defaultToUnit,
  conversionType,
  color = "blue"
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState<string>(defaultFromUnit);
  const [toUnit, setToUnit] = useState<string>(defaultToUnit);
  const [result, setResult] = useState<string>("");

  // Convert function based on type
  const performConversion = (value: string, from: string, to: string): string => {
    console.log(`Converting ${value} from ${from} to ${to} (type: ${conversionType})`);
    
    if (!value || value.trim() === "") return "";
    
    const sanitized = sanitizeInput(value);
    if (!sanitized || isNaN(parseFloat(sanitized))) return "";

    switch (conversionType) {
      case "temperature":
        return convertTemperature(sanitized, from, to);
      case "currency":
        return convertCurrency(sanitized, from, to, units);
      default:
        return convertWithFactors(sanitized, from, to, units);
    }
  };

  // Update result when input or units change (with debounce effect)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newResult = performConversion(inputValue, fromUnit, toUnit);
      setResult(newResult);
      console.log(`Conversion result: ${newResult}`);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue, fromUnit, toUnit, conversionType]);

  const handleInputChange = (value: string) => {
    console.log(`Input changed: ${value}`);
    setInputValue(value);
  };

  const swapUnits = () => {
    console.log(`Swapping units: ${fromUnit} <-> ${toUnit}`);
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const clearInput = () => {
    setInputValue("");
    setResult("");
  };

  const useResult = () => {
    if (result) {
      setInputValue(result);
    }
  };

  return (
    <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow">
      <CardHeader className={`bg-gradient-to-r from-${color}-50 to-${color}-100 dark:from-${color}-950/50 dark:to-${color}-900/50`}>
        <CardTitle className="flex items-center gap-3">
          <div className={`p-2 bg-${color}-100 dark:bg-${color}-800 rounded-full`}>
            {icon}
          </div>
          {title}
          <Badge variant="secondary" className="text-xs">Documentation SI</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Valeur à convertir
            </label>
            <Input
              type="text"
              placeholder="Entrez une valeur..."
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              className="text-lg font-mono border-2 focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Unité source
            </label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger className="border-2 bg-white dark:bg-gray-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50">
                {Object.entries(units).map(([key, unit]: [string, any]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <span>{unit.name}</span>
                      <Badge variant="outline" className="text-xs">{unit.symbol}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={swapUnits}
              className="hover:bg-blue-50 dark:hover:bg-blue-900"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Unité cible
          </label>
          <Select value={toUnit} onValueChange={setToUnit}>
            <SelectTrigger className="border-2 bg-white dark:bg-gray-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50">
              {Object.entries(units).map(([key, unit]: [string, any]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <span>{unit.name}</span>
                    <Badge variant="outline" className="text-xs">{unit.symbol}</Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className={`p-6 bg-gradient-to-r from-${color}-50 to-${color}-100 dark:from-${color}-900/20 dark:to-${color}-800/20 rounded-xl border-2 border-${color}-200 dark:border-${color}-700/50`}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-1 bg-${color}-200 dark:bg-${color}-700/50 rounded-full`}>
              <Info className={`w-4 h-4 text-${color}-600 dark:text-${color}-400`} />
            </div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-100">
              Résultat de la conversion
            </p>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white font-mono break-all bg-white/50 dark:bg-gray-800/50 p-3 rounded border dark:border-gray-600">
            {result} {result && units[toUnit]?.symbol}
          </p>
          {inputValue && result && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              {inputValue} {units[fromUnit]?.symbol} = {result} {units[toUnit]?.symbol}
            </p>
          )}
        </div>

        <Alert className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
          <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <div dangerouslySetInnerHTML={{ 
              __html: getDetailedExplanatoryNote(conversionType, fromUnit, toUnit)
            }} />
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearInput}
          >
            Effacer
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={useResult}
            disabled={!result}
          >
            Utiliser le résultat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
