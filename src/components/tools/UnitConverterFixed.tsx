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
    const toFactor = timeUnits[timeTo as keyof typeof timeTo].factor;
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

  /**
   * Génère une notice explicative détaillée selon le type de conversion et les unités utilisées.
   * Cette fonction prend en compte les conditions spéciales et interprétations nécessaires.
   * 
   * @param type - Type de conversion (length, weight, temperature, etc.)
   * @param fromUnit - Unité source
   * @param toUnit - Unité cible
   * @returns Notice explicative formatée en HTML
   */
  const getDetailedExplanatoryNote = (type: string, fromUnit: string, toUnit: string) => {
    const conversionPair = `${fromUnit}_to_${toUnit}`;
    
    switch (type) {
      case "length":
        const lengthNotes: { [key: string]: string } = {
          meter_to_light_year: "⚠️ Conversion astronomique approximative. 1 année-lumière = distance parcourue par la lumière en 1 an dans le vide (≈ 9,461 × 10¹⁵ m).",
          light_year_to_meter: "🌌 Une année-lumière représente environ 63 241 unités astronomiques ou 9 461 milliards de kilomètres.",
          meter_to_astronomical_unit: "🪐 L'unité astronomique correspond à la distance moyenne Terre-Soleil (≈ 149,6 millions de km).",
          inch_to_meter: "📏 Conversion système impérial → métrique. 1 pouce = exactement 2,54 cm selon la définition internationale.",
          foot_to_meter: "👣 Le pied international = 12 pouces = 30,48 cm exactement (défini en 1959).",
          mile_to_kilometer: "🛣️ Mile terrestre US = 5280 pieds. Attention : différent du mile nautique (1852 m).",
          nautical_mile_to_meter: "⚓ Mile nautique = 1/60 de degré de latitude = 1852 m exactement (navigation maritime et aérienne)."
        };
        return lengthNotes[conversionPair] || "📐 Conversions de longueur basées sur le système international d'unités (SI). Les valeurs astronomiques sont approximatives.";

      case "weight":
        const weightNotes: { [key: string]: string } = {
          pound_to_kilogram: "⚖️ Livre internationale (avoirdupois) = 453,592338 g exactement. Utilisée aux USA, UK, Canada.",
          ounce_to_gram: "🥄 Once avoirdupois = 1/16 livre = 28,3495 g. Attention : différent de l'once troy (31,1035 g) pour métaux précieux.",
          stone_to_kilogram: "🇬🇧 Stone britannique = 14 livres = 6,35029 kg. Encore utilisé au Royaume-Uni pour le poids corporel.",
          carat_to_gram: "💎 Carat métrique = 200 mg exactement. Utilisé exclusivement pour les pierres précieuses et perles.",
          ton_to_kilogram: "🚛 Tonne métrique = 1000 kg. Attention : tonne US (907 kg) et tonne UK (1016 kg) sont différentes.",
          short_ton_to_kilogram: "🇺🇸 Tonne courte américaine = 2000 livres = 907,185 kg (système avoirdupois).",
          long_ton_to_kilogram: "🇬🇧 Tonne longue britannique = 2240 livres = 1016,047 kg (système impérial)."
        };
        return weightNotes[conversionPair] || "⚖️ Conversions de masse. Attention aux différences entre systèmes métrique, impérial et US.";

      case "temperature":
        const tempNotes: { [key: string]: string } = {
          celsius_to_fahrenheit: "🌡️ °F = (°C × 9/5) + 32. Points de référence : 0°C = 32°F (congélation), 100°C = 212°F (ébullition de l'eau).",
          fahrenheit_to_celsius: "🧊 °C = (°F - 32) × 5/9. Échelle Fahrenheit : 32°F (glace) à 212°F (vapeur d'eau) = 180 divisions.",
          celsius_to_kelvin: "❄️ K = °C + 273,15. Kelvin = échelle absolue (0 K = zéro absolu = -273,15°C).",
          kelvin_to_celsius: "🔬 Échelle thermodynamique internationale. 0 K = arrêt complet du mouvement moléculaire.",
          celsius_to_rankine: "🇺🇸 °R = (°C + 273,15) × 9/5. Rankine = Kelvin en degrés Fahrenheit (échelle absolue US).",
          reaumur_to_celsius: "📚 Échelle Réaumur historique : 0°Ré (glace) à 80°Ré (ébullition). °C = °Ré × 5/4."
        };
        return tempNotes[conversionPair] || "🌡️ Conversions de température selon les formules officielles. Points de référence : glace (0°C) et ébullition (100°C) de l'eau pure.";

      case "volume":
        const volumeNotes: { [key: string]: string } = {
          liter_to_cubic_meter: "⚠️ 1 L = 1 dm³ = 0,001 m³. ATTENTION : Cette équivalence est valable pour l'eau pure à 4°C. Pour d'autres liquides, multiplier par leur densité relative.",
          cubic_meter_to_liter: "🧪 1 m³ = 1000 L pour l'eau. Pour autres substances : Volume(L) = Volume(m³) × 1000 × densité_relative.",
          gallon_us_to_liter: "🇺🇸 Gallon liquide US = 3,785411784 L exactement. Différent du gallon impérial (4,546 L).",
          gallon_uk_to_liter: "🇬🇧 Gallon impérial = 4,54609 L exactement. Utilisé au Royaume-Uni, Canada, certains pays du Commonwealth.",
          cup_to_milliliter: "☕ Tasse US légale = 240 mL. Attention : tasse métrique = 250 mL, tasse UK = 284 mL.",
          tablespoon_to_milliliter: "🥄 Cuillère à soupe US = 14,7868 mL ≈ 15 mL. Variable selon pays : AU = 20 mL, UK = 17,7 mL.",
          teaspoon_to_milliliter: "🥄 Cuillère à café US = 4,929 mL ≈ 5 mL. Standard international culinaire ≈ 5 mL."
        };
        return volumeNotes[conversionPair] || "💧 Conversions de volume. IMPORTANT : L ↔ m³ valable pour l'eau uniquement (densité = 1). Pour autres liquides, appliquer la densité.";

      case "area":
        const areaNotes: { [key: string]: string } = {
          hectare_to_square_meter: "🌾 Hectare = 10 000 m² = surface d'un carré de 100 m de côté. Unité agricole et forestière standard.",
          acre_to_square_meter: "🇺🇸 Acre US = 4046,86 m² ≈ 0,4047 ha. ATTENTION : Acre écossais = 5067 m², acre irlandais = 6555 m².",
          square_mile_to_square_kilometer: "🗺️ Mile carré = (1 mile)² = 2,59 km². Utilisé pour surfaces importantes (villes, pays).",
          square_foot_to_square_meter: "🏠 Pied carré = (12 pouces)² = 929,03 cm². Unité immobilière courante aux USA.",
          are_to_square_meter: "📐 Are = 100 m² = surface d'un carré de 10 m de côté. 1 hectare = 100 ares."
        };
        return areaNotes[conversionPair] || "📐 Conversions de surface. Attention : les unités foncières varient selon les pays (acre US ≠ acre UK).";

      case "energy":
        const energyNotes: { [key: string]: string } = {
          calorie_to_joule: "🔥 Calorie thermochimique = 4,184 J exactement. ATTENTION : Calorie alimentaire = 1 kcal = 4184 J.",
          kilocalorie_to_joule: "🍎 Kilocalorie (Cal alimentaire) = 1000 cal = 4184 J. C'est l'unité des étiquettes nutritionnelles.",
          kilowatt_hour_to_joule: "⚡ kWh = 3,6 MJ. Unité de facturation électrique : 1 kWh ≈ coût de fonctionnement d'un radiateur 1 kW pendant 1 heure.",
          btu_to_joule: "🇺🇸 BTU (British Thermal Unit) = énergie pour élever 1 livre d'eau de 1°F = 1055,06 J.",
          therm_to_joule: "🏠 Therm = 100 000 BTU ≈ 105,5 MJ. Unité de facturation du gaz naturel aux USA.",
          foot_pound_to_joule: "🔧 Pied-livre-force = travail d'une force de 1 lbf sur 1 pied = 1,356 J. Unité mécanique anglo-saxonne."
        };
        return energyNotes[conversionPair] || "⚡ Conversions d'énergie. Note : Calories alimentaires = kcal (1000 cal). 1 kWh = consommation typique d'un appareil de 1000W pendant 1h.";

      case "speed":
        const speedNotes: { [key: string]: string } = {
          kilometer_per_hour_to_meter_per_second: "🚗 Conversion : km/h ÷ 3,6 = m/s. Ex: 36 km/h = 10 m/s, 72 km/h = 20 m/s.",
          mile_per_hour_to_kilometer_per_hour: "🇺🇸 Mile/h → km/h : multiplier par 1,609344. Limitations routières US souvent en mph.",
          knot_to_meter_per_second: "⛵ Nœud (navigation) = 1 mile nautique/heure = 0,514444 m/s. 1 nœud ≈ 1,852 km/h.",
          mach_to_meter_per_second: "✈️ Mach 1 ≈ 343 m/s (vitesse du son à 20°C au niveau de la mer). Variable selon altitude et température.",
          speed_of_light_to_meter_per_second: "🌌 Vitesse de la lumière dans le vide = 299 792 458 m/s exactement (constante physique fondamentale)."
        };
        return speedNotes[conversionPair] || "🏃 Conversions de vitesse. Note : Mach varie avec l'altitude/température. 1 nœud = 1 mile nautique/heure.";

      case "pressure":
        const pressureNotes: { [key: string]: string } = {
          bar_to_pascal: "🌀 Bar = 100 000 Pa = pression atmosphérique standard ≈ 1,013 bar. Unité météorologique courante.",
          atmosphere_to_pascal: "🌍 Atmosphère standard = 101 325 Pa = pression au niveau de la mer à 15°C. Référence internationale.",
          psi_to_pascal: "🇺🇸 PSI (pounds per square inch) = 6894,76 Pa. Unité US pour pneus, hydraulique, pneumatique.",
          mmhg_to_pascal: "🩺 mmHg (Torr) = 133,322 Pa. Unité médicale (tension artérielle) et météorologique historique.",
          inhg_to_pascal: "🌡️ Pouce de mercure = 3386,39 Pa. Unité météorologique US (pression barométrique).",
          millibar_to_pascal: "☁️ Millibar = 100 Pa. Unité météorologique : 1013,25 mbar = pression atmosphérique standard."
        };
        return pressureNotes[conversionPair] || "🌀 Conversions de pression. Références : 1 atm = 1013,25 mbar = 760 mmHg = 14,7 psi (conditions standard).";

      case "power":
        const powerNotes: { [key: string]: string } = {
          horsepower_to_watt: "🐎 Cheval-vapeur mécanique (HP) = 745,7 W. ATTENTION : PS métrique = 735,5 W (différent!).",
          metric_horsepower_to_watt: "🇪🇺 Cheval-vapeur métrique (PS/ch/CV) = 735,499 W. Standard européen, différent du HP anglo-saxon.",
          kilowatt_to_watt: "⚡ kW = 1000 W. Référence : 1 kW ≈ puissance d'un radiateur électrique domestique.",
          btu_per_hour_to_watt: "❄️ BTU/h = 0,293 W. Unité de climatisation US : 12 000 BTU/h = 1 tonne de réfrigération.",
          megawatt_to_watt: "🏭 MW = 1 000 000 W = puissance d'une petite centrale électrique ou d'une grosse éolienne."
        };
        return powerNotes[conversionPair] || "⚡ Conversions de puissance. Important : HP américain (745,7 W) ≠ PS européen (735,5 W).";

      case "time":
        const timeNotes: { [key: string]: string } = {
          year_to_day: "📅 Année = 365 jours (année commune). Année bissextile = 366 jours. Année tropique = 365,2422 jours.",
          month_to_day: "🗓️ Mois conventionnel = 30 jours. RÉALITÉ : 28-31 jours selon mois et année bissextile.",
          week_to_day: "📆 Semaine = 7 jours exactement. Standard international depuis calendrier julien.",
          day_to_hour: "🌅 Jour = 24 heures exactement (jour solaire moyen). Jour sidéral = 23h 56min 4s.",
          hour_to_minute: "🕐 Heure = 60 minutes = 3600 secondes. Division babylonienne en base 60.",
          minute_to_second: "⏱️ Minute = 60 secondes. Seconde = durée de 9 192 631 770 périodes de radiation du césium-133."
        };
        return timeNotes[conversionPair] || "⏰ Conversions temporelles conventionnelles. Note : mois réels = 28-31 jours, années bissextiles = 366 jours.";

      case "currency":
        return "💱 ATTENTION : Taux de change INDICATIFS et NON temps réel. Les taux fluctuent constamment. Consultez votre banque ou un service financier pour les taux officiels actuels. Frais de change non inclus.";

      case "data":
        const dataNotes: { [key: string]: string } = {
          kilobyte_to_byte: "💾 Ambiguïté historique : KB = 1024 B (binaire) ou 1000 B (décimal). Standard SI = 1000, mais OS souvent 1024.",
          megabyte_to_byte: "💿 MB : 1 000 000 B (fabricants) vs 1 048 576 B (système). D'où écart capacité annoncée/réelle des disques.",
          gigabyte_to_byte: "💽 GB : 1 milliard B (marketing) vs 1 073 741 824 B (binaire). Différence ≈ 7% sur disques durs.",
          kibibyte_to_byte: "🔢 KiB (kibioctet) = 1024 B exactement. Standard IEC pour éviter confusion avec kB décimal.",
          bit_to_byte: "🔢 8 bits = 1 octet (byte). Bit = plus petite unité d'information (0 ou 1)."
        };
        return dataNotes[conversionPair] || "💾 Confusion fréquente : fabricants utilisent base 10 (kB=1000B) mais systèmes base 2 (KB=1024B). Standard IEC : KiB, MiB, GiB (binaire).";

      default:
        return "ℹ️ Conversion standard basée sur les facteurs de conversion officiels.";
    }
  };

  // Composant de conversion générique avec notice détaillée
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
          <Badge variant="secondary" className="text-xs">Documentation améliorée</Badge>
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

        <Alert className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
          <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <div dangerouslySetInnerHTML={{ 
              __html: getDetailedExplanatoryNote(swapType, fromUnit, toUnit)
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

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl border-2 border-blue-200 dark:border-blue-800">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Convertisseur d'Unités Professionnel - Documentation Complète
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          12 catégories de conversion avec notices explicatives détaillées, conditions d'utilisation et précisions sur les interprétations spécifiques de chaque conversion.
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge variant="secondary">📚 Documentation améliorée</Badge>
          <Badge variant="secondary">⚠️ Conditions spécifiques</Badge>
          <Badge variant="secondary">🔍 Précisions techniques</Badge>
          <Badge variant="secondary">🌍 Standards internationaux</Badge>
          <Badge variant="secondary">💡 Conseils d'usage</Badge>
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
            title="Convertisseur de Longueurs - Précision Métrique et Astronomique"
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
            title="Convertisseur de Poids - Systèmes Métrique, Impérial et US"
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
            title="Convertisseur de Température - Échelles Scientifiques et Pratiques"
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
            title="Convertisseur de Volume - Attention aux Densités"
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
            title="Convertisseur de Surface - Unités Foncières Internationales"
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
            title="Convertisseur d'Énergie - Thermique, Électrique et Mécanique"
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
            title="Convertisseur de Vitesse - Navigation, Automobile et Aéronautique"
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
            title="Convertisseur de Pression - Météorologie, Mécanique et Médical"
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
            title="Convertisseur de Puissance - Moteurs et Électricité"
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
            title="Convertisseur de Temps - Calendaires et Scientifiques"
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
            title="Convertisseur de Devises - Taux Indicatifs Non Temps Réel"
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
            title="Convertisseur de Données Numériques - Binaire vs Décimal"
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
