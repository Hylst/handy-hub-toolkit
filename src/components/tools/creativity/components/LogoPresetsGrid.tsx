
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoPreview } from './LogoPreview';
import { LogoPreset } from '../types/logoTypes';
import { presetLogos } from '../data/logoPresets';

interface LogoPresetsGridProps {
  onApplyPreset: (preset: LogoPreset) => void;
}

export const LogoPresetsGrid = ({ onApplyPreset }: LogoPresetsGridProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Styles prédéfinis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {presetLogos.map((preset, index) => (
            <div
              key={index}
              onClick={() => onApplyPreset(preset)}
              className="cursor-pointer group p-4 border rounded-lg hover:shadow-lg hover:border-blue-300 transition-all duration-200"
            >
              <LogoPreview 
                logo={preset.settings} 
                className="h-20 mb-3 group-hover:scale-105 transition-transform duration-200" 
              />
              <Badge variant="outline" className="w-full justify-center text-xs">
                {preset.name}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
