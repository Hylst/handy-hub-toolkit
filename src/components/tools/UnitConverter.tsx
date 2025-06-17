
import React from "react";
import { Scale, Thermometer, DollarSign, Clock, Ruler, Weight, Zap, Fuel, Activity, Palette, Droplets, Volume } from "lucide-react";
import { ToolHeader } from "@/components/ui/tool-header";
import { ToolContainer } from "@/components/ui/tool-container";
import { ToolTabSystem } from "@/components/ui/tool-tab-system";
import { ConversionTab } from "./components/ConversionTab";
import { 
  lengthUnits, 
  weightUnits, 
  temperatureUnits, 
  volumeUnits, 
  areaUnits, 
  speedUnits, 
  pressureUnits, 
  energyUnits, 
  powerUnits, 
  currencyUnits, 
  timeUnits, 
  dataUnits 
} from "./data/unitDefinitions";

const UnitConverter = () => {
  const conversionTabs = [
    {
      id: "length",
      label: "Longueurs",
      icon: <Ruler className="w-4 h-4" />,
      badge: "13 unités",
      content: (
        <ConversionTab
          title="Convertisseur de Longueurs"
          icon={<Ruler className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
          units={lengthUnits}
          defaultFromUnit="meter"
          defaultToUnit="kilometer"
          conversionType="length"
          color="blue"
        />
      )
    },
    {
      id: "weight",
      label: "Poids",
      icon: <Weight className="w-4 h-4" />,
      badge: "11 unités",
      content: (
        <ConversionTab
          title="Convertisseur de Poids"
          icon={<Weight className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
          units={weightUnits}
          defaultFromUnit="kilogram"
          defaultToUnit="gram"
          conversionType="weight"
          color="emerald"
        />
      )
    },
    {
      id: "temperature",
      label: "Température",
      icon: <Thermometer className="w-4 h-4" />,
      badge: "5 unités",
      content: (
        <ConversionTab
          title="Convertisseur de Température"
          icon={<Thermometer className="w-6 h-6 text-red-600 dark:text-red-400" />}
          units={temperatureUnits}
          defaultFromUnit="celsius"
          defaultToUnit="fahrenheit"
          conversionType="temperature"
          color="red"
        />
      )
    },
    {
      id: "volume",
      label: "Volume",
      icon: <Volume className="w-4 h-4" />,
      badge: "14 unités",
      content: (
        <ConversionTab
          title="Convertisseur de Volume"
          icon={<Volume className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
          units={volumeUnits}
          defaultFromUnit="liter"
          defaultToUnit="milliliter"
          conversionType="volume"
          color="purple"
        />
      )
    },
    {
      id: "area",
      label: "Surface",
      icon: <Scale className="w-4 h-4" />,
      badge: "11 unités",
      content: (
        <ConversionTab
          title="Convertisseur de Surface"
          icon={<Scale className="w-6 h-6 text-teal-600 dark:text-teal-400" />}
          units={areaUnits}
          defaultFromUnit="squareMeter"
          defaultToUnit="squareKilometer"
          conversionType="area"
          color="teal"
        />
      )
    },
    {
      id: "speed",
      label: "Vitesse",
      icon: <Activity className="w-4 h-4" />,
      badge: "7 unités",
      content: (
        <ConversionTab
          title="Convertisseur de Vitesse"
          icon={<Activity className="w-6 h-6 text-orange-600 dark:text-orange-400" />}
          units={speedUnits}
          defaultFromUnit="meterPerSecond"
          defaultToUnit="kilometerPerHour"
          conversionType="speed"
          color="orange"
        />
      )
    },
    {
      id: "pressure",
      label: "Pression",
      icon: <Droplets className="w-4 h-4" />,
      badge: "10 unités",
      content: (
        <ConversionTab
          title="Convertisseur de Pression"
          icon={<Droplets className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />}
          units={pressureUnits}
          defaultFromUnit="pascal"
          defaultToUnit="bar"
          conversionType="pressure"
          color="cyan"
        />
      )
    },
    {
      id: "energy",
      label: "Énergie",
      icon: <Fuel className="w-4 h-4" />,
      badge: "11 unités",
      content: (
        <ConversionTab
          title="Convertisseur d'Énergie"
          icon={<Fuel className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
          units={energyUnits}
          defaultFromUnit="joule"
          defaultToUnit="kilowattHour"
          conversionType="energy"
          color="amber"
        />
      )
    },
    {
      id: "power",
      label: "Puissance",
      icon: <Zap className="w-4 h-4" />,
      badge: "8 unités",
      content: (
        <ConversionTab
          title="Convertisseur de Puissance"
          icon={<Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />}
          units={powerUnits}
          defaultFromUnit="watt"
          defaultToUnit="kilowatt"
          conversionType="power"
          color="yellow"
        />
      )
    },
    {
      id: "currency",
      label: "Devises",
      icon: <DollarSign className="w-4 h-4" />,
      badge: "12 devises",
      content: (
        <ConversionTab
          title="Convertisseur de Devises"
          icon={<DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />}
          units={currencyUnits}
          defaultFromUnit="eur"
          defaultToUnit="usd"
          conversionType="currency"
          color="green"
        />
      )
    },
    {
      id: "time",
      label: "Temps",
      icon: <Clock className="w-4 h-4" />,
      badge: "12 unités",
      content: (
        <ConversionTab
          title="Convertisseur de Temps"
          icon={<Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
          units={timeUnits}
          defaultFromUnit="second"
          defaultToUnit="minute"
          conversionType="time"
          color="indigo"
        />
      )
    },
    {
      id: "data",
      label: "Données",
      icon: <Palette className="w-4 h-4" />,
      badge: "12 unités",
      content: (
        <ConversionTab
          title="Convertisseur de Données"
          icon={<Palette className="w-6 h-6 text-pink-600 dark:text-pink-400" />}
          units={dataUnits}
          defaultFromUnit="byte"
          defaultToUnit="megabyte"
          conversionType="data"
          color="pink"
        />
      )
    }
  ];

  return (
    <ToolContainer variant="wide" spacing="lg">
      <div className="space-y-6">
        <ToolHeader
          title="Convertisseurs Universels"
          subtitle="12 types d'unités disponibles"
          description="Convertissez facilement entre différentes unités de mesure avec des explications détaillées et des standards internationaux. Interface optimisée avec saisie temps réel et notes explicatives complètes."
          icon={<Scale className="w-8 h-8" />}
          badges={["12 Types d'unités", "Standards SI", "Temps réel", "Notes explicatives", "Débounce optimisé"]}
          gradient="blue"
        />

        <ToolTabSystem
          tabs={conversionTabs}
          defaultTab="length"
          orientation="horizontal"
          size="md"
          className="w-full"
          tabsListClassName="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
        />
      </div>
    </ToolContainer>
  );
};

export default UnitConverter;

