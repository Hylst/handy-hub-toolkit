
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightLeft, Info, Ruler, Weight, Thermometer, Droplets, Square, Zap, Wind, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDebouncedInput } from "@/hooks/useDebouncedInput";

export const UnitConverterFixed = () => {
  // Utilisation du hook débounce pour toutes les catégories
  const lengthInput = useDebouncedInput("", 200);
  const [lengthFrom, setLengthFrom] = useState("meter");
  const [lengthTo, setLengthTo] = useState("kilometer");

  const weightInput = useDebouncedInput("", 200);
  const [weightFrom, setWeightFrom] = useState("kilogram");
  const [weightTo, setWeightTo] = useState("gram");

  const tempInput = useDebouncedInput("", 200);
  const [tempFrom, setTempFrom] = useState("celsius");
  const [tempTo, setTempTo] = useState("fahrenheit");

  const volumeInput = useDebouncedInput("", 200);
  const [volumeFrom, setVolumeFrom] = useState("liter");
  const [volumeTo, setVolumeTo] = useState("milliliter");

  const areaInput = useDebouncedInput("", 200);
  const [areaFrom, setAreaFrom] = useState("square_meter");
  const [areaTo, setAreaTo] = useState("square_kilometer");

  const energyInput = useDebouncedInput("", 200);
  const [energyFrom, setEnergyFrom] = useState("joule");
  const [energyTo, setEnergyTo] = useState("calorie");

  const speedInput = useDebouncedInput("", 200);
  const [speedFrom, setSpeedFrom] = useState("meter_per_second");
  const [speedTo, setSpeedTo] = useState("kilometer_per_hour");

  const pressureInput = useDebouncedInput("", 200);
  const [pressureFrom, setPressureFrom] = useState("pascal");
  const [pressureTo, setPressureTo] = useState("bar");

  const powerInput = useDebouncedInput("", 200);
  const [powerFrom, setPowerFrom] = useState("watt");
  const [powerTo, setPowerTo] = useState("kilowatt");

  const timeInput = useDebouncedInput("", 200);
  const [timeFrom, setTimeFrom] = useState("second");
  const [timeTo, setTimeTo] = useState("minute");

  // Définitions complètes des unités
  const lengthUnits = {
    meter: { name: "Mètre", factor: 1, symbol: "m" },
    kilometer: { name: "Kilomètre", factor: 1000, symbol: "km" },
    centimeter: { name: "Centimètre", factor: 0.01, symbol: "cm" },
    millimeter: { name: "Millimètre", factor: 0.001, symbol: "mm" },
    inch: { name: "Pouce", factor: 0.0254, symbol: "in" },
    foot: { name: "Pied", factor: 0.3048, symbol: "ft" },
    yard: { name: "Yard", factor: 0.9144, symbol: "yd" },
    mile: { name: "Mile", factor: 1609.34, symbol: "mi" },
    nautical_mile: { name: "Mile nautique", factor: 1852, symbol: "nmi" }
  };

  const weightUnits = {
    kilogram: { name: "Kilogramme", factor: 1, symbol: "kg" },
    gram: { name: "Gramme", factor: 0.001, symbol: "g" },
    pound: { name: "Livre", factor: 0.453592, symbol: "lb" },
    ounce: { name: "Once", factor: 0.0283495, symbol: "oz" },
    ton: { name: "Tonne", factor: 1000, symbol: "t" },
    stone: { name: "Stone", factor: 6.35029, symbol: "st" }
  };

  const temperatureUnits = {
    celsius: { name: "Celsius", symbol: "°C" },
    fahrenheit: { name: "Fahrenheit", symbol: "°F" },
    kelvin: { name: "Kelvin", symbol: "K" },
    rankine: { name: "Rankine", symbol: "°R" }
  };

  const volumeUnits = {
    liter: { name: "Litre", factor: 1, symbol: "L" },
    milliliter: { name: "Millilitre", factor: 0.001, symbol: "mL" },
    cubic_meter: { name: "Mètre cube", factor: 1000, symbol: "m³" },
    gallon: { name: "Gallon US", factor: 3.78541, symbol: "gal" },
    quart: { name: "Quart", factor: 0.946353, symbol: "qt" },
    pint: { name: "Pinte", factor: 0.473176, symbol: "pt" },
    cup: { name: "Tasse", factor: 0.236588, symbol: "cup" },
    fluid_ounce: { name: "Once liquide", factor: 0.0295735, symbol: "fl oz" }
  };

  const areaUnits = {
    square_meter: { name: "Mètre carré", factor: 1, symbol: "m²" },
    square_kilometer: { name: "Kilomètre carré", factor: 1000000, symbol: "km²" },
    square_centimeter: { name: "Centimètre carré", factor: 0.0001, symbol: "cm²" },
    hectare: { name: "Hectare", factor: 10000, symbol: "ha" },
    acre: { name: "Acre", factor: 4046.86, symbol: "ac" },
    square_foot: { name: "Pied carré", factor: 0.092903, symbol: "ft²" },
    square_inch: { name: "Pouce carré", factor: 0.00064516, symbol: "in²" }
  };

  const energyUnits = {
    joule: { name: "Joule", factor: 1, symbol: "J" },
    kilojoule: { name: "Kilojoule", factor: 1000, symbol: "kJ" },
    calorie: { name: "Calorie", factor: 4.184, symbol: "cal" },
    kilocalorie: { name: "Kilocalorie", factor: 4184, symbol: "kcal" },
    watt_hour: { name: "Watt-heure", factor: 3600, symbol: "Wh" },
    kilowatt_hour: { name: "Kilowatt-heure", factor: 3600000, symbol: "kWh" },
    btu: { name: "BTU", factor: 1055.06, symbol: "BTU" }
  };

  const speedUnits = {
    meter_per_second: { name: "Mètre/seconde", factor: 1, symbol: "m/s" },
    kilometer_per_hour: { name: "Kilomètre/heure", factor: 0.277778, symbol: "km/h" },
    mile_per_hour: { name: "Mile/heure", factor: 0.44704, symbol: "mph" },
    foot_per_second: { name: "Pied/seconde", factor: 0.3048, symbol: "ft/s" },
    knot: { name: "Nœud", factor: 0.514444, symbol: "kn" }
  };

  const pressureUnits = {
    pascal: { name: "Pascal", factor: 1, symbol: "Pa" },
    kilopascal: { name: "Kilopascal", factor: 1000, symbol: "kPa" },
    bar: { name: "Bar", factor: 100000, symbol: "bar" },
    atmosphere: { name: "Atmosphère", factor: 101325, symbol: "atm" },
    psi: { name: "PSI", factor: 6894.76, symbol: "psi" },
    torr: { name: "Torr", factor: 133.322, symbol: "Torr" }
  };

  const powerUnits = {
    watt: { name: "Watt", factor: 1, symbol: "W" },
    kilowatt: { name: "Kilowatt", factor: 1000, symbol: "kW" },
    horsepower: { name: "Cheval-vapeur", factor: 745.7, symbol: "hp" },
    btu_per_hour: { name: "BTU/heure", factor: 0.293071, symbol: "BTU/h" }
  };

  const timeUnits = {
    second: { name: "Seconde", factor: 1, symbol: "s" },
    minute: { name: "Minute", factor: 60, symbol: "min" },
    hour: { name: "Heure", factor: 3600, symbol: "h" },
    day: { name: "Jour", factor: 86400, symbol: "j" },
    week: { name: "Semaine", factor: 604800, symbol: "sem" },
    month: { name: "Mois", factor: 2629746, symbol: "mois" },
    year: { name: "Année", factor: 31556952, symbol: "an" }
  };

  // Fonctions de conversion
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
      case "rankine":
        celsius = (temp - 491.67) * 5/9;
        break;
      default:
        celsius = temp;
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
      case "rankine":
        result = (celsius + 273.15) * 9/5;
        break;
      default:
        result = celsius;
    }
    
    return result.toFixed(2);
  }, [tempInput.debouncedValue, tempFrom, tempTo]);

  const convertVolume = useCallback(() => {
    const value = volumeInput.debouncedValue;
    if (!value || isNaN(parseFloat(value))) return "";
    
    const fromFactor = volumeUnits[volumeFrom as keyof typeof volumeUnits].factor;
    const toFactor = volumeUnits[volumeTo as keyof typeof volumeUnits].factor;
    const result = (parseFloat(value) * fromFactor) / toFactor;
    
    return result.toFixed(6).replace(/\.?0+$/, "");
  }, [volumeInput.debouncedValue, volumeFrom, volumeTo]);

  const convertArea = useCallback(() => {
    const value = areaInput.debouncedValue;
    if (!value || isNaN(parseFloat(value))) return "";
    
    const fromFactor = areaUnits[areaFrom as keyof typeof areaUnits].factor;
    const toFactor = areaUnits[areaTo as keyof typeof areaUnits].factor;
    const result = (parseFloat(value) * fromFactor) / toFactor;
    
    return result.toFixed(6).replace(/\.?0+$/, "");
  }, [areaInput.debouncedValue, areaFrom, areaTo]);

  const convertEnergy = useCallback(() => {
    const value = energyInput.debouncedValue;
    if (!value || isNaN(parseFloat(value))) return "";
    
    const fromFactor = energyUnits[energyFrom as keyof typeof energyUnits].factor;
    const toFactor = energyUnits[energyTo as keyof typeof energyUnits].factor;
    const result = (parseFloat(value) * fromFactor) / toFactor;
    
    return result.toFixed(6).replace(/\.?0+$/, "");
  }, [energyInput.debouncedValue, energyFrom, energyTo]);

  const convertSpeed = useCallback(() => {
    const value = speedInput.debouncedValue;
    if (!value || isNaN(parseFloat(value))) return "";
    
    const fromFactor = speedUnits[speedFrom as keyof typeof speedUnits].factor;
    const toFactor = speedUnits[speedTo as keyof typeof speedUnits].factor;
    const result = (parseFloat(value) * fromFactor) / toFactor;
    
    return result.toFixed(6).replace(/\.?0+$/, "");
  }, [speedInput.debouncedValue, speedFrom, speedTo]);

  const convertPressure = useCallback(() => {
    const value = pressureInput.debouncedValue;
    if (!value || isNaN(parseFloat(value))) return "";
    
    const fromFactor = pressureUnits[pressureFrom as keyof typeof pressureUnits].factor;
    const toFactor = pressureUnits[pressureTo as keyof typeof pressureUnits].factor;
    const result = (parseFloat(value) * fromFactor) / toFactor;
    
    return result.toFixed(6).replace(/\.?0+$/, "");
  }, [pressureInput.debouncedValue, pressureFrom, pressureTo]);

  const convertPower = useCallback(() => {
    const value = powerInput.debouncedValue;
    if (!value || isNaN(parseFloat(value))) return "";
    
    const fromFactor = powerUnits[powerFrom as keyof typeof powerUnits].factor;
    const toFactor = powerUnits[powerTo as keyof typeof powerUnits].factor;
    const result = (parseFloat(value) * fromFactor) / toFactor;
    
    return result.toFixed(6).replace(/\.?0+$/, "");
  }, [powerInput.debouncedValue, powerFrom, powerTo]);

  const convertTime = useCallback(() => {
    const value = timeInput.debouncedValue;
    if (!value || isNaN(parseFloat(value))) return "";
    
    const fromFactor = timeUnits[timeFrom as keyof typeof timeUnits].factor;
    const toFactor = timeUnits[timeTo as keyof typeof timeUnits].factor;
    const result = (parseFloat(value) * fromFactor) / toFactor;
    
    return result.toFixed(6).replace(/\.?0+$/, "");
  }, [timeInput.debouncedValue, timeFrom, timeTo]);

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
      case "volume":
        const tempVolume = volumeFrom;
        setVolumeFrom(volumeTo);
        setVolumeTo(tempVolume);
        break;
      case "area":
        const tempArea = areaFrom;
        setAreaFrom(areaTo);
        setAreaTo(tempArea);
        break;
      case "energy":
        const tempEnergy = energyFrom;
        setEnergyFrom(energyTo);
        setEnergyTo(tempEnergy);
        break;
      case "speed":
        const tempSpeed = speedFrom;
        setSpeedFrom(speedTo);
        setSpeedTo(tempSpeed);
        break;
      case "pressure":
        const tempPressure = pressureFrom;
        setPressureFrom(pressureTo);
        setPressureTo(tempPressure);
        break;
      case "power":
        const tempPower = powerFrom;
        setPowerFrom(powerTo);
        setPowerTo(tempPower);
        break;
      case "time":
        const tempTime = timeFrom;
        setTimeFrom(timeTo);
        setTimeTo(tempTime);
        break;
    }
  };

  // Composant de conversion générique
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
          <Badge variant="secondary" className="text-xs">Corrigé</Badge>
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
          Convertisseur d'Unités Complet - Version Corrigée
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          10 catégories de conversion avec gestion intelligente de la saisie et débounce pour éviter les bugs d'input.
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge variant="secondary">✅ Bug de saisie corrigé</Badge>
          <Badge variant="secondary">⚡ Calcul en temps réel</Badge>
          <Badge variant="secondary">🎯 Haute précision</Badge>
          <Badge variant="secondary">📐 10 catégories</Badge>
        </div>
      </div>

      <Tabs defaultValue="length" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
          <TabsTrigger value="length">
            <Ruler className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Longueurs</span>
          </TabsTrigger>
          <TabsTrigger value="weight">
            <Weight className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Poids</span>
          </TabsTrigger>
          <TabsTrigger value="temperature">
            <Thermometer className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Température</span>
          </TabsTrigger>
          <TabsTrigger value="volume">
            <Droplets className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Volume</span>
          </TabsTrigger>
          <TabsTrigger value="area">
            <Square className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Surface</span>
          </TabsTrigger>
          <TabsTrigger value="energy">
            <Zap className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Énergie</span>
          </TabsTrigger>
          <TabsTrigger value="speed">
            <Wind className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Vitesse</span>
          </TabsTrigger>
          <TabsTrigger value="pressure">
            <Gauge className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Pression</span>
          </TabsTrigger>
          <TabsTrigger value="power">
            <Zap className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Puissance</span>
          </TabsTrigger>
          <TabsTrigger value="time">
            <Info className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Temps</span>
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

        <TabsContent value="volume">
          <ConversionCard
            title="Convertisseur de Volume"
            icon={<Droplets className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />}
            inputHook={volumeInput}
            fromUnit={volumeFrom}
            setFromUnit={setVolumeFrom}
            toUnit={volumeTo}
            setToUnit={setVolumeTo}
            units={volumeUnits}
            convertFunction={convertVolume}
            swapType="volume"
            color="cyan"
          />
        </TabsContent>

        <TabsContent value="area">
          <ConversionCard
            title="Convertisseur de Surface"
            icon={<Square className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
            inputHook={areaInput}
            fromUnit={areaFrom}
            setFromUnit={setAreaFrom}
            toUnit={areaTo}
            setToUnit={setAreaTo}
            units={areaUnits}
            convertFunction={convertArea}
            swapType="area"
            color="purple"
          />
        </TabsContent>

        <TabsContent value="energy">
          <ConversionCard
            title="Convertisseur d'Énergie"
            icon={<Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />}
            inputHook={energyInput}
            fromUnit={energyFrom}
            setFromUnit={setEnergyFrom}
            toUnit={energyTo}
            setToUnit={setEnergyTo}
            units={energyUnits}
            convertFunction={convertEnergy}
            swapType="energy"
            color="yellow"
          />
        </TabsContent>

        <TabsContent value="speed">
          <ConversionCard
            title="Convertisseur de Vitesse"
            icon={<Wind className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
            inputHook={speedInput}
            fromUnit={speedFrom}
            setFromUnit={setSpeedFrom}
            toUnit={speedTo}
            setToUnit={setSpeedTo}
            units={speedUnits}
            convertFunction={convertSpeed}
            swapType="speed"
            color="indigo"
          />
        </TabsContent>

        <TabsContent value="pressure">
          <ConversionCard
            title="Convertisseur de Pression"
            icon={<Gauge className="w-5 h-5 text-red-600 dark:text-red-400" />}
            inputHook={pressureInput}
            fromUnit={pressureFrom}
            setFromUnit={setPressureFrom}
            toUnit={pressureTo}
            setToUnit={setPressureTo}
            units={pressureUnits}
            convertFunction={convertPressure}
            swapType="pressure"
            color="red"
          />
        </TabsContent>

        <TabsContent value="power">
          <ConversionCard
            title="Convertisseur de Puissance"
            icon={<Zap className="w-5 h-5 text-pink-600 dark:text-pink-400" />}
            inputHook={powerInput}
            fromUnit={powerFrom}
            setFromUnit={setPowerFrom}
            toUnit={powerTo}
            setToUnit={setPowerTo}
            units={powerUnits}
            convertFunction={convertPower}
            swapType="power"
            color="pink"
          />
        </TabsContent>

        <TabsContent value="time">
          <ConversionCard
            title="Convertisseur de Temps"
            icon={<Info className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
            inputHook={timeInput}
            fromUnit={timeFrom}
            setFromUnit={setTimeFrom}
            toUnit={timeTo}
            setToUnit={setTimeTo}
            units={timeUnits}
            convertFunction={convertTime}
            swapType="time"
            color="teal"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
