
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

  // Nouveaux états pour les surfaces
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
    meter: { name: "Mètre", factor: 1, symbol: "m" },
    kilometer: { name: "Kilomètre", factor: 1000, symbol: "km" },
    centimeter: { name: "Centimètre", factor: 0.01, symbol: "cm" },
    millimeter: { name: "Millimètre", factor: 0.001, symbol: "mm" },
    inch: { name: "Pouce", factor: 0.0254, symbol: "in" },
    foot: { name: "Pied", factor: 0.3048, symbol: "ft" },
    yard: { name: "Yard", factor: 0.9144, symbol: "yd" },
    mile: { name: "Mile", factor: 1609.34, symbol: "mi" },
    nauticalMile: { name: "Mille nautique", factor: 1852, symbol: "nmi" },
    micrometers: { name: "Micromètre", factor: 0.000001, symbol: "μm" },
    angstrom: { name: "Ångström", factor: 0.0000000001, symbol: "Å" },
    lightYear: { name: "Année-lumière", factor: 9.461e15, symbol: "ly" },
    astronomicalUnit: { name: "Unité astronomique", factor: 149597870700, symbol: "AU" }
  };

  const weightUnits = {
    kilogram: { name: "Kilogramme", factor: 1, symbol: "kg" },
    gram: { name: "Gramme", factor: 0.001, symbol: "g" },
    milligram: { name: "Milligramme", factor: 0.000001, symbol: "mg" },
    microgram: { name: "Microgramme", factor: 0.000000001, symbol: "μg" },
    pound: { name: "Livre", factor: 0.453592, symbol: "lb" },
    ounce: { name: "Once", factor: 0.0283495, symbol: "oz" },
    ton: { name: "Tonne", factor: 1000, symbol: "t" },
    stone: { name: "Stone", factor: 6.35029, symbol: "st" },
    carat: { name: "Carat", factor: 0.0002, symbol: "ct" },
    grain: { name: "Grain", factor: 0.0000647989, symbol: "gr" },
    hundredweight: { name: "Quintal", factor: 50.8023, symbol: "cwt" }
  };

  const volumeUnits = {
    liter: { name: "Litre", factor: 1, symbol: "L" },
    milliliter: { name: "Millilitre", factor: 0.001, symbol: "mL" },
    centiliter: { name: "Centilitre", factor: 0.01, symbol: "cL" },
    deciliter: { name: "Décilitre", factor: 0.1, symbol: "dL" },
    gallon: { name: "Gallon US", factor: 3.78541, symbol: "gal" },
    gallonUK: { name: "Gallon UK", factor: 4.54609, symbol: "gal UK" },
    quart: { name: "Quart", factor: 0.946353, symbol: "qt" },
    pint: { name: "Pinte", factor: 0.473176, symbol: "pt" },
    cup: { name: "Tasse", factor: 0.236588, symbol: "cup" },
    fluidOunce: { name: "Once liquide", factor: 0.0295735, symbol: "fl oz" },
    tablespoon: { name: "Cuillère à soupe", factor: 0.0147868, symbol: "tbsp" },
    teaspoon: { name: "Cuillère à café", factor: 0.00492892, symbol: "tsp" },
    cubicMeter: { name: "Mètre cube", factor: 1000, symbol: "m³" },
    cubicCentimeter: { name: "Centimètre cube", factor: 0.001, symbol: "cm³" },
    barrel: { name: "Baril", factor: 158.987, symbol: "bbl" }
  };

  const areaUnits = {
    squareMeter: { name: "Mètre carré", factor: 1, symbol: "m²" },
    squareKilometer: { name: "Kilomètre carré", factor: 1000000, symbol: "km²" },
    squareCentimeter: { name: "Centimètre carré", factor: 0.0001, symbol: "cm²" },
    squareMillimeter: { name: "Millimètre carré", factor: 0.000001, symbol: "mm²" },
    hectare: { name: "Hectare", factor: 10000, symbol: "ha" },
    acre: { name: "Acre", factor: 4046.86, symbol: "ac" },
    squareFoot: { name: "Pied carré", factor: 0.092903, symbol: "ft²" },
    squareInch: { name: "Pouce carré", factor: 0.00064516, symbol: "in²" },
    squareYard: { name: "Yard carré", factor: 0.836127, symbol: "yd²" },
    squareMile: { name: "Mile carré", factor: 2589988.11, symbol: "mi²" }
  };

  const energyUnits = {
    joule: { name: "Joule", factor: 1, symbol: "J" },
    kilojoule: { name: "Kilojoule", factor: 1000, symbol: "kJ" },
    calorie: { name: "Calorie", factor: 4.184, symbol: "cal" },
    kilocalorie: { name: "Kilocalorie", factor: 4184, symbol: "kcal" },
    wattHour: { name: "Watt-heure", factor: 3600, symbol: "Wh" },
    kilowattHour: { name: "Kilowatt-heure", factor: 3600000, symbol: "kWh" },
    btu: { name: "BTU", factor: 1055.06, symbol: "BTU" },
    therm: { name: "Therm", factor: 105506000, symbol: "thm" },
    footPound: { name: "Pied-livre", factor: 1.35582, symbol: "ft⋅lb" },
    erg: { name: "Erg", factor: 0.0000001, symbol: "erg" }
  };

  const speedUnits = {
    meterPerSecond: { name: "Mètre par seconde", factor: 1, symbol: "m/s" },
    kilometerPerHour: { name: "Kilomètre par heure", factor: 0.277778, symbol: "km/h" },
    milePerHour: { name: "Mile par heure", factor: 0.44704, symbol: "mph" },
    footPerSecond: { name: "Pied par seconde", factor: 0.3048, symbol: "ft/s" },
    knot: { name: "Nœud", factor: 0.514444, symbol: "kn" },
    mach: { name: "Mach", factor: 343, symbol: "Ma" },
    speedOfLight: { name: "Vitesse de la lumière", factor: 299792458, symbol: "c" }
  };

  const pressureUnits = {
    pascal: { name: "Pascal", factor: 1, symbol: "Pa" },
    kilopascal: { name: "Kilopascal", factor: 1000, symbol: "kPa" },
    megapascal: { name: "Mégapascal", factor: 1000000, symbol: "MPa" },
    bar: { name: "Bar", factor: 100000, symbol: "bar" },
    millibar: { name: "Millibar", factor: 100, symbol: "mbar" },
    atmosphere: { name: "Atmosphère", factor: 101325, symbol: "atm" },
    torr: { name: "Torr", factor: 133.322, symbol: "Torr" },
    mmHg: { name: "Millimètre de mercure", factor: 133.322, symbol: "mmHg" },
    psi: { name: "Livre par pouce carré", factor: 6894.76, symbol: "psi" },
    inHg: { name: "Pouce de mercure", factor: 3386.39, symbol: "inHg" }
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
      case "reaumur":
        celsius = value * 5/4;
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
      case "reaumur":
        result = celsius * 4/5;
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

  const convertArea = () => {
    if (!areaValue) return "";
    const fromFactor = areaUnits[areaFrom as keyof typeof areaUnits].factor;
    const toFactor = areaUnits[areaTo as keyof typeof areaUnits].factor;
    const result = (parseFloat(areaValue) * fromFactor) / toFactor;
    return formatResult(result);
  };

  const convertEnergy = () => {
    if (!energyValue) return "";
    const fromFactor = energyUnits[energyFrom as keyof typeof energyUnits].factor;
    const toFactor = energyUnits[energyTo as keyof typeof energyUnits].factor;
    const result = (parseFloat(energyValue) * fromFactor) / toFactor;
    return formatResult(result);
  };

  const convertSpeed = () => {
    if (!speedValue) return "";
    const fromFactor = speedUnits[speedFrom as keyof typeof speedUnits].factor;
    const toFactor = speedUnits[speedTo as keyof typeof speedUnits].factor;
    const result = (parseFloat(speedValue) * fromFactor) / toFactor;
    return formatResult(result);
  };

  const convertPressure = () => {
    if (!pressureValue) return "";
    const fromFactor = pressureUnits[pressureFrom as keyof typeof pressureUnits].factor;
    const toFactor = pressureUnits[pressureTo as keyof typeof pressureUnits].factor;
    const result = (parseFloat(pressureValue) * fromFactor) / toFactor;
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

  const swapUnits = (type: "length" | "weight" | "temperature" | "volume" | "area" | "energy" | "speed" | "pressure") => {
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
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 text-xs">
          <TabsTrigger value="length">Longueurs</TabsTrigger>
          <TabsTrigger value="weight">Poids</TabsTrigger>
          <TabsTrigger value="temperature">Température</TabsTrigger>
          <TabsTrigger value="volume">Volume</TabsTrigger>
          <TabsTrigger value="area">Surface</TabsTrigger>
          <TabsTrigger value="energy">Énergie</TabsTrigger>
          <TabsTrigger value="speed">Vitesse</TabsTrigger>
          <TabsTrigger value="pressure">Pression</TabsTrigger>
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
                      <SelectItem value="reaumur">Réaumur (°Ré)</SelectItem>
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
                    <SelectItem value="reaumur">Réaumur (°Ré)</SelectItem>
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

        <TabsContent value="area">
          <ConversionCard
            title="Convertisseur de Surface"
            value={areaValue}
            setValue={setAreaValue}
            fromUnit={areaFrom}
            setFromUnit={setAreaFrom}
            toUnit={areaTo}
            setToUnit={setAreaTo}
            units={areaUnits}
            convertFunction={convertArea}
            swapType="area"
          />
        </TabsContent>

        <TabsContent value="energy">
          <ConversionCard
            title="Convertisseur d'Énergie"
            value={energyValue}
            setValue={setEnergyValue}
            fromUnit={energyFrom}
            setFromUnit={setEnergyFrom}
            toUnit={energyTo}
            setToUnit={setEnergyTo}
            units={energyUnits}
            convertFunction={convertEnergy}
            swapType="energy"
          />
        </TabsContent>

        <TabsContent value="speed">
          <ConversionCard
            title="Convertisseur de Vitesse"
            value={speedValue}
            setValue={setSpeedValue}
            fromUnit={speedFrom}
            setFromUnit={setSpeedFrom}
            toUnit={speedTo}
            setToUnit={setSpeedTo}
            units={speedUnits}
            convertFunction={convertSpeed}
            swapType="speed"
          />
        </TabsContent>

        <TabsContent value="pressure">
          <ConversionCard
            title="Convertisseur de Pression"
            value={pressureValue}
            setValue={setPressureValue}
            fromUnit={pressureFrom}
            setFromUnit={setPressureFrom}
            toUnit={pressureTo}
            setToUnit={setPressureTo}
            units={pressureUnits}
            convertFunction={convertPressure}
            swapType="pressure"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
