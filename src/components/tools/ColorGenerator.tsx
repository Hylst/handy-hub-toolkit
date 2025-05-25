
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const ColorGenerator = () => {
  const [colors, setColors] = useState<string[]>([]);

  const generateRandomColor = () => {
    return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  };

  const generatePalette = () => {
    const newColors = Array.from({ length: 5 }, () => generateRandomColor());
    setColors(newColors);
  };

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    toast({
      title: "Couleur copiée !",
      description: `${color} a été copié dans le presse-papiers.`,
    });
  };

  const getContrastColor = (hexColor: string) => {
    // Convertir hex en RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculer la luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Générateur de Palettes de Couleurs
          <Button onClick={generatePalette} className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Générer</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {colors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              Cliquez sur "Générer" pour créer une palette de couleurs
            </p>
            <Button onClick={generatePalette} size="lg">
              Générer ma première palette
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  onClick={() => copyToClipboard(color)}
                >
                  <div
                    className="h-32 w-full flex items-center justify-center"
                    style={{ backgroundColor: color }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Copy 
                        className="w-6 h-6"
                        style={{ color: getContrastColor(color) }}
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-white">
                    <p className="text-sm font-mono text-center text-gray-800">
                      {color.toUpperCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center text-sm text-gray-600">
              💡 Cliquez sur une couleur pour copier son code hexadécimal
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
