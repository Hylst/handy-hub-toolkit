
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Palette, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ExtractedColor {
  hex: string;
  count: number;
  percentage: number;
}

export const ColorPaletteExtractor = () => {
  const [image, setImage] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        extractColors(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractColors = (imageData: string) => {
    setIsExtracting(true);
    
    // Simuler l'extraction de couleurs (dans un vrai projet, on utiliserait une bibliothèque comme colorthief)
    setTimeout(() => {
      const mockColors: ExtractedColor[] = [
        { hex: "#3B82F6", count: 1500, percentage: 25.4 },
        { hex: "#EF4444", count: 1200, percentage: 20.3 },
        { hex: "#10B981", count: 980, percentage: 16.6 },
        { hex: "#F59E0B", count: 750, percentage: 12.7 },
        { hex: "#8B5CF6", count: 650, percentage: 11.0 },
        { hex: "#6B7280", count: 520, percentage: 8.8 },
        { hex: "#1F2937", count: 300, percentage: 5.1 }
      ];
      
      setExtractedColors(mockColors);
      setIsExtracting(false);
      
      toast({
        title: "Couleurs extraites !",
        description: `${mockColors.length} couleurs dominantes trouvées.`,
      });
    }, 1500);
  };

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    toast({
      title: "Couleur copiée !",
      description: `${hex} copié dans le presse-papiers.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Extracteur de Palette d'Image
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload d'image */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Charger une image</Label>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="flex-1"
            />
            <Button variant="outline" size="sm" disabled={!image}>
              <Upload className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Aperçu de l'image */}
        {image && (
          <div className="space-y-4">
            <div className="w-full h-48 rounded-lg overflow-hidden border">
              <img 
                src={image} 
                alt="Image uploadée" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* État d'extraction */}
            {isExtracting && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Extraction des couleurs en cours...</p>
              </div>
            )}

            {/* Couleurs extraites */}
            {extractedColors.length > 0 && !isExtracting && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Couleurs dominantes</h3>
                <div className="grid grid-cols-1 gap-2">
                  {extractedColors.map((color, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      onClick={() => copyColor(color.hex)}
                    >
                      <div
                        className="w-8 h-8 rounded border-2 border-white shadow-sm"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm">{color.hex}</span>
                          <span className="text-xs text-gray-500">{color.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${color.percentage}%` }}
                          />
                        </div>
                      </div>
                      <Copy className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    const colors = extractedColors.map(c => c.hex).join(', ');
                    navigator.clipboard.writeText(colors);
                    toast({
                      title: "Palette copiée !",
                      description: "Toute la palette a été copiée.",
                    });
                  }}
                  className="w-full"
                >
                  Copier toute la palette
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
