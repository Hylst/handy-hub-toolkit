import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ruler, Weight, Thermometer, Droplets, Square, Zap, Wind, Gauge, Clock, DollarSign, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConversionCard } from './components/ConversionCard';
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
import { 
  convertWithFactors, 
  convertTemperature, 
  convertCurrency, 
  sanitizeInput 
} from './utils/conversionUtils';

export const UnitConverterFixed = () => {
  // États pour chaque catégorie
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

  // Fonctions de conversion avec gestion d'input améliorée
  const convertLength = useCallback(() => 
    convertWithFactors(lengthInput, lengthFrom, lengthTo, lengthUnits),
    [lengthInput, lengthFrom, lengthTo]
  );

  const convertWeight = useCallback(() => 
    convertWithFactors(weightInput, weightFrom, weightTo, weightUnits),
    [weightInput, weightFrom, weightTo]
  );

  const convertTemp = useCallback(() => 
    convertTemperature(tempInput, tempFrom, tempTo),
    [tempInput, tempFrom, tempTo]
  );

  const convertVolume = useCallback(() => 
    convertWithFactors(volumeInput, volumeFrom, volumeTo, volumeUnits),
    [volumeInput, volumeFrom, volumeTo]
  );

  const convertArea = useCallback(() => 
    convertWithFactors(areaInput, areaFrom, areaTo, areaUnits),
    [areaInput, areaFrom, areaTo]
  );

  const convertEnergy = useCallback(() => 
    convertWithFactors(energyInput, energyFrom, energyTo, energyUnits),
    [energyInput, energyFrom, energyTo]
  );

  const convertSpeed = useCallback(() => 
    convertWithFactors(speedInput, speedFrom, speedTo, speedUnits),
    [speedInput, speedFrom, speedTo]
  );

  const convertPressure = useCallback(() => 
    convertWithFactors(pressureInput, pressureFrom, pressureTo, pressureUnits),
    [pressureInput, pressureFrom, pressureTo]
  );

  const convertPower = useCallback(() => 
    convertWithFactors(powerInput, powerFrom, powerTo, powerUnits),
    [powerInput, powerFrom, powerTo]
  );

  const convertTime = useCallback(() => 
    convertWithFactors(timeInput, timeFrom, timeTo, timeUnits),
    [timeInput, timeFrom, timeTo]
  );

  const convertCurr = useCallback(() => 
    convertCurrency(currencyInput, currencyFrom, currencyTo, currencyUnits),
    [currencyInput, currencyFrom, currencyTo]
  );

  const convertData = useCallback(() => 
    convertWithFactors(dataInput, dataFrom, dataTo, dataUnits),
    [dataInput, dataFrom, dataTo]
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl border-2 border-blue-200 dark:border-blue-800">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Convertisseur d'Unités Professionnel - Standards SI
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          12 catégories de conversion avec documentation technique précise selon les standards internationaux (SI), 
          précisions spécifiques et conditions d'utilisation détaillées.
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge variant="secondary">📐 Standards SI</Badge>
          <Badge variant="secondary">⚠️ Précisions techniques</Badge>
          <Badge variant="secondary">🔬 Définitions officielles</Badge>
          <Badge variant="secondary">🌍 Références internationales</Badge>
          <Badge variant="secondary">💡 Conseils pratiques</Badge>
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
            title="Convertisseur de Longueurs - Standards SI et Astronomiques"
            icon={<Ruler className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            inputValue={lengthInput}
            setInputValue={(value) => setLengthInput(sanitizeInput(value))}
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
            setInputValue={(value) => setWeightInput(sanitizeInput(value))}
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
            title="Convertisseur de Température - Échelles Scientifiques SI"
            icon={<Thermometer className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
            inputValue={tempInput}
            setInputValue={(value) => setTempInput(sanitizeInput(value))}
            fromUnit={tempFrom}
            setFromUnit={setTempFrom}
            toUnit={tempTo}
            setToUnit={setTempTo}
            units={temperatureUnits}
            convertFunction={convertTemp}
            swapType="temperature"
            color="orange"
          />
        </TabsContent>

        <TabsContent value="volume">
          <ConversionCard
            title="Convertisseur de Volume - Définitions SI et Culinaires"
            icon={<Droplets className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />}
            inputValue={volumeInput}
            setInputValue={(value) => setVolumeInput(sanitizeInput(value))}
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
            setInputValue={(value) => setAreaInput(sanitizeInput(value))}
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
            title="Convertisseur d'Énergie - Thermique, Électrique et Nutritionnel"
            icon={<Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />}
            inputValue={energyInput}
            setInputValue={(value) => setEnergyInput(sanitizeInput(value))}
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
            setInputValue={(value) => setSpeedInput(sanitizeInput(value))}
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
            setInputValue={(value) => setPressureInput(sanitizeInput(value))}
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
            setInputValue={(value) => setPowerInput(sanitizeInput(value))}
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
            setInputValue={(value) => setTimeInput(sanitizeInput(value))}
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
            setInputValue={(value) => setCurrencyInput(sanitizeInput(value))}
            fromUnit={currencyFrom}
            setFromUnit={setCurrencyFrom}
            toUnit={currencyTo}
            setToUnit={setCurrencyTo}
            units={currencyUnits}
            convertFunction={convertCurr}
            swapType="currency"
            color="emerald"
          />
        </TabsContent>

        <TabsContent value="data">
          <ConversionCard
            title="Convertisseur de Données Numériques - Standards Binaire/Décimal"
            icon={<TrendingUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
            inputValue={dataInput}
            setInputValue={(value) => setDataInput(sanitizeInput(value))}
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
