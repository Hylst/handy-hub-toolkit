
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightLeft, Info, Clock, DollarSign, Ruler, Weight, Thermometer, Droplets, Square, Zap, Wind, Gauge } from "lucide-react";
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

  // États pour le temps
  const [timeValue, setTimeValue] = useState("");
  const [timeFrom, setTimeFrom] = useState("second");
  const [timeTo, setTimeTo] = useState("minute");

  // États pour les devises
  const [currencyValue, setCurrencyValue] = useState("");
  const [currencyFrom, setCurrencyFrom] = useState("eur");
  const [currencyTo, setCurrencyTo] = useState("usd");

  // Définitions des unités avec facteurs de conversion et descriptions détaillées
  const lengthUnits = {
    meter: { name: "Mètre", factor: 1, symbol: "m", description: "Unité de base du système international pour les longueurs" },
    kilometer: { name: "Kilomètre", factor: 1000, symbol: "km", description: "1000 mètres - Distance entre villes" },
    centimeter: { name: "Centimètre", factor: 0.01, symbol: "cm", description: "1/100 de mètre - Mesures corporelles" },
    millimeter: { name: "Millimètre", factor: 0.001, symbol: "mm", description: "1/1000 de mètre - Précision technique" },
    micrometer: { name: "Micromètre", factor: 0.000001, symbol: "μm", description: "1/1000000 de mètre - Cellules, bactéries" },
    inch: { name: "Pouce", factor: 0.0254, symbol: "in", description: "Unité anglo-saxonne = 2.54 cm" },
    foot: { name: "Pied", factor: 0.3048, symbol: "ft", description: "12 pouces = 30.48 cm" },
    yard: { name: "Yard", factor: 0.9144, symbol: "yd", description: "3 pieds = 91.44 cm" },
    mile: { name: "Mile", factor: 1609.34, symbol: "mi", description: "1760 yards = 1.609 km" },
    nauticalMile: { name: "Mille nautique", factor: 1852, symbol: "nmi", description: "Unité maritime = 1.852 km" },
    lightYear: { name: "Année-lumière", factor: 9.461e15, symbol: "ly", description: "Distance parcourue par la lumière en 1 an" }
  };

  const weightUnits = {
    kilogram: { name: "Kilogramme", factor: 1, symbol: "kg", description: "Unité de base SI pour la masse" },
    gram: { name: "Gramme", factor: 0.001, symbol: "g", description: "1/1000 kg - Poids alimentaires" },
    milligram: { name: "Milligramme", factor: 0.000001, symbol: "mg", description: "1/1000 gramme - Médicaments" },
    pound: { name: "Livre", factor: 0.453592, symbol: "lb", description: "Unité anglo-saxonne = 453.6 g" },
    ounce: { name: "Once", factor: 0.0283495, symbol: "oz", description: "1/16 livre = 28.35 g" },
    ton: { name: "Tonne", factor: 1000, symbol: "t", description: "1000 kg - Poids industriels" },
    stone: { name: "Stone", factor: 6.35029, symbol: "st", description: "14 livres (système britannique)" },
    carat: { name: "Carat", factor: 0.0002, symbol: "ct", description: "200 mg - Pierres précieuses" }
  };

  const temperatureUnits = {
    celsius: { name: "Celsius", symbol: "°C", description: "Échelle métrique, 0°C = congélation eau" },
    fahrenheit: { name: "Fahrenheit", symbol: "°F", description: "Échelle anglo-saxonne, 32°F = congélation eau" },
    kelvin: { name: "Kelvin", symbol: "K", description: "Échelle absolue, 0K = zéro absolu" },
    rankine: { name: "Rankine", symbol: "°R", description: "Échelle absolue Fahrenheit" },
    reaumur: { name: "Réaumur", symbol: "°Ré", description: "Échelle historique française" }
  };

  const volumeUnits = {
    liter: { name: "Litre", factor: 1, symbol: "L", description: "Unité de base pour les liquides" },
    milliliter: { name: "Millilitre", factor: 0.001, symbol: "mL", description: "1/1000 litre - Dosages précis" },
    cubicMeter: { name: "Mètre cube", factor: 1000, symbol: "m³", description: "Volume de base SI = 1000 L" },
    cubicCentimeter: { name: "Centimètre cube", factor: 0.001, symbol: "cm³", description: "1 cm³ = 1 mL" },
    gallon: { name: "Gallon US", factor: 3.78541, symbol: "gal", description: "Gallon américain = 3.785 L" },
    gallonUK: { name: "Gallon UK", factor: 4.54609, symbol: "gal UK", description: "Gallon britannique = 4.546 L" },
    cup: { name: "Tasse", factor: 0.236588, symbol: "cup", description: "Tasse américaine = 237 mL" },
    fluidOunce: { name: "Once liquide", factor: 0.0295735, symbol: "fl oz", description: "Once liquide US = 29.6 mL" },
    pint: { name: "Pinte", factor: 0.473176, symbol: "pt", description: "Pinte américaine = 473 mL" },
    quart: { name: "Quart", factor: 0.946353, symbol: "qt", description: "Quart américain = 946 mL" }
  };

  const areaUnits = {
    squareMeter: { name: "Mètre carré", factor: 1, symbol: "m²", description: "Unité de base SI pour les surfaces" },
    squareKilometer: { name: "Kilomètre carré", factor: 1000000, symbol: "km²", description: "1 million de m² - Grandes surfaces" },
    squareCentimeter: { name: "Centimètre carré", factor: 0.0001, symbol: "cm²", description: "1/10000 m² - Petites surfaces" },
    hectare: { name: "Hectare", factor: 10000, symbol: "ha", description: "10000 m² - Superficie agricole" },
    acre: { name: "Acre", factor: 4046.86, symbol: "ac", description: "Unité anglo-saxonne = 4047 m²" },
    squareFoot: { name: "Pied carré", factor: 0.092903, symbol: "ft²", description: "Pied carré américain" },
    squareInch: { name: "Pouce carré", factor: 0.00064516, symbol: "in²", description: "Pouce carré américain" },
    squareYard: { name: "Yard carré", factor: 0.836127, symbol: "yd²", description: "Yard carré = 9 ft²" }
  };

  const energyUnits = {
    joule: { name: "Joule", factor: 1, symbol: "J", description: "Unité SI d'énergie" },
    kilojoule: { name: "Kilojoule", factor: 1000, symbol: "kJ", description: "1000 joules - Énergie alimentaire" },
    calorie: { name: "Calorie", factor: 4.184, symbol: "cal", description: "Calorie thermique = 4.184 J" },
    kilocalorie: { name: "Kilocalorie", factor: 4184, symbol: "kcal", description: "1000 calories - Nutrition" },
    wattHour: { name: "Watt-heure", factor: 3600, symbol: "Wh", description: "Énergie électrique = 3600 J" },
    kilowattHour: { name: "Kilowatt-heure", factor: 3600000, symbol: "kWh", description: "Unité de facturation électrique" },
    btu: { name: "BTU", factor: 1055.06, symbol: "BTU", description: "British Thermal Unit" },
    footPound: { name: "Pied-livre", factor: 1.35582, symbol: "ft⋅lb", description: "Unité anglo-saxonne" }
  };

  const speedUnits = {
    meterPerSecond: { name: "Mètre par seconde", factor: 1, symbol: "m/s", description: "Unité SI de vitesse" },
    kilometerPerHour: { name: "Kilomètre par heure", factor: 0.277778, symbol: "km/h", description: "Vitesse automobile courante" },
    milePerHour: { name: "Mile par heure", factor: 0.44704, symbol: "mph", description: "Vitesse anglo-saxonne" },
    knot: { name: "Nœud", factor: 0.514444, symbol: "kn", description: "Vitesse maritime = 1 mille nautique/h" },
    footPerSecond: { name: "Pied par seconde", factor: 0.3048, symbol: "ft/s", description: "Vitesse en pieds par seconde" },
    mach: { name: "Mach", factor: 343, symbol: "Ma", description: "Vitesse du son (≈ 343 m/s)" }
  };

  const pressureUnits = {
    pascal: { name: "Pascal", factor: 1, symbol: "Pa", description: "Unité SI de pression" },
    kilopascal: { name: "Kilopascal", factor: 1000, symbol: "kPa", description: "1000 pascals" },
    bar: { name: "Bar", factor: 100000, symbol: "bar", description: "Pression atmosphérique ≈ 1 bar" },
    atmosphere: { name: "Atmosphère", factor: 101325, symbol: "atm", description: "Pression atmosphérique standard" },
    torr: { name: "Torr", factor: 133.322, symbol: "Torr", description: "1/760 atmosphère" },
    psi: { name: "PSI", factor: 6894.76, symbol: "psi", description: "Livre par pouce carré" },
    mmHg: { name: "mmHg", factor: 133.322, symbol: "mmHg", description: "Millimètre de mercure" }
  };

  const timeUnits = {
    second: { name: "Seconde", factor: 1, symbol: "s", description: "Unité de base SI pour le temps" },
    minute: { name: "Minute", factor: 60, symbol: "min", description: "60 secondes" },
    hour: { name: "Heure", factor: 3600, symbol: "h", description: "60 minutes = 3600 secondes" },
    day: { name: "Jour", factor: 86400, symbol: "j", description: "24 heures = 86400 secondes" },
    week: { name: "Semaine", factor: 604800, symbol: "sem", description: "7 jours = 604800 secondes" },
    month: { name: "Mois", factor: 2629746, symbol: "mois", description: "30.44 jours moyens" },
    year: { name: "Année", factor: 31556952, symbol: "an", description: "365.25 jours = 31556952 secondes" },
    millisecond: { name: "Milliseconde", factor: 0.001, symbol: "ms", description: "1/1000 seconde" },
    microsecond: { name: "Microseconde", factor: 0.000001, symbol: "μs", description: "1/1000000 seconde" },
    nanosecond: { name: "Nanoseconde", factor: 0.000000001, symbol: "ns", description: "1/1000000000 seconde" }
  };

  // Taux de change approximatifs (dans une vraie app, utiliser une API)
  const currencyUnits = {
    eur: { name: "Euro", factor: 1, symbol: "€", description: "Devise européenne" },
    usd: { name: "Dollar US", factor: 1.08, symbol: "$", description: "Dollar américain" },
    gbp: { name: "Livre Sterling", factor: 0.85, symbol: "£", description: "Devise britannique" },
    jpy: { name: "Yen Japonais", factor: 161.50, symbol: "¥", description: "Devise japonaise" },
    chf: { name: "Franc Suisse", factor: 0.93, symbol: "CHF", description: "Devise suisse" },
    cad: { name: "Dollar Canadien", factor: 1.51, symbol: "CAD", description: "Dollar canadien" },
    aud: { name: "Dollar Australien", factor: 1.66, symbol: "AUD", description: "Dollar australien" },
    cny: { name: "Yuan Chinois", factor: 7.85, symbol: "¥", description: "Devise chinoise" },
    inr: { name: "Roupie Indienne", factor: 91.20, symbol: "₹", description: "Devise indienne" },
    brl: { name: "Real Brésilien", factor: 6.09, symbol: "R$", description: "Devise brésilienne" }
  };

  // Fonctions de conversion utilisant useCallback pour éviter les re-rendus et corriger le bug d'input
  const convertLength = useCallback(() => {
    if (!lengthValue || isNaN(parseFloat(lengthValue))) return "";
    const fromFactor = lengthUnits[lengthFrom as keyof typeof lengthUnits].factor;
    const toFactor = lengthUnits[lengthTo as keyof typeof lengthUnits].factor;
    const result = (parseFloat(lengthValue) * fromFactor) / toFactor;
    return formatResult(result);
  }, [lengthValue, lengthFrom, lengthTo]);

  const convertWeight = useCallback(() => {
    if (!weightValue || isNaN(parseFloat(weightValue))) return "";
    const fromFactor = weightUnits[weightFrom as keyof typeof weightUnits].factor;
    const toFactor = weightUnits[weightTo as keyof typeof weightUnits].factor;
    const result = (parseFloat(weightValue) * fromFactor) / toFactor;
    return formatResult(result);
  }, [weightValue, weightFrom, weightTo]);

  const convertTemperature = useCallback(() => {
    if (!tempValue || isNaN(parseFloat(tempValue))) return "";
    const value = parseFloat(tempValue);
    let celsius: number;
    
    // Conversion vers Celsius
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
  }, [tempValue, tempFrom, tempTo]);

  const convertVolume = useCallback(() => {
    if (!volumeValue || isNaN(parseFloat(volumeValue))) return "";
    const fromFactor = volumeUnits[volumeFrom as keyof typeof volumeUnits].factor;
    const toFactor = volumeUnits[volumeTo as keyof typeof volumeUnits].factor;
    const result = (parseFloat(volumeValue) * fromFactor) / toFactor;
    return formatResult(result);
  }, [volumeValue, volumeFrom, volumeTo]);

  const convertArea = useCallback(() => {
    if (!areaValue || isNaN(parseFloat(areaValue))) return "";
    const fromFactor = areaUnits[areaFrom as keyof typeof areaUnits].factor;
    const toFactor = areaUnits[areaTo as keyof typeof areaUnits].factor;
    const result = (parseFloat(areaValue) * fromFactor) / toFactor;
    return formatResult(result);
  }, [areaValue, areaFrom, areaTo]);

  const convertEnergy = useCallback(() => {
    if (!energyValue || isNaN(parseFloat(energyValue))) return "";
    const fromFactor = energyUnits[energyFrom as keyof typeof energyUnits].factor;
    const toFactor = energyUnits[energyTo as keyof typeof energyUnits].factor;
    const result = (parseFloat(energyValue) * fromFactor) / toFactor;
    return formatResult(result);
  }, [energyValue, energyFrom, energyTo]);

  const convertSpeed = useCallback(() => {
    if (!speedValue || isNaN(parseFloat(speedValue))) return "";
    const fromFactor = speedUnits[speedFrom as keyof typeof speedUnits].factor;
    const toFactor = speedUnits[speedTo as keyof typeof speedUnits].factor;
    const result = (parseFloat(speedValue) * fromFactor) / toFactor;
    return formatResult(result);
  }, [speedValue, speedFrom, speedTo]);

  const convertPressure = useCallback(() => {
    if (!pressureValue || isNaN(parseFloat(pressureValue))) return "";
    const fromFactor = pressureUnits[pressureFrom as keyof typeof pressureUnits].factor;
    const toFactor = pressureUnits[pressureTo as keyof typeof pressureUnits].factor;
    const result = (parseFloat(pressureValue) * fromFactor) / toFactor;
    return formatResult(result);
  }, [pressureValue, pressureFrom, pressureTo]);

  const convertTime = useCallback(() => {
    if (!timeValue || isNaN(parseFloat(timeValue))) return "";
    const fromFactor = timeUnits[timeFrom as keyof typeof timeUnits].factor;
    const toFactor = timeUnits[timeTo as keyof typeof timeUnits].factor;
    const result = (parseFloat(timeValue) * fromFactor) / toFactor;
    return formatResult(result);
  }, [timeValue, timeFrom, timeTo]);

  const convertCurrency = useCallback(() => {
    if (!currencyValue || isNaN(parseFloat(currencyValue))) return "";
    const fromFactor = currencyUnits[currencyFrom as keyof typeof currencyUnits].factor;
    const toFactor = currencyUnits[currencyTo as keyof typeof currencyUnits].factor;
    const result = (parseFloat(currencyValue) * fromFactor) / toFactor;
    return formatResult(result);
  }, [currencyValue, currencyFrom, currencyTo]);

  const formatResult = (result: number) => {
    if (result === 0) return "0";
    if (Math.abs(result) >= 1e12) {
      return result.toExponential(6);
    }
    if (Math.abs(result) < 1e-9 && result !== 0) {
      return result.toExponential(6);
    }
    const formatted = result.toFixed(12).replace(/\.?0+$/, "");
    return formatted;
  };

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
      case "time":
        const tempTime = timeFrom;
        setTimeFrom(timeTo);
        setTimeTo(tempTime);
        break;
      case "currency":
        const tempCurrency = currencyFrom;
        setCurrencyFrom(currencyTo);
        setCurrencyTo(tempCurrency);
        break;
    }
  };

  // Composant de conversion générique avec corrections pour le contraste en mode sombre
  const ConversionCard = ({ 
    title, 
    icon,
    value, 
    setValue, 
    fromUnit, 
    setFromUnit, 
    toUnit, 
    setToUnit, 
    units, 
    convertFunction, 
    swapType,
    color = "blue",
    explanationText
  }: any) => (
    <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow">
      <CardHeader className={`bg-gradient-to-r from-${color}-50 to-${color}-100 dark:from-${color}-950/50 dark:to-${color}-900/50`}>
        <CardTitle className="flex items-center gap-3">
          <div className={`p-2 bg-${color}-100 dark:bg-${color}-800 rounded-full`}>
            {icon}
          </div>
          {title}
          <Badge variant="secondary" className="text-xs">Haute précision</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Valeur à convertir</label>
            <Input
              type="number"
              placeholder="Entrez une valeur..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="text-lg font-mono border-2 focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              step="any"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Unité source</label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger className="border-2 bg-white dark:bg-gray-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                {Object.entries(units).map(([key, unit]: [string, any]) => (
                  <SelectItem key={key} value={key} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 w-full">
                            <span className="text-gray-900 dark:text-gray-100">{unit.name}</span>
                            <Badge variant="outline" className="text-xs">{unit.symbol}</Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
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
              className="hover:bg-blue-50 dark:hover:bg-blue-900 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-300"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Unité cible</label>
          <Select value={toUnit} onValueChange={setToUnit}>
            <SelectTrigger className="border-2 bg-white dark:bg-gray-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              {Object.entries(units).map(([key, unit]: [string, any]) => (
                <SelectItem key={key} value={key} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 w-full">
                          <span className="text-gray-900 dark:text-gray-100">{unit.name}</span>
                          <Badge variant="outline" className="text-xs">{unit.symbol}</Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
                        <p>{unit.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-100">Résultat de la conversion</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white font-mono break-all">
            {convertFunction()} {units[toUnit]?.symbol}
          </p>
          {value && (
            <p className="text-sm text-gray-600 dark:text-gray-200 mt-2">
              {value} {units[fromUnit]?.symbol} = {convertFunction()} {units[toUnit]?.symbol}
            </p>
          )}
        </div>

        {explanationText && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-medium mb-1">Notes importantes :</p>
                <div className="space-y-1">{explanationText}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="text-center space-y-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl border-2 border-blue-200 dark:border-blue-800">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Convertisseurs d'Unités Professionnels
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Convertissez facilement entre différentes unités de mesure avec une précision maximale. 
            Tous les calculs sont basés sur les standards internationaux officiels.
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="secondary">10 types de conversions</Badge>
            <Badge variant="secondary">80+ unités disponibles</Badge>
            <Badge variant="secondary">Précision scientifique</Badge>
            <Badge variant="secondary">Standards SI</Badge>
          </div>
        </div>

        <Tabs defaultValue="length" className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 text-xs bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="length" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-300">
              <Ruler className="w-4 h-4 mr-1" />
              Longueurs
            </TabsTrigger>
            <TabsTrigger value="weight" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900 dark:data-[state=active]:text-green-300">
              <Weight className="w-4 h-4 mr-1" />
              Poids
            </TabsTrigger>
            <TabsTrigger value="temperature" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 dark:data-[state=active]:bg-orange-900 dark:data-[state=active]:text-orange-300">
              <Thermometer className="w-4 h-4 mr-1" />
              Température
            </TabsTrigger>
            <TabsTrigger value="volume" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-300">
              <Droplets className="w-4 h-4 mr-1" />
              Volume
            </TabsTrigger>
            <TabsTrigger value="area" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700 dark:data-[state=active]:bg-teal-900 dark:data-[state=active]:text-teal-300">
              <Square className="w-4 h-4 mr-1" />
              Surface
            </TabsTrigger>
            <TabsTrigger value="energy" className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700 dark:data-[state=active]:bg-yellow-900 dark:data-[state=active]:text-yellow-300">
              <Zap className="w-4 h-4 mr-1" />
              Énergie
            </TabsTrigger>
            <TabsTrigger value="speed" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-700 dark:data-[state=active]:bg-red-900 dark:data-[state=active]:text-red-300">
              <Wind className="w-4 h-4 mr-1" />
              Vitesse
            </TabsTrigger>
            <TabsTrigger value="pressure" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-300">
              <Gauge className="w-4 h-4 mr-1" />
              Pression
            </TabsTrigger>
            <TabsTrigger value="time" className="data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-700 dark:data-[state=active]:bg-cyan-900 dark:data-[state=active]:text-cyan-300">
              <Clock className="w-4 h-4 mr-1" />
              Temps
            </TabsTrigger>
            <TabsTrigger value="currency" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900 dark:data-[state=active]:text-emerald-300">
              <DollarSign className="w-4 h-4 mr-1" />
              Devises
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="length">
            <ConversionCard
              title="Convertisseur de Longueurs"
              icon={<Ruler className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
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
              explanationText={
                <>
                  <p>• Les conversions sont basées sur le système international (SI)</p>
                  <p>• Le mètre est l'unité de référence définie par la vitesse de la lumière</p>
                  <p>• Les unités astronomiques (année-lumière) utilisent des approximations</p>
                </>
              }
            />
          </TabsContent>
          
          <TabsContent value="weight">
            <ConversionCard
              title="Convertisseur de Poids & Masse"
              icon={<Weight className="w-5 h-5 text-green-600 dark:text-green-400" />}
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
              explanationText={
                <>
                  <p>• Distinction importante : poids (force) vs masse (quantité de matière)</p>
                  <p>• Sur Terre, 1 kg de masse = 9.81 N de poids</p>
                  <p>• Les conversions ici concernent la masse, pas le poids</p>
                  <p>• Le carat métrique (200 mg) diffère du carat de pureté de l'or</p>
                </>
              }
            />
          </TabsContent>
          
          <TabsContent value="temperature">
            <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-full">
                    <Thermometer className="w-5 h-5 text-orange-600 dark:text-orange-400" />
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
                      placeholder="Entrez une température..."
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="text-lg font-mono border-2 focus:border-orange-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      step="any"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Unité source</label>
                    <Select value={tempFrom} onValueChange={setTempFrom}>
                      <SelectTrigger className="border-2 bg-white dark:bg-gray-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        {Object.entries(temperatureUnits).map(([key, unit]: [string, any]) => (
                          <SelectItem key={key} value={key} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="flex items-center gap-2 w-full">
                              <span className="text-gray-900 dark:text-gray-100">{unit.name}</span>
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
                      onClick={() => swapUnits("temperature")}
                      className="hover:bg-orange-50 dark:hover:bg-orange-900 border-2 border-orange-200 dark:border-orange-700 hover:border-orange-300"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Unité cible</label>
                  <Select value={tempTo} onValueChange={setTempTo}>
                    <SelectTrigger className="border-2 bg-white dark:bg-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      {Object.entries(temperatureUnits).map(([key, unit]: [string, any]) => (
                        <SelectItem key={key} value={key} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                          <div className="flex items-center gap-2 w-full">
                            <span className="text-gray-900 dark:text-gray-100">{unit.name}</span>
                            <Badge variant="outline" className="text-xs">{unit.symbol}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/40 dark:to-red-900/40 rounded-xl border-2 border-orange-200 dark:border-orange-700">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1 bg-orange-200 dark:bg-orange-700 rounded-full">
                      <Info className="w-4 h-4 text-orange-600 dark:text-orange-300" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-100">Résultat de la conversion</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white font-mono">
                    {convertTemperature()}{tempTo !== 'kelvin' ? '°' : ''} {temperatureUnits[tempTo as keyof typeof temperatureUnits]?.symbol?.replace('°', '')}
                  </p>
                  {tempValue && (
                    <div className="mt-4 p-3 bg-orange-100/50 dark:bg-orange-800/30 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Références utiles :</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">• Congélation de l'eau: 0°C = 32°F = 273.15K</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">• Ébullition de l'eau: 100°C = 212°F = 373.15K</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">• Zéro absolu: -273.15°C = -459.67°F = 0K</p>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800 dark:text-amber-200">
                      <p className="font-medium mb-1">Notes importantes :</p>
                      <div className="space-y-1">
                        <p>• Kelvin est l'unité SI absolue (pas de valeurs négatives)</p>
                        <p>• Rankine = Kelvin mais avec l'échelle Fahrenheit</p>
                        <p>• Réaumur était utilisé en Europe avant Celsius</p>
                        <p>• Les conversions sont exactes selon les définitions officielles</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="volume">
            <ConversionCard
              title="Convertisseur de Volume"
              icon={<Droplets className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
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
              explanationText={
                <>
                  <p>• 1 litre = 1 dm³ par définition (valide pour tous les fluides)</p>
                  <p>• Gallon US ≠ Gallon UK (différence de 20%)</p>
                  <p>• Les conversions culinaires peuvent varier selon les ingrédients</p>
                  <p>• Volume ≠ capacité (le volume dépend de la température)</p>
                </>
              }
            />
          </TabsContent>
          
          <TabsContent value="area">
            <ConversionCard
              title="Convertisseur de Surface"
              icon={<Square className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
              value={areaValue}
              setValue={setAreaValue}
              fromUnit={areaFrom}
              setFromUnit={setAreaFrom}
              toUnit={areaTo}
              setToUnit={setAreaTo}
              units={areaUnits}
              convertFunction={convertArea}
              swapType="area"
              color="teal"
              explanationText={
                <>
                  <p>• 1 hectare = 10 000 m² (carré de 100m de côté)</p>
                  <p>• 1 acre ≈ 4047 m² (surface historique anglo-saxonne)</p>
                  <p>• Les surfaces courbes nécessitent des calculs spécialisés</p>
                  <p>• Attention aux confusions : are (100 m²) vs acre</p>
                </>
              }
            />
          </TabsContent>
          
          <TabsContent value="energy">
            <ConversionCard
              title="Convertisseur d'Énergie"
              icon={<Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />}
              value={energyValue}
              setValue={setEnergyValue}
              fromUnit={energyFrom}
              setFromUnit={setEnergyFrom}
              toUnit={energyTo}
              setToUnit={setEnergyTo}
              units={energyUnits}
              convertFunction={convertEnergy}
              swapType="energy"
              color="yellow"
              explanationText={
                <>
                  <p>• Calorie nutritionnelle = kilocalorie (1000 cal thermiques)</p>
                  <p>• kWh = unité de facturation électrique (3.6 MJ)</p>
                  <p>• BTU = énergie pour chauffer 1 livre d'eau de 1°F</p>
                  <p>• Énergie ≠ puissance (Joule vs Watt)</p>
                </>
              }
            />
          </TabsContent>
          
          <TabsContent value="speed">
            <ConversionCard
              title="Convertisseur de Vitesse"
              icon={<Wind className="w-5 h-5 text-red-600 dark:text-red-400" />}
              value={speedValue}
              setValue={setSpeedValue}
              fromUnit={speedFrom}
              setFromUnit={setSpeedFrom}
              toUnit={speedTo}
              setToUnit={setSpeedTo}
              units={speedUnits}
              convertFunction={convertSpeed}
              swapType="speed"
              color="red"
              explanationText={
                <>
                  <p>• Nœud = vitesse maritime (1 mille nautique/heure)</p>
                  <p>• Mach varie avec la température et l'altitude</p>
                  <p>• Vitesse de la lumière ≈ 299 792 458 m/s (constante physique)</p>
                  <p>• Les limitations de vitesse dépendent du contexte local</p>
                </>
              }
            />
          </TabsContent>
          
          <TabsContent value="pressure">
            <ConversionCard
              title="Convertisseur de Pression"
              icon={<Gauge className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
              value={pressureValue}
              setValue={setPressureValue}
              fromUnit={pressureFrom}
              setFromUnit={setPressureFrom}
              toUnit={pressureTo}
              setToUnit={setPressureTo}
              units={pressureUnits}
              convertFunction={convertPressure}
              swapType="pressure"
              color="indigo"
              explanationText={
                <>
                  <p>• 1 bar ≈ pression atmosphérique au niveau de la mer</p>
                  <p>• PSI = pression des pneus, compresseurs (livres/pouce²)</p>
                  <p>• mmHg = pression artérielle, baromètres à mercure</p>
                  <p>• Attention : pression absolue vs relative (manométrique)</p>
                </>
              }
            />
          </TabsContent>

          <TabsContent value="time">
            <ConversionCard
              title="Convertisseur de Temps"
              icon={<Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />}
              value={timeValue}
              setValue={setTimeValue}
              fromUnit={timeFrom}
              setFromUnit={setTimeFrom}
              toUnit={timeTo}
              setToUnit={setTimeTo}
              units={timeUnits}
              convertFunction={convertTime}
              swapType="time"
              color="cyan"
              explanationText={
                <>
                  <p>• 1 année = 365.25 jours (incluant les années bissextiles)</p>
                  <p>• 1 mois ≈ 30.44 jours (moyenne calendaire)</p>
                  <p>• Les durées astronomiques varient (année tropique, sidérale...)</p>
                  <p>• Attention aux fuseaux horaires pour les calculs de dates</p>
                </>
              }
            />
          </TabsContent>

          <TabsContent value="currency">
            <ConversionCard
              title="Convertisseur de Devises"
              icon={<DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
              value={currencyValue}
              setValue={setCurrencyValue}
              fromUnit={currencyFrom}
              setFromUnit={setCurrencyFrom}
              toUnit={currencyTo}
              setToUnit={setCurrencyTo}
              units={currencyUnits}
              convertFunction={convertCurrency}
              swapType="currency"
              color="emerald"
              explanationText={
                <>
                  <p>• ⚠️ Taux de change approximatifs - Non utilisables pour transactions réelles</p>
                  <p>• Les taux fluctuent constamment selon les marchés financiers</p>
                  <p>• Pour des conversions précises, consultez votre banque ou des API financières</p>
                  <p>• Les frais de change et commissions ne sont pas inclus</p>
                </>
              }
            />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};
