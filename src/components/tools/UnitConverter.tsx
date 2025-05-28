
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Thermometer, Weight, Ruler, Droplets, Zap, Gauge, Clock, Database, DollarSign, Square, Workflow } from "lucide-react";
import { ConversionTab } from './components/ConversionTab';
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

const UnitConverter = () => {
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
        {/* Fixed the sticky positioning issue by adjusting margins and z-index */}
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b pb-4 mb-6 -mx-4 px-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
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

        <div className="space-y-6">
          <TabsContent value="length" className="mt-0">
            <ConversionTab
              title="Conversions de Longueur"
              icon={<Ruler className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
              units={lengthUnits}
              defaultFromUnit="meter"
              defaultToUnit="kilometer"
              conversionType="length"
              color="blue"
            />
          </TabsContent>

          <TabsContent value="weight" className="mt-0">
            <ConversionTab
              title="Conversions de Poids"
              icon={<Weight className="w-5 h-5 text-green-600 dark:text-green-400" />}
              units={weightUnits}
              defaultFromUnit="kilogram"
              defaultToUnit="pound"
              conversionType="weight"
              color="green"
            />
          </TabsContent>

          <TabsContent value="temperature" className="mt-0">
            <ConversionTab
              title="Conversions de Température"
              icon={<Thermometer className="w-5 h-5 text-red-600 dark:text-red-400" />}
              units={temperatureUnits}
              defaultFromUnit="celsius"
              defaultToUnit="fahrenheit"
              conversionType="temperature"
              color="red"
            />
          </TabsContent>

          <TabsContent value="volume" className="mt-0">
            <ConversionTab
              title="Conversions de Volume"
              icon={<Droplets className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />}
              units={volumeUnits}
              defaultFromUnit="liter"
              defaultToUnit="gallon_us"
              conversionType="volume"
              color="cyan"
            />
          </TabsContent>

          <TabsContent value="area" className="mt-0">
            <ConversionTab
              title="Conversions de Surface"
              icon={<Square className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
              units={areaUnits}
              defaultFromUnit="square_meter"
              defaultToUnit="hectare"
              conversionType="area"
              color="purple"
            />
          </TabsContent>

          <TabsContent value="energy" className="mt-0">
            <ConversionTab
              title="Conversions d'Énergie"
              icon={<Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />}
              units={energyUnits}
              defaultFromUnit="joule"
              defaultToUnit="kilocalorie"
              conversionType="energy"
              color="yellow"
            />
          </TabsContent>

          <TabsContent value="speed" className="mt-0">
            <ConversionTab
              title="Conversions de Vitesse"
              icon={<Gauge className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
              units={speedUnits}
              defaultFromUnit="meter_per_second"
              defaultToUnit="kilometer_per_hour"
              conversionType="speed"
              color="indigo"
            />
          </TabsContent>

          <TabsContent value="pressure" className="mt-0">
            <ConversionTab
              title="Conversions de Pression"
              icon={<Workflow className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
              units={pressureUnits}
              defaultFromUnit="pascal"
              defaultToUnit="bar"
              conversionType="pressure"
              color="teal"
            />
          </TabsContent>

          <TabsContent value="power" className="mt-0">
            <ConversionTab
              title="Conversions de Puissance"
              icon={<Calculator className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
              units={powerUnits}
              defaultFromUnit="watt"
              defaultToUnit="horsepower"
              conversionType="power"
              color="orange"
            />
          </TabsContent>

          <TabsContent value="time" className="mt-0">
            <ConversionTab
              title="Conversions de Temps"
              icon={<Clock className="w-5 h-5 text-pink-600 dark:text-pink-400" />}
              units={timeUnits}
              defaultFromUnit="second"
              defaultToUnit="minute"
              conversionType="time"
              color="pink"
            />
          </TabsContent>

          <TabsContent value="currency" className="mt-0">
            <ConversionTab
              title="Conversions de Devises"
              icon={<DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
              units={currencyUnits}
              defaultFromUnit="eur"
              defaultToUnit="usd"
              conversionType="currency"
              color="emerald"
            />
          </TabsContent>

          <TabsContent value="data" className="mt-0">
            <ConversionTab
              title="Conversions de Données"
              icon={<Database className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
              units={dataUnits}
              defaultFromUnit="byte"
              defaultToUnit="kilobyte"
              conversionType="data"
              color="slate"
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default UnitConverter;
