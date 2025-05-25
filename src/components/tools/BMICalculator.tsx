
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const BMICalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBMI = () => {
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    
    if (heightInMeters > 0 && weightInKg > 0) {
      const bmiValue = weightInKg / (heightInMeters * heightInMeters);
      setBmi(parseFloat(bmiValue.toFixed(1)));
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Insuffisance pondérale", color: "text-blue-600" };
    if (bmi < 25) return { category: "Poids normal", color: "text-green-600" };
    if (bmi < 30) return { category: "Surpoids", color: "text-yellow-600" };
    return { category: "Obésité", color: "text-red-600" };
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Calculateur d'IMC</CardTitle>
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
        
        <Button 
          onClick={calculateBMI} 
          className="w-full bg-gradient-to-r from-blue-600 to-teal-600"
          disabled={!height || !weight}
        >
          Calculer l'IMC
        </Button>
        
        {bmi && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-800 mb-2">{bmi}</p>
              <p className={`text-lg font-semibold ${getBMICategory(bmi).color}`}>
                {getBMICategory(bmi).category}
              </p>
            </div>
            
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>• Insuffisance pondérale: &lt; 18.5</p>
              <p>• Poids normal: 18.5 - 24.9</p>
              <p>• Surpoids: 25 - 29.9</p>
              <p>• Obésité: ≥ 30</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
