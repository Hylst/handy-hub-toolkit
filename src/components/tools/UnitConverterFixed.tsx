
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightLeft, Info, Ruler, Weight, Thermometer, Droplets, Square, Zap, Wind, Gauge, Clock, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const UnitConverterFixed = () => {
  // États pour chaque catégorie avec gestion séparée des inputs
  const [lengthInput, setLengthInput] = useState("");
  const [lengthFrom, setLengthFrom] = useState("meter");
  const [lengthTo, setLengthTo] = useState("kilometer");

  const [weightInput, setWeightInput] = useState("");
  const [weightFrom, setWeightFrom] = useState("kilogram");
  const [weightTo, setWeightTo] = useState("gram");

  const [tempInput, setTempInput] = useState("");
  const [tempFrom, setTempFrom] = useState("celsius");
  const [tempTo, setTempTo] = useState("fahrenheit");

  const [volumeInput, setVolumeInput] = useState("");
  const [volumeFrom, setVolumeFrom] = useState("liter");
  const [volumeTo, setVolumeTo] = useState("milliliter");

  const [areaInput, setAreaInput] = useState("");
  const [areaFrom, setAreaFrom] = useState("square_meter");
  const [areaTo, setAreaTo] = useState("square_kilometer");

  const [energyInput, setEnergyInput] = useState("");
  const [energyFrom, setEnergyFrom] = useState("joule");
  const [energyTo, setEnergyTo] = useState("calorie");

  const [speedInput, setSpeedInput] = useState("");
  const [speedFrom, setSpeedFrom] = useState("meter_per_second");
  const [speedTo, setSpeedTo] = useState("kilometer_per_hour");

  const [pressureInput, setPressureInput] = useState("");
  const [pressureFrom, setPressureFrom] = useState("pascal");
  const [pressureTo, setPressureTo] = useState("bar");

  const [powerInput, setPowerInput] = useState("");
  const [powerFrom, setPowerFrom] = useState("watt");
  const [powerTo, setPowerTo] = useState("kilowatt");

  const [timeInput, setTimeInput] = useState("");
  const [timeFrom, setTimeFrom] = useState("second");
  const [timeTo, setTimeTo] = useState("minute");

  const [currencyInput, setCurrencyInput] = useState("");
  const [currencyFrom, setCurrencyFrom] = useState("eur");
  const [currencyTo, setCurrencyTo] = useState("usd");

  const [dataInput, setDataInput] = useState("");
  const [dataFrom, setDataFrom] = useState("byte");
  const [dataTo, setDataTo] = useState("kilobyte");

  // Définitions complètes des unités
  const lengthUnits = {
    meter: { name: "Mètre", factor: 1, symbol: "m" },
    kilometer: { name: "Kilomètre", factor: 1000, symbol: "km" },
    centimeter: { name: "Centimètre", factor: 0.01, symbol: "cm" },
    millimeter: { name: "Millimètre", factor: 0.001, symbol: "mm" },
    micrometer: { name: "Micromètre", factor: 0.000001, symbol: "μm" },
    nanometer: { name: "Nanomètre", factor: 0.000000001, symbol: "nm" },
    inch: { name: "Pouce", factor: 0.0254, symbol: "in" },
    foot: { name: "Pied", factor: 0.3048, symbol: "ft" },
    yard: { name: "Yard", factor: 0.9144, symbol: "yd" },
    mile: { name: "Mile", factor: 1609.34, symbol: "mi" },
    nautical_mile: { name: "Mile nautique", factor: 1852, symbol: "nmi" },
    light_year: { name: "Année-lumière", factor: 9.461e15, symbol: "ly" },
    astronomical_unit: { name: "Unité astronomique", factor: 1.496e11, symbol: "AU" }
  };

  const weightUnits = {
    kilogram: { name: "Kilogramme", factor: 1, symbol: "kg" },
    gram: { name: "Gramme", factor: 0.001, symbol: "g" },
    milligram: { name: "Milligramme", factor: 0.000001, symbol: "mg" },
    microgram: { name: "Microgramme", factor: 0.000000001, symbol: "μg" },
    pound: { name: "Livre", factor: 0.453592, symbol: "lb" },
    ounce: { name: "Once", factor: 0.0283495, symbol: "oz" },
    ton: { name: "Tonne métrique", factor: 1000, symbol: "t" },
    short_ton: { name: "Tonne courte US", factor: 907.185, symbol: "ton US" },
    long_ton: { name: "Tonne longue", factor: 1016.05, symbol: "ton UK" },
    stone: { name: "Stone", factor: 6.35029, symbol: "st" },
    carat: { name: "Carat", factor: 0.0002, symbol: "ct" }
  };

  const temperatureUnits = {
    celsius: { name: "Celsius", symbol: "°C" },
    fahrenheit: { name: "Fahrenheit", symbol: "°F" },
    kelvin: { name: "Kelvin", symbol: "K" },
    rankine: { name: "Rankine", symbol: "°R" },
    reaumur: { name: "Réaumur", symbol: "°Ré" }
  };

  const volumeUnits = {
    liter: { name: "Litre", factor: 1, symbol: "L" },
    milliliter: { name: "Millilitre", factor: 0.001, symbol: "mL" },
    cubic_meter: { name: "Mètre cube", factor: 1000, symbol: "m³" },
    cubic_centimeter: { name: "Centimètre cube", factor: 0.001, symbol: "cm³" },
    cubic_inch: { name: "Pouce cube", factor: 0.0163871, symbol: "in³" },
    cubic_foot: { name: "Pied cube", factor: 28.3168, symbol: "ft³" },
    gallon_us: { name: "Gallon US", factor: 3.78541, symbol: "gal US" },
    gallon_uk: { name: "Gallon impérial", factor: 4.54609, symbol: "gal UK" },
    quart: { name: "Quart US", factor: 0.946353, symbol: "qt" },
    pint: { name: "Pinte US", factor: 0.473176, symbol: "pt" },
    cup: { name: "Tasse US", factor: 0.236588, symbol: "cup" },
    fluid_ounce: { name: "Once liquide US", factor: 0.0295735, symbol: "fl oz" },
    tablespoon: { name: "Cuillère à soupe", factor: 0.0147868, symbol: "tbsp" },
    teaspoon: { name: "Cuillère à café", factor: 0.00492892, symbol: "tsp" }
  };

  const areaUnits = {
    square_meter: { name: "Mètre carré", factor: 1, symbol: "m²" },
    square_kilometer: { name: "Kilomètre carré", factor: 1000000, symbol: "km²" },
    square_centimeter: { name: "Centimètre carré", factor: 0.0001, symbol: "cm²" },
    square_millimeter: { name: "Millimètre carré", factor: 0.000001, symbol: "mm²" },
    hectare: { name: "Hectare", factor: 10000, symbol: "ha" },
    are: { name: "Are", factor: 100, symbol: "a" },
    acre: { name: "Acre", factor: 4046.86, symbol: "ac" },
    square_foot: { name: "Pied carré", factor: 0.092903, symbol: "ft²" },
    square_inch: { name: "Pouce carré", factor: 0.00064516, symbol: "in²" },
    square_yard: { name: "Yard carré", factor: 0.836127, symbol: "yd²" },
    square_mile: { name: "Mile carré", factor: 2589988.11, symbol: "mi²" }
  };

  const energyUnits = {
    joule: { name: "Joule", factor: 1, symbol: "J" },
    kilojoule: { name: "Kilojoule", factor: 1000, symbol: "kJ" },
    megajoule: { name: "Mégajoule", factor: 1000000, symbol: "MJ" },
    calorie: { name: "Calorie", factor: 4.184, symbol: "cal" },
    kilocalorie: { name: "Kilocalorie", factor: 4184, symbol: "kcal" },
    watt_hour: { name: "Watt-heure", factor: 3600, symbol: "Wh" },
    kilowatt_hour: { name: "Kilowatt-heure", factor: 3600000, symbol: "kWh" },
    megawatt_hour: { name: "Mégawatt-heure", factor: 3600000000, symbol: "MWh" },
    btu: { name: "BTU", factor: 1055.06, symbol: "BTU" },
    therm: { name: "Therm", factor: 105506000, symbol: "thm" },
    foot_pound: { name: "Pied-livre", factor: 1.35582, symbol: "ft⋅lbf" }
  };

  const speedUnits = {
    meter_per_second: { name: "Mètre/seconde", factor: 1, symbol: "m/s" },
    kilometer_per_hour: { name: "Kilomètre/heure", factor: 0.277778, symbol: "km/h" },
    mile_per_hour: { name: "Mile/heure", factor: 0.44704, symbol: "mph" },
    foot_per_second: { name: "Pied/seconde", factor: 0.3048, symbol: "ft/s" },
    knot: { name: "Nœud", factor: 0.514444, symbol: "kn" },
    mach: { name: "Mach (vitesse du son)", factor: 343, symbol: "Ma" },
    speed_of_light: { name: "Vitesse de la lumière", factor: 299792458, symbol: "c" }
  };

  const pressureUnits = {
    pascal: { name: "Pascal", factor: 1, symbol: "Pa" },
    kilopascal: { name: "Kilopascal", factor: 1000, symbol: "kPa" },
    megapascal: { name: "Mégapascal", factor: 1000000, symbol: "MPa" },
    bar: { name: "Bar", factor: 100000, symbol: "bar" },
    millibar: { name: "Millibar", factor: 100, symbol: "mbar" },
    atmosphere: { name: "Atmosphère", factor: 101325, symbol: "atm" },
    psi: { name: "PSI", factor: 6894.76, symbol: "psi" },
    torr: { name: "Torr", factor: 133.322, symbol: "Torr" },
    mmhg: { name: "Millimètre de mercure", factor: 133.322, symbol: "mmHg" },
    inhg: { name: "Pouce de mercure", factor: 3386.39, symbol: "inHg" }
  };

  const powerUnits = {
    watt: { name: "Watt", factor: 1, symbol: "W" },
    kilowatt: { name: "Kilowatt", factor: 1000, symbol: "kW" },
    megawatt: { name: "Mégawatt", factor: 1000000, symbol: "MW" },
    gigawatt: { name: "Gigawatt", factor: 1000000000, symbol: "GW" },
    horsepower: { name: "Cheval-vapeur", factor: 745.7, symbol: "hp" },
    metric_horsepower: { name: "Cheval-vapeur métrique", factor: 735.499, symbol: "PS" },
    btu_per_hour: { name: "BTU/heure", factor: 0.293071, symbol: "BTU/h" },
    calorie_per_second: { name: "Calorie/seconde", factor: 4.184, symbol: "cal/s" }
  };

  const timeUnits = {
    second: { name: "Seconde", factor: 1, symbol: "s" },
    millisecond: { name: "Milliseconde", factor: 0.001, symbol: "ms" },
    microsecond: { name: "Microseconde", factor: 0.000001, symbol: "μs" },
    nanosecond: { name: "Nanoseconde", factor: 0.000000001, symbol: "ns" },
    minute: { name: "Minute", factor: 60, symbol: "min" },
    hour: { name: "Heure", factor: 3600, symbol: "h" },
    day: { name: "Jour", factor: 86400, symbol: "j" },
    week: { name: "Semaine", factor: 604800, symbol: "sem" },
    month: { name: "Mois (30 jours)", factor: 2592000, symbol: "mois" },
    year: { name: "Année (365 jours)", factor: 31536000, symbol: "an" },
    decade: { name: "Décennie", factor: 315360000, symbol: "déc" },
    century: { name: "Siècle", factor: 3153600000, symbol: "siècle" }
  };

  const currencyUnits = {
    eur: { name: "Euro", factor: 1, symbol: "€" },
    usd: { name: "Dollar américain", factor: 1.09, symbol: "$" },
    gbp: { name: "Livre sterling", factor: 0.86, symbol: "£" },
    jpy: { name: "Yen japonais", factor: 161.5, symbol: "¥" },
    chf: { name: "Franc suisse", factor: 0.95, symbol: "CHF" },
    cad: { name: "Dollar canadien", factor: 1.47, symbol: "CAD" },
    aud: { name: "Dollar australien", factor: 1.65, symbol: "AUD" },
    cny: { name: "Yuan chinois", factor: 7.8, symbol: "¥" },
    inr: { name: "Roupie indienne", factor: 91.2, symbol: "₹" },
    brl: { name: "Real brésilien", factor: 6.1, symbol: "R$" },
    rub: { name: "Rouble russe", factor: 88.5, symbol: "₽" },
    krw: { name: "Won sud-coréen", factor: 1456, symbol: "₩" }
  };

  const dataUnits = {
    bit: { name: "Bit", factor: 0.125, symbol: "bit" },
    byte: { name: "Octet", factor: 1, symbol: "B" },
    kilobyte: { name: "Kilooctet", factor: 1024, symbol: "KB" },
    megabyte: { name: "Mégaoctet", factor: 1048576, symbol: "MB" },
    gigabyte: { name: "Gigaoctet", factor: 1073741824, symbol: "GB" },
    terabyte: { name: "Téraoctet", factor: 1099511627776, symbol: "TB" },
    petabyte: { name: "Pétaoctet", factor: 1125899906842624, symbol: "PB" },
    exabyte: { name: "Exaoctet", factor: 1152921504606846976, symbol: "EB" },
    kibibyte: { name: "Kibioctet", factor: 1024, symbol: "KiB" },
    mebibyte: { name: "Mébioctet", factor: 1048576, symbol: "MiB" },
    gibibyte: { name: "Gibioctet", factor: 1073741824, symbol: "GiB" },
    tebibyte: { name: "Tébioctet", factor: 1099511627776, symbol: "TiB" }
  };

  // Fonctions de conversion améliorées
  const sanitizeInput = (value: string) => {
    return value.replace(/[^0-9.,-]/g, '').replace(',', '.');
  };

  const convertLength = useCallback(() => {
    const value = sanitizeInput(lengthInput);
    if (!value || isNaN(parseFloat(value))) return "";
    
    const fromFactor = lengthUnits[lengthFrom as keyof typeof lengthUnits].factor;
    const toFactor = lengthUnits[lengthTo as keyof typeof lengthUnits].factor;
    const result = (parseFloat(value) * fromFactor) / toFactor;
    
    return result.toFixed(6).replace(/\.?0+$/, "");
  }, [lengthInput, lengthFrom, lengthTo]);

  const convertWeight = useCallback(() => {
    const value = sanitizeInput(weightInput);
    if (!value || isNaN(parseFloat(value))) return "";
    
    const fromFactor = weightUnits[weightFrom as keyof typeof weightUnits].factor;
    const toFactor = weightUnits[weightTo as keyof typeof weightUnits].factor;
    const result = (parseFloat(value) * fromFactor) / toFactor;
    
    return result.toFixed(6).replace(/\.?0+$/, "");
  }, [weightInput, weightFrom, weightTo]);

  const convertTemperature = useCallback(() => {
    const value = sanitizeInput(tempInput);
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
      case "reaumur":
        celsius = temp * 5/4;
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
      case "reaumur":
        result = celsius * 4/5;
        break;
      default:
        result = celsius;
    }
    
    return result.toFixed(2);
  }, [tempInput, tempFrom, tempTo]);

  const convertVolume = useCallback(() => {
    const value = sanitizeInput(volumeInput);
    if (!value || isNaN(parseFloat(value))) return "";
    
    const fromFactor = volumeUnits[volumeFrom as keyof typeof volumeUnits].factor;
    const toFactor = volumeUnits[volumeTo as keyof typeof volumeUnits].factor;
    const result = (parseFloat(value) * fromFactor) / toFactor;
    
    return result.toFixed(6).replace(/\.?0+$/, "");
  }, [volumeInput, volumeFrom, volumeTo]);

  const convertArea = useCallback(() => {
    const value = sanitizeInput(areaInput);
    if (!value || isNaN(parseFloat(value))) return "";
    
    const fromFactor = areaUnits[areaFrom as keyof typeof areaUnits].factor;
    const toFactor = areaUnits[areaTo as keyof typeof areaUnits].factor;
    const result = (parseFloat(value) * fromFactor) / toFactor;
    
    return result.toFixed(6).replace(/\.?0+$/, "");
  }, [areaInput, areaFrom, areaTo]);

  const convertEnergy = useCallback(() => {
    const value = sanitizeInput(energyInput);
    if (!value || isNaN(parseFloat(value))) return "";
    
    const fromFactor = energyUnits[energyFrom as keyof typeof energyUnits].factor;
    const toFactor = energyUnits[energyTo as keyof typeof energyUnits].factor;
    const result = (parseFloat(value) * fromFactor) / toFactor;
    
    return result.toFixed(6).replace(/\.?0+$/, "");
  }, [energyInput, energyFrom, energyTo]);

  const convertSpeed = useCallback(() => {
    const value = sanitizeInput(speedInput);
    if (!value || isNaN(parseFloat(value))) return "";
    
    const fromFactor = speedUnits[speedFrom as keyof typeof speedUnits].factor;
    const toFactor = speedUnits[speedTo as keyof typeof speedUnits].factor;
    const result = (parseFloat(value) * fromFactor) / toFactor;
    
    return result.toFixed(6).replace(/\.?0+$/, "");
  }, [speedInput, speedFrom, speedTo]);

  const convertPressure = useCallback(() => {
    const value = sanitizeInput(pressureInput);
    if (!value || isNaN(parseFloat(value))) return "";
    
    const fromFactor = pressureUnits[pressureFrom as keyof typeof pressureUnits].factor;
    const toFactor = pressureUnits[pressureTo as keyof typeof pressureUnits].factor;
    const result = (parseFloat(value) * fromFactor) / toFactor;
    
    return result.toFixed(6).replace(/\.?0+$/, "");
  }, [pressureInput, pressureFrom, pressureTo]);

  const convertPower = useCallback(() => {
    const value = sanitizeInput(powerInput);
    if (!value || isNaN(parseFloat(value))) return "";
    
    const fromFactor = powerUnits[powerFrom as keyof typeof powerUnits].factor;
    const toFactor = powerUnits[powerTo as keyof typeof powerUnits].factor;
    const result = (parseFloat(value) * fromFactor) / toFactor;
    
    return result.toFixed(6).replace(/\.?0+$/, "");
  }, [powerInput, powerFrom, powerTo]);

  const convertTime = useCallback(() => {
    const value = sanitizeInput(timeInput);
    if (!value || isNaN(parseFloat(value))) return "";
    
    const fromFactor = timeUnits[timeFrom as keyof typeof timeUnits].factor;
    const toFactor = timeUnits[timeTo as keyof typeof timeUnits].factor;
    const result = (parseFloat(value) * fromFactor) / toFactor;
    
    return result.toFixed(6).replace(/\.?0+$/, "");
  }, [timeInput, timeFrom, timeTo]);

  const convertCurrency = useCallback(() => {
    const value = sanitizeInput(currencyInput);
    if (!value || isNaN(parseFloat(value))) return "";
    
    const fromFactor = currencyUnits[currencyFrom as keyof typeof currencyUnits].factor;
    const toFactor = currencyUnits[currencyTo as keyof typeof currencyUnits].factor;
    const result = (parseFloat(value) / fromFactor) * toFactor;
    
    return result.toFixed(4).replace(/\.?0+$/, "");
  }, [currencyInput, currencyFrom, currencyTo]);

  const convertData = useCallback(() => {
    const value = sanitizeInput(dataInput);
    if (!value || isNaN(parseFloat(value))) return "";
    
    const fromFactor = dataUnits[dataFrom as keyof typeof dataUnits].factor;
    const toFactor = dataUnits[dataTo as keyof typeof dataUnits].factor;
    const result = (parseFloat(value) * fromFactor) / toFactor;
    
    return result.toFixed(6).replace(/\.?0+$/, "");
  }, [dataInput, dataFrom, dataTo]);

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
      case "currency":
        const tempCurrency = currencyFrom;
        setCurrencyFrom(currencyTo);
        setCurrencyTo(tempCurrency);
        break;
      case "data":
        const tempData = dataFrom;
        setDataFrom(dataTo);
        setDataTo(tempData);
        break;
    }
  };

  // Notices explicatives pour chaque convertisseur
  const getExplanatoryNote = (type: string, fromUnit: string, toUnit: string) => {
    const notes: { [key: string]: string } = {
      length: "Les conversions astronomiques (année-lumière, unité astronomique) sont approximatives. 1 AL ≈ 9,461 × 10¹⁵ m.",
      weight: "Les conversions incluent les systèmes métrique, impérial et US. Le carat est utilisé pour les pierres précieuses (1 ct = 0,2 g).",
      temperature: "Les conversions sont exactes selon les formules officielles. Le point de congélation de l'eau : 0°C = 32°F = 273,15 K.",
      volume: "⚠️ Les conversions L ↔ m³ sont valables pour l'eau (densité = 1). Pour d'autres substances, multiplier par leur densité.",
      area: "Les conversions foncières varient selon les pays. L'acre US (4047 m²) diffère de l'acre écossais (5067 m²).",
      energy: "1 calorie = 4,184 J (calorie thermochimique). Les calories alimentaires sont en fait des kilocalories (kcal).",
      speed: "Mach varie selon l'altitude et la température (≈ 343 m/s au niveau de la mer à 20°C). Vitesse de la lumière dans le vide.",
      pressure: "Les conversions météorologiques : 1 atm = 1013,25 mbar = 760 mmHg = 29,92 inHg à 0°C.",
      power: "Cheval-vapeur : HP (US) ≠ PS (métrique). 1 HP = 745,7 W, 1 PS = 735,5 W.",
      time: "Les mois sont calculés sur 30 jours, les années sur 365 jours. Pour plus de précision, utiliser les dates calendaires.",
      currency: "💱 Taux de change indicatifs et non temps réel. Consultez votre banque pour les taux officiels actuels.",
      data: "Distinction binaire : KB = 1024 B vs kB = 1000 B. Les fabricants utilisent souvent la base 10 (kB, MB, GB)."
    };
    return notes[type] || "";
  };

  // Composant de conversion générique amélioré
  const ConversionCard = ({ 
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
  }: any) => (
    <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow">
      <CardHeader className={`bg-gradient-to-r from-${color}-50 to-${color}-100 dark:from-${color}-950/50 dark:to-${color}-900/50`}>
        <CardTitle className="flex items-center gap-3">
          <div className={`p-2 bg-${color}-100 dark:bg-${color}-800 rounded-full`}>
            {icon}
          </div>
          {title}
          <Badge variant="secondary" className="text-xs">Amélioré</Badge>
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
              onChange={(e) => setInputValue(sanitizeInput(e.target.value))}
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

        <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-sm text-gray-700 dark:text-gray-300">
            {getExplanatoryNote(swapType, fromUnit, toUnit)}
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

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl border-2 border-blue-200 dark:border-blue-800">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Convertisseur d'Unités Complet - Version Améliorée
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          12 catégories de conversion avec gestion fixe des inputs, meilleure lisibilité et notices explicatives détaillées.
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge variant="secondary">✅ Input corrigé</Badge>
          <Badge variant="secondary">🌙 Mode sombre optimisé</Badge>
          <Badge variant="secondary">📚 Notices explicatives</Badge>
          <Badge variant="secondary">💱 Devises incluses</Badge>
          <Badge variant="secondary">💾 Données numériques</Badge>
        </div>
      </div>

      <Tabs defaultValue="length" className="w-full">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12">
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
            <Clock className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Temps</span>
          </TabsTrigger>
          <TabsTrigger value="currency">
            <DollarSign className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Devises</span>
          </TabsTrigger>
          <TabsTrigger value="data">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Données</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="length">
          <ConversionCard
            title="Convertisseur de Longueurs"
            icon={<Ruler className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            inputValue={lengthInput}
            setInputValue={setLengthInput}
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
            inputValue={weightInput}
            setInputValue={setWeightInput}
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
            inputValue={tempInput}
            setInputValue={setTempInput}
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
            inputValue={volumeInput}
            setInputValue={setVolumeInput}
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
            inputValue={areaInput}
            setInputValue={setAreaInput}
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
            inputValue={energyInput}
            setInputValue={setEnergyInput}
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
            inputValue={speedInput}
            setInputValue={setSpeedInput}
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
            inputValue={pressureInput}
            setInputValue={setPressureInput}
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
            inputValue={powerInput}
            setInputValue={setPowerInput}
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
            icon={<Clock className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
            inputValue={timeInput}
            setInputValue={setTimeInput}
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

        <TabsContent value="currency">
          <ConversionCard
            title="Convertisseur de Devises"
            icon={<DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            inputValue={currencyInput}
            setInputValue={setCurrencyInput}
            fromUnit={currencyFrom}
            setFromUnit={setCurrencyFrom}
            toUnit={currencyTo}
            setToUnit={setCurrencyTo}
            units={currencyUnits}
            convertFunction={convertCurrency}
            swapType="currency"
            color="emerald"
          />
        </TabsContent>

        <TabsContent value="data">
          <ConversionCard
            title="Convertisseur de Données Numériques"
            icon={<TrendingUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
            inputValue={dataInput}
            setInputValue={setDataInput}
            fromUnit={dataFrom}
            setFromUnit={setDataFrom}
            toUnit={dataTo}
            setToUnit={setDataTo}
            units={dataUnits}
            convertFunction={convertData}
            swapType="data"
            color="slate"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
