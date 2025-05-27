
import { UnitDefinition } from '../types/unitTypes';

export const sanitizeInput = (value: string): string => {
  return value.replace(/[^0-9.,-]/g, '').replace(',', '.');
};

export const convertWithFactors = (
  input: string,
  fromUnit: string,
  toUnit: string,
  units: Record<string, UnitDefinition>
): string => {
  const value = sanitizeInput(input);
  if (!value || isNaN(parseFloat(value))) return "";
  
  const fromFactor = units[fromUnit].factor;
  const toFactor = units[toUnit].factor;
  const result = (parseFloat(value) * fromFactor) / toFactor;
  
  return result.toFixed(6).replace(/\.?0+$/, "");
};

export const convertTemperature = (
  input: string,
  fromUnit: string,
  toUnit: string
): string => {
  const value = sanitizeInput(input);
  if (!value || isNaN(parseFloat(value))) return "";
  
  const temp = parseFloat(value);
  let celsius: number;
  
  // Conversion vers Celsius d'abord
  switch (fromUnit) {
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
  
  // Conversion depuis Celsius vers l'unité cible
  let result: number;
  switch (toUnit) {
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
};

export const convertCurrency = (
  input: string,
  fromUnit: string,
  toUnit: string,
  units: Record<string, UnitDefinition>
): string => {
  const value = sanitizeInput(input);
  if (!value || isNaN(parseFloat(value))) return "";
  
  const fromFactor = units[fromUnit].factor;
  const toFactor = units[toUnit].factor;
  const result = (parseFloat(value) / fromFactor) * toFactor;
  
  return result.toFixed(4).replace(/\.?0+$/, "");
};
