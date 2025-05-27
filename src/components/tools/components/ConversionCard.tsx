
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRightLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ConversionCardProps } from '../types/unitTypes';
import { getDetailedExplanatoryNote } from '../utils/explanatoryNotes';

export const ConversionCard: React.FC<ConversionCardProps> = ({ 
  title, 
  icon,
  inputValue,
  setInputValue,
  fromUnit, 
  setFromUnit, 
  toUnit, 
  setToUnit, 
  units, 
  convertFunction, 
  swapType,
  color = "blue"
}) => {
  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
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
              onChange={(e) => setInputValue(e.target.value)}
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
            {convertFunction()} {units[toUnit]?.symbol}
          </p>
          {inputValue && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              {inputValue} {units[fromUnit]?.symbol} = {convertFunction()} {units[toUnit]?.symbol}
            </p>
          )}
        </div>

        <Alert className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
          <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <div dangerouslySetInnerHTML={{ 
              __html: getDetailedExplanatoryNote(swapType as any, fromUnit, toUnit)
            }} />
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setInputValue("")}
          >
            Effacer
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              const result = convertFunction();
              if (result) {
                setInputValue(result);
              }
            }}
          >
            Utiliser le résultat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
