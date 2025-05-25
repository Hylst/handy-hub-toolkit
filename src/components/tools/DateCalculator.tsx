
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const DateCalculator = () => {
  const [birthDate, setBirthDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const calculateAge = () => {
    if (!birthDate) return null;
    
    const birth = new Date(birthDate);
    const today = new Date();
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    
    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    return { years, months, days };
  };

  const calculateDateDifference = () => {
    if (!startDate || !endDate) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30.44); // Moyenne approximative
    const diffYears = Math.floor(diffDays / 365.25); // Avec années bissextiles
    
    return { days: diffDays, weeks: diffWeeks, months: diffMonths, years: diffYears };
  };

  const age = calculateAge();
  const dateDiff = calculateDateDifference();

  return (
    <div className="max-w-2xl mx-auto">
      <Tabs defaultValue="age" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="age">Calculateur d'Âge</TabsTrigger>
          <TabsTrigger value="difference">Différence de Dates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="age">
          <Card>
            <CardHeader>
              <CardTitle>Calculateur d'Âge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date de naissance</label>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
              
              {age && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Votre âge :</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{age.years}</p>
                      <p className="text-sm text-gray-600">Années</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{age.months}</p>
                      <p className="text-sm text-gray-600">Mois</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{age.days}</p>
                      <p className="text-sm text-gray-600">Jours</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="difference">
          <Card>
            <CardHeader>
              <CardTitle>Calculateur de Différence entre Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date de début</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Date de fin</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              
              {dateDiff && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Différence :</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-xl font-bold text-teal-600">{dateDiff.days}</p>
                      <p className="text-sm text-gray-600">Jours</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-teal-600">{dateDiff.weeks}</p>
                      <p className="text-sm text-gray-600">Semaines</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-teal-600">{dateDiff.months}</p>
                      <p className="text-sm text-gray-600">Mois</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-teal-600">{dateDiff.years}</p>
                      <p className="text-sm text-gray-600">Années</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
