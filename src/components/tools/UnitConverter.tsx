
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calculator, Thermometer, Weight, Ruler, Droplets, Zap, Gauge, Clock, Database, DollarSign, Square, Workflow } from "lucide-react";
import { ConversionCard } from './components/ConversionCard';
import { useDebouncedInput } from '@/hooks/useDebouncedInput';
import { 
  lengthUnits, 
  weightUnits, 
  temperatureUnits, 
  volumeUnits, 
  areaUnits, 
  energyUnits, 
  speedUnits, 
  pressureUnits, 
  powerUnits, 
  timeUnits, 
  currencyUnits, 
  dataUnits 
} from './data/unitDefinitions';
import { convertWithFactors, convertTemperature, convertCurrency } from './utils/conversionUtils';

interface ConversionState {
  inputValue: string;
  fromUnit: string;
  toUnit: string;
}

const UnitConverter = () => {
  // États pour chaque type de conversion avec débounce
  const [lengthState, setLengthState] = useState<ConversionState>({
    inputValue: "", fromUnit: "meter", toUnit: "kilometer"
  });
  const [weightState, setWeightState] = useState<ConversionState>({
    inputValue: "", fromUnit: "kilogram", toUnit: "pound"
  });
  const [tempState, setTempState] = useState<ConversionState>({
    inputValue: "", fromUnit: "celsius", toUnit: "fahrenheit"
  });
  const [volumeState, setVolumeState] = useState<ConversionState>({
    inputValue: "", fromUnit: "liter", toUnit: "gallon_us"
  });
  const [areaState, setAreaState] = useState<ConversionState>({
    inputValue: "", fromUnit: "square_meter", toUnit: "hectare"
  });
  const [energyState, setEnergyState] = useState<ConversionState>({
    inputValue: "", fromUnit: "joule", toUnit: "kilocalorie"
  });
  const [speedState, setSpeedState] = useState<ConversionState>({
    inputValue: "", fromUnit: "meter_per_second", toUnit: "kilometer_per_hour"
  });
  const [pressureState, setPressureState] = useState<ConversionState>({
    inputValue: "", fromUnit: "pascal", toUnit: "bar"
  });
  const [powerState, setPowerState] = useState<ConversionState>({
    inputValue: "", fromUnit: "watt", toUnit: "horsepower"
  });
  const [timeState, setTimeState] = useState<ConversionState>({
    inputValue: "", fromUnit: "second", toUnit: "minute"
  });
  const [currencyState, setCurrencyState] = useState<ConversionState>({
    inputValue: "", fromUnit: "eur", toUnit: "usd"
  });
  const [dataState, setDataState] = useState<ConversionState>({
    inputValue: "", fromUnit: "byte", toUnit: "kilobyte"
  });

  // Débounce des valeurs d'entrée
  const debouncedLengthInput = useDebouncedInput(lengthState.inputValue, 300);
  const debouncedWeightInput = useDebouncedInput(weightState.inputValue, 300);
  const debouncedTempInput = useDebouncedInput(tempState.inputValue, 300);
  const debouncedVolumeInput = useDebouncedInput(volumeState.inputValue, 300);
  const debouncedAreaInput = useDebouncedInput(areaState.inputValue, 300);
  const debouncedEnergyInput = useDebouncedInput(energyState.inputValue, 300);
  const debouncedSpeedInput = useDebouncedInput(speedState.inputValue, 300);
  const debouncedPressureInput = useDebouncedInput(pressureState.inputValue, 300);
  const debouncedPowerInput = useDebouncedInput(powerState.inputValue, 300);
  const debouncedTimeInput = useDebouncedInput(timeState.inputValue, 300);
  const debouncedCurrencyInput = useDebouncedInput(currencyState.inputValue, 300);
  const debouncedDataInput = useDebouncedInput(dataState.inputValue, 300);

  // Fonctions de conversion avec débounce
  const convertLength = useCallback(() => 
    convertWithFactors(debouncedLengthInput, lengthState.fromUnit, lengthState.toUnit, lengthUnits), 
    [debouncedLengthInput, lengthState.fromUnit, lengthState.toUnit]
  );

  const convertWeight = useCallback(() => 
    convertWithFactors(debouncedWeightInput, weightState.fromUnit, weightState.toUnit, weightUnits), 
    [debouncedWeightInput, weightState.fromUnit, weightState.toUnit]
  );

  const convertTemp = useCallback(() => 
    convertTemperature(debouncedTempInput, tempState.fromUnit, tempState.toUnit), 
    [debouncedTempInput, tempState.fromUnit, tempState.toUnit]
  );

  const convertVolume = useCallback(() => 
    convertWithFactors(debouncedVolumeInput, volumeState.fromUnit, volumeState.toUnit, volumeUnits), 
    [debouncedVolumeInput, volumeState.fromUnit, volumeState.toUnit]
  );

  const convertArea = useCallback(() => 
    convertWithFactors(debouncedAreaInput, areaState.fromUnit, areaState.toUnit, areaUnits), 
    [debouncedAreaInput, areaState.fromUnit, areaState.toUnit]
  );

  const convertEnergy = useCallback(() => 
    convertWithFactors(debouncedEnergyInput, energyState.fromUnit, energyState.toUnit, energyUnits), 
    [debouncedEnergyInput, energyState.fromUnit, energyState.toUnit]
  );

  const convertSpeed = useCallback(() => 
    convertWithFactors(debouncedSpeedInput, speedState.fromUnit, speedState.toUnit, speedUnits), 
    [debouncedSpeedInput, speedState.fromUnit, speedState.toUnit]
  );

  const convertPressure = useCallback(() => 
    convertWithFactors(debouncedPressureInput, pressureState.fromUnit, pressureState.toUnit, pressureUnits), 
    [debouncedPressureInput, pressureState.fromUnit, pressureState.toUnit]
  );

  const convertPower = useCallback(() => 
    convertWithFactors(debouncedPowerInput, powerState.fromUnit, powerState.toUnit, powerUnits), 
    [debouncedPowerInput, powerState.fromUnit, powerState.toUnit]
  );

  const convertTime = useCallback(() => 
    convertWithFactors(debouncedTimeInput, timeState.fromUnit, timeState.toUnit, timeUnits), 
    [debouncedTimeInput, timeState.fromUnit, timeState.toUnit]
  );

  const convertCurrencyFn = useCallback(() => 
    convertCurrency(debouncedCurrencyInput, currencyState.fromUnit, currencyState.toUnit, currencyUnits), 
    [debouncedCurrencyInput, currencyState.fromUnit, currencyState.toUnit]
  );

  const convertData = useCallback(() => 
    convertWithFactors(debouncedDataInput, dataState.fromUnit, dataState.toUnit, dataUnits), 
    [debouncedDataInput, dataState.fromUnit, dataState.toUnit]
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-4">
          Convertisseurs d'Unités Universels
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
          Convertissez facilement entre différentes unités de mesure avec des explications détaillées 
          et des notes pédagogiques basées sur le système international.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <Badge variant="secondary" className="text-sm">12 Types de grandeurs</Badge>
          <Badge variant="secondary" className="text-sm">Conversion temps réel</Badge>
          <Badge variant="secondary" className="text-sm">Notes explicatives</Badge>
          <Badge variant="secondary" className="text-sm">Standards SI</Badge>
        </div>
      </div>

      <Tabs defaultValue="length" className="w-full">
        <div className="sticky top-16 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b pb-4">
          <TabsList className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 w-full gap-1 h-auto p-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <TabsTrigger value="length" className="flex flex-col items-center gap-1 p-3 text-xs font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <Ruler className="w-4 h-4" />
              <span className="hidden sm:inline">Longueur</span>
              <span className="sm:hidden">Long.</span>
            </TabsTrigger>
            <TabsTrigger value="weight" className="flex flex-col items-center gap-1 p-3 text-xs font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <Weight className="w-4 h-4" />
              <span className="hidden sm:inline">Poids</span>
              <span className="sm:hidden">Poids</span>
            </TabsTrigger>
            <TabsTrigger value="temperature" className="flex flex-col items-center gap-1 p-3 text-xs font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <Thermometer className="w-4 h-4" />
              <span className="hidden sm:inline">Température</span>
              <span className="sm:hidden">Temp.</span>
            </TabsTrigger>
            <TabsTrigger value="volume" className="flex flex-col items-center gap-1 p-3 text-xs font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <Droplets className="w-4 h-4" />
              <span className="hidden sm:inline">Volume</span>
              <span className="sm:hidden">Vol.</span>
            </TabsTrigger>
            <TabsTrigger value="area" className="flex flex-col items-center gap-1 p-3 text-xs font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <Square className="w-4 h-4" />
              <span className="hidden sm:inline">Surface</span>
              <span className="sm:hidden">Surf.</span>
            </TabsTrigger>
            <TabsTrigger value="energy" className="flex flex-col items-center gap-1 p-3 text-xs font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Énergie</span>
              <span className="sm:hidden">Éner.</span>
            </TabsTrigger>
            <TabsTrigger value="speed" className="flex flex-col items-center gap-1 p-3 text-xs font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <Gauge className="w-4 h-4" />
              <span className="hidden sm:inline">Vitesse</span>
              <span className="sm:hidden">Vit.</span>
            </TabsTrigger>
            <TabsTrigger value="pressure" className="flex flex-col items-center gap-1 p-3 text-xs font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <Workflow className="w-4 h-4" />
              <span className="hidden sm:inline">Pression</span>
              <span className="sm:hidden">Press.</span>
            </TabsTrigger>
            <TabsTrigger value="power" className="flex flex-col items-center gap-1 p-3 text-xs font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Puissance</span>
              <span className="sm:hidden">Puis.</span>
            </TabsTrigger>
            <TabsTrigger value="time" className="flex flex-col items-center gap-1 p-3 text-xs font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Temps</span>
              <span className="sm:hidden">Temps</span>
            </TabsTrigger>
            <TabsTrigger value="currency" className="flex flex-col items-center gap-1 p-3 text-xs font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Devise</span>
              <span className="sm:hidden">Dev.</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex flex-col items-center gap-1 p-3 text-xs font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Données</span>
              <span className="sm:hidden">Data</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-6 space-y-6">
          <TabsContent value="length" className="mt-0">
            <ConversionCard
              title="Conversions de Longueur"
              icon={<Ruler className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
              inputValue={lengthState.inputValue}
              setInputValue={(value) => setLengthState(prev => ({ ...prev, inputValue: value }))}
              fromUnit={lengthState.fromUnit}
              setFromUnit={(unit) => setLengthState(prev => ({ ...prev, fromUnit: unit }))}
              toUnit={lengthState.toUnit}
              setToUnit={(unit) => setLengthState(prev => ({ ...prev, toUnit: unit }))}
              units={lengthUnits}
              convertFunction={convertLength}
              swapType="length"
              color="blue"
            />
          </TabsContent>

          <TabsContent value="weight" className="mt-0">
            <ConversionCard
              title="Conversions de Poids"
              icon={<Weight className="w-5 h-5 text-green-600 dark:text-green-400" />}
              inputValue={weightState.inputValue}
              setInputValue={(value) => setWeightState(prev => ({ ...prev, inputValue: value }))}
              fromUnit={weightState.fromUnit}
              setFromUnit={(unit) => setWeightState(prev => ({ ...prev, fromUnit: unit }))}
              toUnit={weightState.toUnit}
              setToUnit={(unit) => setWeightState(prev => ({ ...prev, toUnit: unit }))}
              units={weightUnits}
              convertFunction={convertWeight}
              swapType="weight"
              color="green"
            />
          </TabsContent>

          <TabsContent value="temperature" className="mt-0">
            <ConversionCard
              title="Conversions de Température"
              icon={<Thermometer className="w-5 h-5 text-red-600 dark:text-red-400" />}
              inputValue={tempState.inputValue}
              setInputValue={(value) => setTempState(prev => ({ ...prev, inputValue: value }))}
              fromUnit={tempState.fromUnit}
              setFromUnit={(unit) => setTempState(prev => ({ ...prev, fromUnit: unit }))}
              toUnit={tempState.toUnit}
              setToUnit={(unit) => setTempState(prev => ({ ...prev, toUnit: unit }))}
              units={temperatureUnits}
              convertFunction={convertTemp}
              swapType="temperature"
              color="red"
            />
          </TabsContent>

          <TabsContent value="volume" className="mt-0">
            <ConversionCard
              title="Conversions de Volume"
              icon={<Droplets className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />}
              inputValue={volumeState.inputValue}
              setInputValue={(value) => setVolumeState(prev => ({ ...prev, inputValue: value }))}
              fromUnit={volumeState.fromUnit}
              setFromUnit={(unit) => setVolumeState(prev => ({ ...prev, fromUnit: unit }))}
              toUnit={volumeState.toUnit}
              setToUnit={(unit) => setVolumeState(prev => ({ ...prev, toUnit: unit }))}
              units={volumeUnits}
              convertFunction={convertVolume}
              swapType="volume"
              color="cyan"
            />
          </TabsContent>

          <TabsContent value="area" className="mt-0">
            <ConversionCard
              title="Conversions de Surface"
              icon={<Square className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
              inputValue={areaState.inputValue}
              setInputValue={(value) => setAreaState(prev => ({ ...prev, inputValue: value }))}
              fromUnit={areaState.fromUnit}
              setFromUnit={(unit) => setAreaState(prev => ({ ...prev, fromUnit: unit }))}
              toUnit={areaState.toUnit}
              setToUnit={(unit) => setAreaState(prev => ({ ...prev, toUnit: unit }))}
              units={areaUnits}
              convertFunction={convertArea}
              swapType="area"
              color="purple"
            />
          </TabsContent>

          <TabsContent value="energy" className="mt-0">
            <ConversionCard
              title="Conversions d'Énergie"
              icon={<Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />}
              inputValue={energyState.inputValue}
              setInputValue={(value) => setEnergyState(prev => ({ ...prev, inputValue: value }))}
              fromUnit={energyState.fromUnit}
              setFromUnit={(unit) => setEnergyState(prev => ({ ...prev, fromUnit: unit }))}
              toUnit={energyState.toUnit}
              setToUnit={(unit) => setEnergyState(prev => ({ ...prev, toUnit: unit }))}
              units={energyUnits}
              convertFunction={convertEnergy}
              swapType="energy"
              color="yellow"
            />
          </TabsContent>

          <TabsContent value="speed" className="mt-0">
            <ConversionCard
              title="Conversions de Vitesse"
              icon={<Gauge className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
              inputValue={speedState.inputValue}
              setInputValue={(value) => setSpeedState(prev => ({ ...prev, inputValue: value }))}
              fromUnit={speedState.fromUnit}
              setFromUnit={(unit) => setSpeedState(prev => ({ ...prev, fromUnit: unit }))}
              toUnit={speedState.toUnit}
              setToUnit={(unit) => setSpeedState(prev => ({ ...prev, toUnit: unit }))}
              units={speedUnits}
              convertFunction={convertSpeed}
              swapType="speed"
              color="indigo"
            />
          </TabsContent>

          <TabsContent value="pressure" className="mt-0">
            <ConversionCard
              title="Conversions de Pression"
              icon={<Workflow className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
              inputValue={pressureState.inputValue}
              setInputValue={(value) => setPressureState(prev => ({ ...prev, inputValue: value }))}
              fromUnit={pressureState.fromUnit}
              setFromUnit={(unit) => setPressureState(prev => ({ ...prev, fromUnit: unit }))}
              toUnit={pressureState.toUnit}
              setToUnit={(unit) => setPressureState(prev => ({ ...prev, toUnit: unit }))}
              units={pressureUnits}
              convertFunction={convertPressure}
              swapType="pressure"
              color="teal"
            />
          </TabsContent>

          <TabsContent value="power" className="mt-0">
            <ConversionCard
              title="Conversions de Puissance"
              icon={<Calculator className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
              inputValue={powerState.inputValue}
              setInputValue={(value) => setPowerState(prev => ({ ...prev, inputValue: value }))}
              fromUnit={powerState.fromUnit}
              setFromUnit={(unit) => setPowerState(prev => ({ ...prev, fromUnit: unit }))}
              toUnit={powerState.toUnit}
              setToUnit={(unit) => setPowerState(prev => ({ ...prev, toUnit: unit }))}
              units={powerUnits}
              convertFunction={convertPower}
              swapType="power"
              color="orange"
            />
          </TabsContent>

          <TabsContent value="time" className="mt-0">
            <ConversionCard
              title="Conversions de Temps"
              icon={<Clock className="w-5 h-5 text-pink-600 dark:text-pink-400" />}
              inputValue={timeState.inputValue}
              setInputValue={(value) => setTimeState(prev => ({ ...prev, inputValue: value }))}
              fromUnit={timeState.fromUnit}
              setFromUnit={(unit) => setTimeState(prev => ({ ...prev, fromUnit: unit }))}
              toUnit={timeState.toUnit}
              setToUnit={(unit) => setTimeState(prev => ({ ...prev, toUnit: unit }))}
              units={timeUnits}
              convertFunction={convertTime}
              swapType="time"
              color="pink"
            />
          </TabsContent>

          <TabsContent value="currency" className="mt-0">
            <ConversionCard
              title="Conversions de Devises"
              icon={<DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
              inputValue={currencyState.inputValue}
              setInputValue={(value) => setCurrencyState(prev => ({ ...prev, inputValue: value }))}
              fromUnit={currencyState.fromUnit}
              setFromUnit={(unit) => setCurrencyState(prev => ({ ...prev, fromUnit: unit }))}
              toUnit={currencyState.toUnit}
              setToUnit={(unit) => setCurrencyState(prev => ({ ...prev, toUnit: unit }))}
              units={currencyUnits}
              convertFunction={convertCurrencyFn}
              swapType="currency"
              color="emerald"
            />
          </TabsContent>

          <TabsContent value="data" className="mt-0">
            <ConversionCard
              title="Conversions de Données"
              icon={<Database className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
              inputValue={dataState.inputValue}
              setInputValue={(value) => setDataState(prev => ({ ...prev, inputValue: value }))}
              fromUnit={dataState.fromUnit}
              setFromUnit={(unit) => setDataState(prev => ({ ...prev, fromUnit: unit }))}
              toUnit={dataState.toUnit}
              setToUnit={(unit) => setDataState(prev => ({ ...prev, toUnit: unit }))}
              units={dataUnits}
              convertFunction={convertData}
              swapType="data"
              color="slate"
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default UnitConverter;
