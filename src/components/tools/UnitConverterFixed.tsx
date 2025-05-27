
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightLeft, Info, Ruler, Weight, Thermometer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDebouncedInput } from "@/hooks/useDebouncedInput";

export const UnitConverterFixed = () => {
  // Utilisation du hook débounce pour les longueurs
  const lengthInput = useDebouncedInput("", 200);
  const [lengthFrom, setLengthFrom] = useState("meter");
  const [lengthTo, setLengthTo] = useState("kilometer");

  // Utilisation du hook débounce pour les poids
  const weightInput = useDebouncedInput("", 200);
  const [weightFrom, setWeightFrom] = useState("kilogram");
  const [weightTo, setWeightTo] = useState("gram");

  // Utilisation du hook débounce pour les températures
  const tempInput = useDebouncedInput("", 200);
  const [tempFrom, setTempFrom] = useState("celsius");
  const [tempTo, setTempTo] = useState("fahrenheit");

  // Définitions des unités (version simplifiée pour démonstration)
  const lengthUnits = {
    meter: { name: "Mètre", factor: 1, symbol: "m" },
    kilometer: { name: "Kilomètre", factor: 1000, symbol: "km" },
    centimeter: { name: "Centimètre", factor: 0.01, symbol: "cm" },
    millimeter: { name: "Millimètre", factor: 0.001, symbol: "mm" },
    inch: { name: "Pouce", factor: 0.0254, symbol: "in" },
    foot: { name: "Pied", factor: 0.3048, symbol: "ft" }
  };

  const weightUnits = {
    kilogram: { name: "Kilogramme", factor: 1, symbol: "kg" },
    gram: { name: "Gramme", factor: 0.001, symbol: "g" },
    pound: { name: "Livre", factor: 0.453592, symbol: "lb" },
    ounce: { name: "Once", factor: 0.0283495, symbol: "oz" }
  };

  const temperatureUnits = {
    celsius: { name: "Celsius", symbol: "°C" },
    fahrenheit: { name: "Fahrenheit", symbol: "°F" },
    kelvin: { name: "Kelvin", symbol: "K" }
  };

  // Fonctions de conversion utilisant les valeurs debouncées
  const convertLength = useCallback(() => {
    const value = lengthInput.debouncedValue;
    if (!value || isNaN(parseFloat(value))) return "";
    
    const fromFactor = lengthUnits[lengthFrom as keyof typeof lengthUnits].factor;
    const toFactor = lengthUnits[lengthTo as keyof typeof lengthUnits].factor;
    const result = (parseFloat(value) * fromFactor) / toFactor;
    
    return result.toFixed(6).replace(/\.?0+$/, "");
  }, [lengthInput.debouncedValue, lengthFrom, lengthTo]);

  const convertWeight = useCallback(() => {
    const value = weightInput.debouncedValue;
    if (!value || isNaN(parseFloat(value))) return "";
    
    const fromFactor = weightUnits[weightFrom as keyof typeof weightUnits].factor;
    const toFactor = weightUnits[weightTo as keyof typeof weightUnits].factor;
    const result = (parseFloat(value) * fromFactor) / toFactor;
    
    return result.toFixed(6).replace(/\.?0+$/, "");
  }, [weightInput.debouncedValue, weightFrom, weightTo]);

  const convertTemperature = useCallback(() => {
    const value = tempInput.debouncedValue;
    if (!value || isNaN(parseFloat(value))) return "";
    
    const temp = parseFloat(value);
    let celsius: number;
    
    // Conversion vers Celsius
    switch (tempFrom) {
      case "celsius":
        celsius = temp;
        break;
      case "fahrenheit":
        celsius = (temp - 32) * 5/9;
        break;
      case "kelvin":
        celsius = temp - 273.15;
        break;
      default:
        celsius = temp;
    }
    
    // Conversion depuis Celsius
    let result: number;
    switch (tempTo) {
      case "celsius":
        result = celsius;
        break;
      case "fahrenheit":
        result = celsius * 9/5 + 32;
        break;
      case "kelvin":
        result = celsius + 273.15;
        break;
      default:
        result = celsius;
    }
    
    return result.toFixed(2);
  }, [tempInput.debouncedValue, tempFrom, tempTo]);

  const swapUnits = (type: string) => {
    switch (type) {
      case "length":
        const tempLength = lengthFrom;
        setLengthFrom(lengthTo);
        setLengthTo(tempLength);
        break;
      case "weight":
        const tempWeight = weightFrom;
        setWeightFrom(weightTo);
        setWeightTo(tempWeight);
        break;
      case "temperature":
        const tempTemp = tempFrom;
        setTempFrom(tempTo);
        setTempTo(tempTemp);
        break;
    }
  };

  // Composant de conversion générique avec gestion d'input améliorée
  const ConversionCard = ({ 
    title, 
    icon,
    inputHook,
    fromUnit, 
    setFromUnit, 
    toUnit, 
    setToUnit, 
    units, 
    convertFunction, 
    swapType,
    color = "blue"
  }: any) => (
    <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow">
      <CardHeader className={`bg-gradient-to-r from-${color}-50 to-${color}-100 dark:from-${color}-950/50 dark:to-${color}-900/50`}>
        <CardTitle className="flex items-center gap-3">
          <div className={`p-2 bg-${color}-100 dark:bg-${color}-800 rounded-full`}>
            {icon}
          </div>
          {title}
          <Badge variant="secondary" className="text-xs">Sans bug</Badge>
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
              value={inputHook.inputValue}
              onChange={(e) => inputHook.handleInputChange(e.target.value)}
              className="text-lg font-mono border-2 focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            {inputHook.inputValue !== inputHook.debouncedValue && (
              <p className="text-xs text-gray-500">Calcul en cours...</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Unité source
            </label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger className="border-2 bg-white dark:bg-gray-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60 bg-white dark:bg-gray-800">
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
              onClick={() => swapUnits(swapType)}
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
            <SelectContent className="max-h-60 bg-white dark:bg-gray-800">
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
        
        <div className={`p-6 bg-gradient-to-r from-${color}-50 to-${color}-100 dark:from-${color}-900/40 dark:to-${color}-800/40 rounded-xl border-2 border-${color}-200 dark:border-${color}-700`}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-1 bg-${color}-200 dark:bg-${color}-700 rounded-full`}>
              <Info className={`w-4 h-4 text-${color}-600 dark:text-${color}-300`} />
            </div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-100">
              Résultat (temps réel)
            </p>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white font-mono break-all">
            {convertFunction()} {units[toUnit]?.symbol}
          </p>
          {inputHook.debouncedValue && (
            <p className="text-sm text-gray-600 dark:text-gray-200 mt-2">
              {inputHook.debouncedValue} {units[fromUnit]?.symbol} = {convertFunction()} {units[toUnit]?.symbol}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={inputHook.resetInput}
          >
            Effacer
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              const result = convertFunction();
              if (result) {
                inputHook.setInputValue(result);
              }
            }}
          >
            Utiliser le résultat
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl border-2 border-blue-200 dark:border-blue-800">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Convertisseur d'Unités - Version Corrigée
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Version améliorée avec gestion intelligente de la saisie et débounce pour éviter les bugs d'input.
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge variant="secondary">✅ Bug de saisie corrigé</Badge>
          <Badge variant="secondary">⚡ Calcul en temps réel</Badge>
          <Badge variant="secondary">🎯 Haute précision</Badge>
        </div>
      </div>

      <Tabs defaultValue="length" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="length">
            <Ruler className="w-4 h-4 mr-1" />
            Longueurs
          </TabsTrigger>
          <TabsTrigger value="weight">
            <Weight className="w-4 h-4 mr-1" />
            Poids
          </TabsTrigger>
          <TabsTrigger value="temperature">
            <Thermometer className="w-4 h-4 mr-1" />
            Température
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="length">
          <ConversionCard
            title="Convertisseur de Longueurs"
            icon={<Ruler className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            inputHook={lengthInput}
            fromUnit={lengthFrom}
            setFromUnit={setLengthFrom}
            toUnit={lengthTo}
            setToUnit={setLengthTo}
            units={lengthUnits}
            convertFunction={convertLength}
            swapType="length"
            color="blue"
          />
        </TabsContent>
        
        <TabsContent value="weight">
          <ConversionCard
            title="Convertisseur de Poids"
            icon={<Weight className="w-5 h-5 text-green-600 dark:text-green-400" />}
            inputHook={weightInput}
            fromUnit={weightFrom}
            setFromUnit={setWeightFrom}
            toUnit={weightTo}
            setToUnit={setWeightTo}
            units={weightUnits}
            convertFunction={convertWeight}
            swapType="weight"
            color="green"
          />
        </TabsContent>
        
        <TabsContent value="temperature">
          <ConversionCard
            title="Convertisseur de Température"
            icon={<Thermometer className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
            inputHook={tempInput}
            fromUnit={tempFrom}
            setFromUnit={setTempFrom}
            toUnit={tempTo}
            setToUnit={setTempTo}
            units={temperatureUnits}
            convertFunction={convertTemperature}
            swapType="temperature"
            color="orange"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
