
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const UnitConverter = () => {
  const [lengthValue, setLengthValue] = useState("");
  const [lengthFrom, setLengthFrom] = useState("meter");
  const [lengthTo, setLengthTo] = useState("kilometer");

  const lengthUnits = {
    meter: { name: "Mètre", factor: 1 },
    kilometer: { name: "Kilomètre", factor: 1000 },
    centimeter: { name: "Centimètre", factor: 0.01 },
    millimeter: { name: "Millimètre", factor: 0.001 },
    inch: { name: "Pouce", factor: 0.0254 },
    foot: { name: "Pied", factor: 0.3048 },
    yard: { name: "Yard", factor: 0.9144 },
    mile: { name: "Mile", factor: 1609.34 }
  };

  const convertLength = () => {
    if (!lengthValue) return "";
    const fromFactor = lengthUnits[lengthFrom as keyof typeof lengthUnits].factor;
    const toFactor = lengthUnits[lengthTo as keyof typeof lengthUnits].factor;
    const result = (parseFloat(lengthValue) * fromFactor) / toFactor;
    return result.toFixed(6).replace(/\.?0+$/, "");
  };

  const swapUnits = () => {
    const temp = lengthFrom;
    setLengthFrom(lengthTo);
    setLengthTo(temp);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="length" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="length">Longueurs</TabsTrigger>
          <TabsTrigger value="weight">Poids</TabsTrigger>
          <TabsTrigger value="temperature">Température</TabsTrigger>
          <TabsTrigger value="volume">Volume</TabsTrigger>
        </TabsList>
        
        <TabsContent value="length">
          <Card>
            <CardHeader>
              <CardTitle>Convertisseur de Longueurs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="text-sm font-medium mb-2 block">Valeur</label>
                  <Input
                    type="number"
                    placeholder="Entrez une valeur"
                    value={lengthValue}
                    onChange={(e) => setLengthValue(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">De</label>
                  <Select value={lengthFrom} onValueChange={setLengthFrom}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(lengthUnits).map(([key, unit]) => (
                        <SelectItem key={key} value={key}>{unit.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-center">
                  <Button variant="outline" size="sm" onClick={swapUnits}>
                    <ArrowRightLeft className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Vers</label>
                <Select value={lengthTo} onValueChange={setLengthTo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(lengthUnits).map(([key, unit]) => (
                      <SelectItem key={key} value={key}>{unit.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Résultat</p>
                <p className="text-2xl font-bold text-gray-800">
                  {convertLength()} {lengthUnits[lengthTo as keyof typeof lengthUnits].name.toLowerCase()}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="weight">
          <Card>
            <CardHeader>
              <CardTitle>Convertisseur de Poids</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Convertisseur de poids en cours de développement...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="temperature">
          <Card>
            <CardHeader>
              <CardTitle>Convertisseur de Température</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Convertisseur de température en cours de développement...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="volume">
          <Card>
            <CardHeader>
              <CardTitle>Convertisseur de Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Convertisseur de volume en cours de développement...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
