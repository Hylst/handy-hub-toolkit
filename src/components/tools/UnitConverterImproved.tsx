
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightLeft, Info, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const UnitConverterImproved = () => {
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

  // États pour les surfaces
  const [areaValue, setAreaValue] = useState("");
  const [areaFrom, setAreaFrom] = useState("squareMeter");
  const [areaTo, setAreaTo] = useState("squareKilometer");

  // États pour l'énergie
  const [energyValue, setEnergyValue] = useState("");
  const [energyFrom, setEnergyFrom] = useState("joule");
  const [energyTo, setEnergyTo] = useState("calorie");

  // États pour la vitesse
  const [speedValue, setSpeedValue] = useState("");
  const [speedFrom, setSpeedFrom] = useState("meterPerSecond");
  const [speedTo, setSpeedTo] = useState("kilometerPerHour");

  // États pour la pression
  const [pressureValue, setPressureValue] = useState("");
  const [pressureFrom, setPressureFrom] = useState("pascal");
  const [pressureTo, setPressureTo] = useState("bar");

  const lengthUnits = {
    meter: { name: "Mètre", factor: 1, symbol: "m", description: "Unité de base du système international" },
    kilometer: { name: "Kilomètre", factor: 1000, symbol: "km", description: "1000 mètres" },
    centimeter: { name: "Centimètre", factor: 0.01, symbol: "cm", description: "1/100 de mètre" },
    millimeter: { name: "Millimètre", factor: 0.001, symbol: "mm", description: "1/1000 de mètre" },
    inch: { name: "Pouce", factor: 0.0254, symbol: "in", description: "Unité anglo-saxonne" },
    foot: { name: "Pied", factor: 0.3048, symbol: "ft", description: "12 pouces" },
    yard: { name: "Yard", factor: 0.9144, symbol: "yd", description: "3 pieds" },
    mile: { name: "Mile", factor: 1609.34, symbol: "mi", description: "1760 yards" },
    nauticalMile: { name: "Mille nautique", factor: 1852, symbol: "nmi", description: "Unité maritime" },
    lightYear: { name: "Année-lumière", factor: 9.461e15, symbol: "ly", description: "Distance parcourue par la lumière en 1 an" }
  };

  const weightUnits = {
    kilogram: { name: "Kilogramme", factor: 1, symbol: "kg", description: "Unité de base SI" },
    gram: { name: "Gramme", factor: 0.001, symbol: "g", description: "1/1000 kg" },
    pound: { name: "Livre", factor: 0.453592, symbol: "lb", description: "Unité anglo-saxonne" },
    ounce: { name: "Once", factor: 0.0283495, symbol: "oz", description: "1/16 livre" },
    ton: { name: "Tonne", factor: 1000, symbol: "t", description: "1000 kg" },
    stone: { name: "Stone", factor: 6.35029, symbol: "st", description: "14 livres (UK)" }
  };

  const volumeUnits = {
    liter: { name: "Litre", factor: 1, symbol: "L", description: "Unité de base" },
    milliliter: { name: "Millilitre", factor: 0.001, symbol: "mL", description: "1/1000 litre" },
    gallon: { name: "Gallon US", factor: 3.78541, symbol: "gal", description: "Gallon américain" },
    cup: { name: "Tasse", factor: 0.236588, symbol: "cup", description: "Tasse américaine" },
    cubicMeter: { name: "Mètre cube", factor: 1000, symbol: "m³", description: "Volume de base SI" }
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
      default:
        celsius = value;
    }
    
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
    swapType,
    color = "blue"
  }: any) => (
    <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow">
      <CardHeader className={`bg-gradient-to-r from-${color}-50 to-${color}-100 dark:from-${color}-950 dark:to-${color}-900`}>
        <CardTitle className="flex items-center gap-3">
          <div className={`p-2 bg-${color}-100 dark:bg-${color}-800 rounded-full`}>
            <Info className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
          </div>
          {title}
          <Badge variant="secondary" className="text-xs">Haute précision</Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Conversions basées sur les standards internationaux</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Valeur à convertir</label>
            <Input
              type="number"
              placeholder="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="text-lg font-mono border-2 focus:border-blue-400"
              step="any"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Unité source</label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger className="border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {Object.entries(units).map(([key, unit]: [string, any]) => (
                  <SelectItem key={key} value={key}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 w-full">
                            <span>{unit.name}</span>
                            <Badge variant="outline" className="text-xs">{unit.symbol}</Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{unit.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
              className="hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-300"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Unité cible</label>
          <Select value={toUnit} onValueChange={setToUnit}>
            <SelectTrigger className="border-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {Object.entries(units).map(([key, unit]: [string, any]) => (
                <SelectItem key={key} value={key}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 w-full">
                          <span>{unit.name}</span>
                          <Badge variant="outline" className="text-xs">{unit.symbol}</Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{unit.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className={`p-6 bg-gradient-to-r from-${color}-50 to-${color}-100 dark:from-${color}-950 dark:to-${color}-900 rounded-xl border-2 border-${color}-200`}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-1 bg-${color}-200 dark:bg-${color}-800 rounded-full`}>
              <Info className={`w-4 h-4 text-${color}-600 dark:text-${color}-400`} />
            </div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Résultat de la conversion</p>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 font-mono break-all">
            {convertFunction()} {units[toUnit]?.symbol}
          </p>
          {value && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {value} {units[fromUnit]?.symbol} = {convertFunction()} {units[toUnit]?.symbol}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="text-center space-y-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl border-2 border-blue-200">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Convertisseurs d'Unités
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Convertissez facilement entre différentes unités de mesure avec une précision maximale. 
            Tous les calculs sont basés sur les standards internationaux.
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary">8 types de conversions</Badge>
            <Badge variant="secondary">50+ unités disponibles</Badge>
            <Badge variant="secondary">Précision scientifique</Badge>
          </div>
        </div>

        <Tabs defaultValue="length" className="w-full">
          <TabsList className="grid w-full grid-cols-4 text-xs bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="length" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">Longueurs</TabsTrigger>
            <TabsTrigger value="weight" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">Poids</TabsTrigger>
            <TabsTrigger value="temperature" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">Température</TabsTrigger>
            <TabsTrigger value="volume" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">Volume</TabsTrigger>
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
              color="blue"
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
              color="green"
            />
          </TabsContent>
          
          <TabsContent value="temperature">
            <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-full">
                    <Info className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  Convertisseur de Température
                  <Badge variant="secondary" className="text-xs">Formules exactes</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Température</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="text-lg font-mono border-2 focus:border-orange-400"
                      step="any"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Unité source</label>
                    <Select value={tempFrom} onValueChange={setTempFrom}>
                      <SelectTrigger className="border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="celsius">Celsius (°C)</SelectItem>
                        <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                        <SelectItem value="kelvin">Kelvin (K)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => swapUnits("temperature")}
                      className="hover:bg-orange-50 border-2 border-orange-200 hover:border-orange-300"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Unité cible</label>
                  <Select value={tempTo} onValueChange={setTempTo}>
                    <SelectTrigger className="border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celsius">Celsius (°C)</SelectItem>
                      <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                      <SelectItem value="kelvin">Kelvin (K)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 rounded-xl border-2 border-orange-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1 bg-orange-200 dark:bg-orange-800 rounded-full">
                      <Info className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Résultat</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 font-mono">
                    {convertTemperature()}°
                  </p>
                  {tempValue && (
                    <div className="mt-4 p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Références utiles :</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">• Congélation de l'eau: 0°C = 32°F = 273.15K</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">• Ébullition de l'eau: 100°C = 212°F = 373.15K</p>
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
              color="purple"
            />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};
