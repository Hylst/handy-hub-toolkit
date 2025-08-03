
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { format } from "date-fns";
import { CalculationHistory } from "./CalculationHistory";

export const TimeZoneTab = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [calculationHistory] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeZones = [
    { name: "Europe/Paris", label: "Paris (CET)" },
    { name: "Europe/London", label: "Londres (GMT)" },
    { name: "America/New_York", label: "New York (EST)" },
    { name: "America/Los_Angeles", label: "Los Angeles (PST)" },
    { name: "Asia/Tokyo", label: "Tokyo (JST)" },
    { name: "Asia/Shanghai", label: "Shanghai (CST)" },
    { name: "Australia/Sydney", label: "Sydney (AEST)" },
    { name: "America/Sao_Paulo", label: "São Paulo (BRT)" }
  ];

  return (
    <Card className="shadow-lg border-2">
      <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50">
        <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
          <Globe className="w-5 h-5 lg:w-6 lg:h-6 text-teal-600" />
          Horloges Mondiales & Fuseaux Horaires
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 lg:space-y-6 p-4 lg:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {timeZones.slice(0, 6).map((tz) => (
            <div key={tz.name} className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/40 dark:to-cyan-900/40 rounded-xl border-2 border-teal-200 dark:border-teal-700 text-center">
              <h3 className="font-semibold text-base lg:text-lg text-teal-700 dark:text-teal-300 mb-2 truncate">
                {tz.label}
              </h3>
              <div className="text-xl lg:text-2xl font-mono text-gray-800 dark:text-gray-200">
                {format(currentTime, "HH:mm:ss")}
              </div>
              <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mt-1">
                {format(currentTime, "dd/MM/yyyy")}
              </div>
            </div>
          ))}
        </div>

        <CalculationHistory history={calculationHistory} />
      </CardContent>
    </Card>
  );
};
