
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const UnitConverter = () => {
  // États pour les longueurs
  const [lengthValue, setLengthValue] = useState("");
  const [lengthFrom, setLengthFrom] = useState("meter");
  const [lengthTo, setLengthTo] = useState("kilometer");

  // États pour les poids
  const [weightValue, setWeightValue] = useState("");
  const [weightFrom, setWeightFrom] = useState("kilogram");
  const [weightTo, setWeightTo] = useState("gram");

  // États pour les températures
  const [tempValue, setTempValue] = useState("");
  const [tempFrom, setTempFrom] = useState("celsius");
  const [tempTo, setTempTo] = useState("fahrenheit");

  // États pour les volumes
  const [volumeValue, setVolumeValue] = useState("");
  const [volumeFrom, setVolumeFrom] = useState("liter");
  const [volumeTo, setVolumeTo] = useState("milliliter");

  const lengthUnits = {
    meter: { name: "Mètre", factor: 1, symbol: "m" },
    kilometer: { name: "Kilomètre", factor: 1000, symbol: "km" },
    centimeter: { name: "Centimètre", factor: 0.01, symbol: "cm" },
    millimeter: { name: "Millimètre", factor: 0.001, symbol: "mm" },
    inch: { name: "Pouce", factor: 0.0254, symbol: "in" },
    foot: { name: "Pied", factor: 0.3048, symbol: "ft" },
    yard: { name: "Yard", factor: 0.9144, symbol: "yd" },
    mile: { name: "Mile", factor: 1609.34, symbol: "mi" },
    nauticalMile: { name: "Mille nautique", factor: 1852, symbol: "nmi" },
    micrometers: { name: "Micromètre", factor: 0.000001, symbol: "μm" }
  };

  const weightUnits = {
    kilogram: { name: "Kilogramme", factor: 1, symbol: "kg" },
    gram: { name: "Gramme", factor: 0.001, symbol: "g" },
    milligram: { name: "Milligramme", factor: 0.000001, symbol: "mg" },
    pound: { name: "Livre", factor: 0.453592, symbol: "lb" },
    ounce: { name: "Once", factor: 0.0283495, symbol: "oz" },
    ton: { name: "Tonne", factor: 1000, symbol: "t" },
    stone: { name: "Stone", factor: 6.35029, symbol: "st" },
    carat: { name: "Carat", factor: 0.0002, symbol: "ct" }
  };

  const volumeUnits = {
    liter: { name: "Litre", factor: 1, symbol: "L" },
    milliliter: { name: "Millilitre", factor: 0.001, symbol: "mL" },
    gallon: { name: "Gallon US", factor: 3.78541, symbol: "gal" },
    quart: { name: "Quart", factor: 0.946353, symbol: "qt" },
    pint: { name: "Pinte", factor: 0.473176, symbol: "pt" },
    cup: { name: "Tasse", factor: 0.236588, symbol: "cup" },
    fluidOunce: { name: "Once liquide", factor: 0.0295735, symbol: "fl oz" },
    tablespoon: { name: "Cuillère à soupe", factor: 0.0147868, symbol: "tbsp" },
    teaspoon: { name: "Cuillère à café", factor: 0.00492892, symbol: "tsp" },
    cubicMeter: { name: "Mètre cube", factor: 1000, symbol: "m³" }
  };

  const convertLength = () => {
    if (!lengthValue) return "";
    const fromFactor = lengthUnits[lengthFrom as keyof typeof lengthUnits].factor;
    const toFactor = lengthUnits[lengthTo as keyof typeof lengthUnits].factor;
    const result = (parseFloat(lengthValue) * fromFactor) / toFactor;
    return formatResult(result);
  };

  const convertWeight = () => {
    if (!weightValue) return "";
    const fromFactor = weightUnits[weightFrom as keyof typeof weightUnits].factor;
    const toFactor = weightUnits[weightTo as keyof typeof weightUnits].factor;
    const result = (parseFloat(weightValue) * fromFactor) / toFactor;
    return formatResult(result);
  };

  const convertTemperature = () => {
    if (!tempValue) return "";
    const value = parseFloat(tempValue);
    let celsius: number;
    
    // Convertir vers Celsius d'abord
    switch (tempFrom) {
      case "celsius":
        celsius = value;
        break;
      case "fahrenheit":
        celsius = (value - 32) * 5/9;
        break;
      case "kelvin":
        celsius = value - 273.15;
        break;
      case "rankine":
        celsius = (value - 491.67) * 5/9;
        break;
      default:
        celsius = value;
    }
    
    // Convertir de Celsius vers l'unité de destination
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
      case "rankine":
        result = (celsius + 273.15) * 9/5;
        break;
      default:
        result = celsius;
    }
    
    return formatResult(result);
  };

  const convertVolume = () => {
    if (!volumeValue) return "";
    const fromFactor = volumeUnits[volumeFrom as keyof typeof volumeUnits].factor;
    const toFactor = volumeUnits[volumeTo as keyof typeof volumeUnits].factor;
    const result = (parseFloat(volumeValue) * fromFactor) / toFactor;
    return formatResult(result);
  };

  const formatResult = (result: number) => {
    if (result === 0) return "0";
    if (Math.abs(result) >= 1000000) {
      return result.toExponential(6);
    }
    if (Math.abs(result) < 0.000001 && result !== 0) {
      return result.toExponential(6);
    }
    return result.toFixed(8).replace(/\.?0+$/, "");
  };

  const swapUnits = (type: "length" | "weight" | "temperature" | "volume") => {
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
      case "volume":
        const tempVolume = volumeFrom;
        setVolumeFrom(volumeTo);
        setVolumeTo(tempVolume);
        break;
    }
  };

  const ConversionCard = ({ 
    title, 
    value, 
    setValue, 
    fromUnit, 
    setFromUnit, 
    toUnit, 
    setToUnit, 
    units, 
    convertFunction, 
    swapType 
  }: any) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          <Badge variant="secondary" className="text-xs">Précision élevée</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-sm font-medium mb-2 block">Valeur</label>
            <Input
              type="number"
              placeholder="Entrez une valeur"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="text-lg"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">De</label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
            <Button variant="outline" size="sm" onClick={() => swapUnits(swapType)}>
              <ArrowRightLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Vers</label>
          <Select value={toUnit} onValueChange={setToUnit}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
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
        
        <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-gray-600 font-medium">Résultat</p>
          </div>
          <p className="text-2xl font-bold text-gray-800 font-mono">
            {convertFunction()} {units[toUnit]?.symbol}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {value && `${value} ${units[fromUnit]?.symbol} = ${convertFunction()} ${units[toUnit]?.symbol}`}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="length" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="length">Longueurs</TabsTrigger>
          <TabsTrigger value="weight">Poids & Masse</TabsTrigger>
          <TabsTrigger value="temperature">Température</TabsTrigger>
          <TabsTrigger value="volume">Volume</TabsTrigger>
        </TabsList>
        
        <TabsContent value="length">
          <ConversionCard
            title="Convertisseur de Longueurs"
            value={lengthValue}
            setValue={setLengthValue}
            fromUnit={lengthFrom}
            setFromUnit={setLengthFrom}
            toUnit={lengthTo}
            setToUnit={setLengthTo}
            units={lengthUnits}
            convertFunction={convertLength}
            swapType="length"
          />
        </TabsContent>
        
        <TabsContent value="weight">
          <ConversionCard
            title="Convertisseur de Poids & Masse"
            value={weightValue}
            setValue={setWeightValue}
            fromUnit={weightFrom}
            setFromUnit={setWeightFrom}
            toUnit={weightTo}
            setToUnit={setWeightTo}
            units={weightUnits}
            convertFunction={convertWeight}
            swapType="weight"
          />
        </TabsContent>
        
        <TabsContent value="temperature">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Convertisseur de Température
                <Badge variant="secondary" className="text-xs">Formules exactes</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="text-sm font-medium mb-2 block">Température</label>
                  <Input
                    type="number"
                    placeholder="Entrez une température"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="text-lg"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">De</label>
                  <Select value={tempFrom} onValueChange={setTempFrom}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celsius">Celsius (°C)</SelectItem>
                      <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                      <SelectItem value="kelvin">Kelvin (K)</SelectItem>
                      <SelectItem value="rankine">Rankine (°R)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-center">
                  <Button variant="outline" size="sm" onClick={() => swapUnits("temperature")}>
                    <ArrowRightLeft className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Vers</label>
                <Select value={tempTo} onValueChange={setTempTo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="celsius">Celsius (°C)</SelectItem>
                    <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                    <SelectItem value="kelvin">Kelvin (K)</SelectItem>
                    <SelectItem value="rankine">Rankine (°R)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-orange-600" />
                  <p className="text-sm text-gray-600 font-medium">Résultat</p>
                </div>
                <p className="text-2xl font-bold text-gray-800 font-mono">
                  {convertTemperature()}°
                </p>
                {tempValue && (
                  <div className="mt-3 text-xs text-gray-500 space-y-1">
                    <p>• Point de congélation de l'eau: 0°C = 32°F = 273.15K</p>
                    <p>• Point d'ébullition de l'eau: 100°C = 212°F = 373.15K</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="volume">
          <ConversionCard
            title="Convertisseur de Volume"
            value={volumeValue}
            setValue={setVolumeValue}
            fromUnit={volumeFrom}
            setFromUnit={setVolumeFrom}
            toUnit={volumeTo}
            setToUnit={setVolumeTo}
            units={volumeUnits}
            convertFunction={convertVolume}
            swapType="volume"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
