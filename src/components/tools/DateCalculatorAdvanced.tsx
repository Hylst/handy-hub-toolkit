
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Calculator, Clock, MapPin } from 'lucide-react';

// Import components
import DateCalculationTabEnhancedV2 from './dateCalculator/components/DateCalculationTabEnhancedV2';
import AgeCalculatorTabEnhanced from './dateCalculator/components/AgeCalculatorTabEnhanced';
import DateDifferenceTab from './dateCalculator/components/DateDifferenceTab';
import EventPlannerTabEnhanced from './dateCalculator/components/EventPlannerTabEnhanced';
import TimeZoneTab from './dateCalculator/components/TimeZoneTab';
import CalculationHistoryTab from './dateCalculator/components/CalculationHistoryTab';

const DateCalculatorAdvanced: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Suite Avancée de Dates & Temps
          </CardTitle>
          <p className="text-muted-foreground">
            Calculateur de dates complet avec planning d'événements, fuseaux horaires, et historique.
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calculations" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="calculations" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Calculs
              </TabsTrigger>
              <TabsTrigger value="age" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Âge
              </TabsTrigger>
              <TabsTrigger value="difference" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Différence
              </TabsTrigger>
              <TabsTrigger value="planning" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Planning
              </TabsTrigger>
              <TabsTrigger value="timezone" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Fuseaux
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Historique
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="calculations">
                <DateCalculationTabEnhancedV2 />
              </TabsContent>

              <TabsContent value="age">
                <AgeCalculatorTabEnhanced />
              </TabsContent>

              <TabsContent value="difference">
                <DateDifferenceTab />
              </TabsContent>

              <TabsContent value="planning">
                <EventPlannerTabEnhanced />
              </TabsContent>

              <TabsContent value="timezone">
                <TimeZoneTab />
              </TabsContent>

              <TabsContent value="history">
                <CalculationHistoryTab />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DateCalculatorAdvanced;
