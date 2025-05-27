
export interface UnitDefinition {
  name: string;
  factor: number;
  symbol: string;
}

export interface TemperatureUnit {
  name: string;
  symbol: string;
}

export interface ConversionCardProps {
  title: string;
  icon: React.ReactNode;
  inputValue: string;
  setInputValue: (value: string) => void;
  fromUnit: string;
  setFromUnit: (unit: string) => void;
  toUnit: string;
  setToUnit: (unit: string) => void;
  units: Record<string, UnitDefinition | TemperatureUnit>;
  convertFunction: () => string;
  swapType: string;
  color?: string;
}

export type ConversionType = 
  | "length" 
  | "weight" 
  | "temperature" 
  | "volume" 
  | "area" 
  | "energy" 
  | "speed" 
  | "pressure" 
  | "power" 
  | "time" 
  | "currency" 
  | "data";
