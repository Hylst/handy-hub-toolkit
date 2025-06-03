
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Scale, TrendingUp, Target, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BMICalculatorAdvancedProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const BMICalculatorAdvanced = ({ data, onDataChange }: BMICalculatorAdvancedProps) => {
  const [height, setHeight] = useState(data.height || '');
  const [weight, setWeight] = useState(data.weight || '');
  const [age, setAge] = useState(data.age || '');
  const [gender, setGender] = useState(data.gender || '');
  const [activityLevel, setActivityLevel] = useState(data.activityLevel || 'sedentary');
  const [bmi, setBmi] = useState<number | null>(data.bmi || null);
  const [bmr, setBmr] = useState<number | null>(data.bmr || null);
  const [idealWeight, setIdealWeight] = useState<any>(data.idealWeight || null);

  useEffect(() => {
    onDataChange({
      height,
      weight,
      age,
      gender,
      activityLevel,
      bmi,
      bmr,
      idealWeight,
      lastCalculated: bmi ? new Date().toISOString() : data.lastCalculated
    });
  }, [height, weight, age, gender, activityLevel, bmi, bmr, idealWeight]);

  const calculateBMI = () => {
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    
    if (heightInMeters > 0 && weightInKg > 0) {
      const bmiValue = weightInKg / (heightInMeters * heightInMeters);
      setBmi(parseFloat(bmiValue.toFixed(1)));
      
      // Calcul du métabolisme de base (BMR)
      if (age && gender) {
        let bmrValue;
        if (gender === 'male') {
          bmrValue = 88.362 + (13.397 * weightInKg) + (4.799 * parseFloat(height)) - (5.677 * parseFloat(age));
        } else {
          bmrValue = 447.593 + (9.247 * weightInKg) + (3.098 * parseFloat(height)) - (4.330 * parseFloat(age));
        }
        setBmr(Math.round(bmrValue));
      }

      // Calcul du poids idéal (formule de Lorentz)
      if (gender) {
        let idealWeightValue;
        if (gender === 'male') {
          idealWeightValue = parseFloat(height) - 100 - ((parseFloat(height) - 150) / 4);
        } else {
          idealWeightValue = parseFloat(height) - 100 - ((parseFloat(height) - 150) / 2.5);
        }
        setIdealWeight({
          weight: Math.round(idealWeightValue * 10) / 10,
          difference: Math.round((weightInKg - idealWeightValue) * 10) / 10
        });
      }

      toast({
        title: "Calcul effectué",
        description: `Votre IMC est de ${bmiValue.toFixed(1)}`,
      });
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 16) return { category: "Dénutrition sévère", color: "text-red-700", bgColor: "bg-red-100 dark:bg-red-950", progress: 10 };
    if (bmi < 17) return { category: "Dénutrition modérée", color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-950", progress: 20 };
    if (bmi < 18.5) return { category: "Insuffisance pondérale", color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-950", progress: 30 };
    if (bmi < 25) return { category: "Poids normal", color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-950", progress: 60 };
    if (bmi < 30) return { category: "Surpoids", color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-950", progress: 75 };
    if (bmi < 35) return { category: "Obésité modérée", color: "text-orange-700", bgColor: "bg-orange-100 dark:bg-orange-950", progress: 85 };
    if (bmi < 40) return { category: "Obésité sévère", color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-950", progress: 95 };
    return { category: "Obésité morbide", color: "text-red-700", bgColor: "bg-red-100 dark:bg-red-950", progress: 100 };
  };

  const getActivityMultiplier = () => {
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    return multipliers[activityLevel as keyof typeof multipliers] || 1.2;
  };

  const dailyCalories = bmr ? Math.round(bmr * getActivityMultiplier()) : null;

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Informations de base
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Taille (cm)</label>
              <Input
                type="number"
                placeholder="Ex: 175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Poids (kg)</label>
              <Input
                type="number"
                placeholder="Ex: 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Âge</label>
              <Input
                type="number"
                placeholder="Ex: 30"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Sexe</label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Homme</SelectItem>
                  <SelectItem value="female">Femme</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Niveau d'activité</label>
              <Select value={activityLevel} onValueChange={setActivityLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sédentaire</SelectItem>
                  <SelectItem value="light">Légère activité</SelectItem>
                  <SelectItem value="moderate">Activité modérée</SelectItem>
                  <SelectItem value="active">Très actif</SelectItem>
                  <SelectItem value="very_active">Extrêmement actif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={calculateBMI} 
              className="w-full bg-gradient-to-r from-green-600 to-blue-600"
              disabled={!height || !weight}
            >
              Calculer
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {bmi && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Résultats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`p-4 rounded-lg ${getBMICategory(bmi).bgColor}`}>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">{bmi}</p>
                  <p className={`text-sm font-semibold ${getBMICategory(bmi).color}`}>
                    {getBMICategory(bmi).category}
                  </p>
                  <Progress value={getBMICategory(bmi).progress} className="mt-2" />
                </div>
              </div>

              {bmr && (
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{bmr}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">BMR (kcal/jour)</div>
                </div>
              )}

              {dailyCalories && (
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">{dailyCalories}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Calories/jour</div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detailed Results */}
      {bmi && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* BMI Scale */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Échelle IMC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { range: "< 16", label: "Dénutrition sévère", color: "bg-red-600" },
                  { range: "16-17", label: "Dénutrition modérée", color: "bg-red-500" },
                  { range: "17-18.5", label: "Insuffisance pondérale", color: "bg-orange-500" },
                  { range: "18.5-25", label: "Poids normal", color: "bg-green-500" },
                  { range: "25-30", label: "Surpoids", color: "bg-yellow-500" },
                  { range: "30-35", label: "Obésité modérée", color: "bg-orange-600" },
                  { range: "35-40", label: "Obésité sévère", color: "bg-red-600" },
                  { range: "> 40", label: "Obésité morbide", color: "bg-red-700" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${item.color}`}></div>
                    <span className="text-xs font-medium w-16">{item.range}</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
                    {bmi >= parseFloat(item.range.split('-')[0] || item.range.replace('>', '').replace('<', '')) && 
                     bmi <= parseFloat(item.range.split('-')[1] || item.range.replace('>', '').replace('<', '')) && (
                      <Badge variant="outline" className="ml-auto">Vous</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4" />
                Informations complémentaires
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {idealWeight && (
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="text-sm font-medium mb-1">Poids idéal estimé</div>
                  <div className="text-lg font-bold text-green-600">{idealWeight.weight} kg</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {idealWeight.difference > 0 ? '+' : ''}{idealWeight.difference} kg par rapport à l'idéal
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  Ces calculs sont indicatifs. Consultez un professionnel de santé pour une évaluation personnalisée.
                </div>
              </div>

              {bmr && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Besoins caloriques quotidiens :</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Repos total: {bmr} kcal</div>
                    <div>Sédentaire: {Math.round(bmr * 1.2)} kcal</div>
                    <div>Légère activité: {Math.round(bmr * 1.375)} kcal</div>
                    <div>Activité modérée: {Math.round(bmr * 1.55)} kcal</div>
                    <div>Très actif: {Math.round(bmr * 1.725)} kcal</div>
                    <div>Extrêmement actif: {Math.round(bmr * 1.9)} kcal</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
