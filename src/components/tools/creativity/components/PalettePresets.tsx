import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Thermometer, Brush, Eye } from "lucide-react";
import { PaletteType } from "../hooks/usePaletteGeneration";

interface PalettePresetsProps {
  paletteTypes: PaletteType[];
  onSelectType: (type: PaletteType) => void;
  selectedType?: string;
}

export const PalettePresets = ({ paletteTypes, onSelectType, selectedType }: PalettePresetsProps) => {
  const categoryConfig = {
    harmonic: {
      icon: Palette,
      label: "Harmoniques",
      color: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
    },
    temperature: {
      icon: Thermometer,
      label: "Température",
      color: "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800"
    },
    style: {
      icon: Brush,
      label: "Style",
      color: "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800"
    },
    accessibility: {
      icon: Eye,
      label: "Accessibilité",
      color: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
    }
  };

  const groupedTypes = paletteTypes.reduce((acc, type) => {
    if (!acc[type.category]) {
      acc[type.category] = [];
    }
    acc[type.category].push(type);
    return acc;
  }, {} as Record<string, PaletteType[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedTypes).map(([category, types]) => {
        const config = categoryConfig[category as keyof typeof categoryConfig];
        const Icon = config.icon;
        
        return (
          <div key={category} className={`p-4 rounded-xl border-2 ${config.color}`}>
            <div className="flex items-center gap-2 mb-4">
              <Icon className="w-5 h-5" />
              <h3 className="font-semibold text-lg">{config.label}</h3>
              <Badge variant="outline" className="text-xs">
                {types.length} options
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {types.map((type) => (
                <Button
                  key={type.id}
                  onClick={() => onSelectType(type)}
                  variant={selectedType === type.id ? "default" : "outline"}
                  className="h-auto p-4 text-left justify-start flex-col items-start gap-2 hover:scale-105 transition-transform"
                >
                  <div className="font-medium text-sm">{type.name}</div>
                  <div className="text-xs text-muted-foreground leading-tight">
                    {type.description}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};