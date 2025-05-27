
import { UnitDefinition, TemperatureUnit } from '../types/unitTypes';

export const lengthUnits: Record<string, UnitDefinition> = {
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

export const weightUnits: Record<string, UnitDefinition> = {
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

export const temperatureUnits: Record<string, TemperatureUnit> = {
  celsius: { name: "Celsius", symbol: "°C" },
  fahrenheit: { name: "Fahrenheit", symbol: "°F" },
  kelvin: { name: "Kelvin", symbol: "K" },
  rankine: { name: "Rankine", symbol: "°R" },
  reaumur: { name: "Réaumur", symbol: "°Ré" }
};

export const volumeUnits: Record<string, UnitDefinition> = {
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

export const areaUnits: Record<string, UnitDefinition> = {
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

export const energyUnits: Record<string, UnitDefinition> = {
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

export const speedUnits: Record<string, UnitDefinition> = {
  meter_per_second: { name: "Mètre/seconde", factor: 1, symbol: "m/s" },
  kilometer_per_hour: { name: "Kilomètre/heure", factor: 0.277778, symbol: "km/h" },
  mile_per_hour: { name: "Mile/heure", factor: 0.44704, symbol: "mph" },
  foot_per_second: { name: "Pied/seconde", factor: 0.3048, symbol: "ft/s" },
  knot: { name: "Nœud", factor: 0.514444, symbol: "kn" },
  mach: { name: "Mach (vitesse du son)", factor: 343, symbol: "Ma" },
  speed_of_light: { name: "Vitesse de la lumière", factor: 299792458, symbol: "c" }
};

export const pressureUnits: Record<string, UnitDefinition> = {
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

export const powerUnits: Record<string, UnitDefinition> = {
  watt: { name: "Watt", factor: 1, symbol: "W" },
  kilowatt: { name: "Kilowatt", factor: 1000, symbol: "kW" },
  megawatt: { name: "Mégawatt", factor: 1000000, symbol: "MW" },
  gigawatt: { name: "Gigawatt", factor: 1000000000, symbol: "GW" },
  horsepower: { name: "Cheval-vapeur", factor: 745.7, symbol: "hp" },
  metric_horsepower: { name: "Cheval-vapeur métrique", factor: 735.499, symbol: "PS" },
  btu_per_hour: { name: "BTU/heure", factor: 0.293071, symbol: "BTU/h" },
  calorie_per_second: { name: "Calorie/seconde", factor: 4.184, symbol: "cal/s" }
};

export const timeUnits: Record<string, UnitDefinition> = {
  second: { name: "Seconde", factor: 1, symbol: "s" },
  millisecond: { name: "Milliseconde", factor: 0.001, symbol: "ms" },
  microsecond: { name: "Microseconde", factor: 0.000001, symbol: "μs" },
  nanosecond: { name: "Nanoseconde", factor: 0.000000001, symbol: "ns" },
  minute: { name: "Minute", factor: 60, symbol: "min" },
  hour: { name: "Heure", factor: 3600, symbol: "h" },
  day: { name: "Jour", factor: 86400, symbol: "j" },
  week: { name: "Semaine", factor: 604800, symbol: "sem" },
  month: { name: "Mois (30.44 jours)", factor: 2629746, symbol: "mois" },
  year: { name: "Année (365.25 jours)", factor: 31557600, symbol: "an" },
  decade: { name: "Décennie", factor: 315576000, symbol: "déc" },
  century: { name: "Siècle", factor: 3155760000, symbol: "siècle" }
};

export const currencyUnits: Record<string, UnitDefinition> = {
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

export const dataUnits: Record<string, UnitDefinition> = {
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
