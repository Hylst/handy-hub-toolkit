import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, RefreshCw, Heart, Download, Palette, Pipette } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ColorPaletteExtractor } from "./ColorPaletteExtractor";
import { ColorHarmonyGenerator } from "./ColorHarmonyGenerator";
import { IntelligentPaletteGenerator } from "./IntelligentPaletteGenerator";

interface ColorInfo {
  hex: string;
  rgb: string;
  hsl: string;
  cmyk: string;
  name: string;
  isFavorite: boolean;
}

export const ColorGeneratorAdvanced = () => {
  const [currentColor, setCurrentColor] = useState("#3B82F6");
  const [colorHistory, setColorHistory] = useState<ColorInfo[]>([]);
  const [favorites, setFavorites] = useState<ColorInfo[]>([]);
  const [inputColor, setInputColor] = useState("");

  const generateRandomColor = () => {
    return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  };

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const hexToCmyk = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const k = 1 - Math.max(r, g, b);
    const c = k < 1 ? (1 - r - k) / (1 - k) : 0;
    const m = k < 1 ? (1 - g - k) / (1 - k) : 0;
    const y = k < 1 ? (1 - b - k) / (1 - k) : 0;

    return `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;
  };

  const getColorName = (hex: string) => {
    const colorNames: { [key: string]: string } = {
      "#FF0000": "Rouge",
      "#00FF00": "Vert",
      "#0000FF": "Bleu",
      "#FFFF00": "Jaune",
      "#FF00FF": "Magenta",
      "#00FFFF": "Cyan",
      "#000000": "Noir",
      "#FFFFFF": "Blanc",
    };
    return colorNames[hex.toUpperCase()] || "Couleur personnalisée";
  };

  const createColorInfo = (hex: string): ColorInfo => ({
    hex,
    rgb: hexToRgb(hex),
    hsl: hexToHsl(hex),
    cmyk: hexToCmyk(hex),
    name: getColorName(hex),
    isFavorite: false,
  });

  const generateNewColor = () => {
    const newColor = generateRandomColor();
    setCurrentColor(newColor);
    const colorInfo = createColorInfo(newColor);
    setColorHistory(prev => [colorInfo, ...prev.slice(0, 19)]);
  };

  const handleColorInput = () => {
    if (inputColor.match(/^#[0-9A-F]{6}$/i)) {
      setCurrentColor(inputColor);
      const colorInfo = createColorInfo(inputColor);
      setColorHistory(prev => [colorInfo, ...prev.slice(0, 19)]);
      setInputColor("");
    } else {
      toast({
        title: "Format invalide",
        description: "Veuillez entrer une couleur au format hexadécimal (ex: #FF5733)",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Couleur copiée !",
      description: `Format ${format} copié dans le presse-papiers.`,
    });
  };

  const toggleFavorite = (color: ColorInfo) => {
    if (favorites.some(fav => fav.hex === color.hex)) {
      setFavorites(prev => prev.filter(fav => fav.hex !== color.hex));
      toast({
        title: "Retiré des favoris",
        description: "Couleur retirée de vos favoris.",
      });
    } else {
      setFavorites(prev => [...prev, { ...color, isFavorite: true }]);
      toast({
        title: "Ajouté aux favoris",
        description: "Couleur ajoutée à vos favoris.",
      });
    }
  };

  const exportColors = () => {
    const data = {
      current: createColorInfo(currentColor),
      history: colorHistory,
      favorites: favorites,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'couleurs-export.json';
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Export réussi !",
      description: "Vos couleurs ont été exportées avec succès.",
    });
  };

  const currentColorInfo = createColorInfo(currentColor);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="generator">Générateur</TabsTrigger>
          <TabsTrigger value="palettes">Palettes</TabsTrigger>
          <TabsTrigger value="harmonies">Harmonies</TabsTrigger>
          <TabsTrigger value="extractor">Extracteur</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          {/* Générateur principal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Générateur de Couleurs
                </span>
                <div className="flex gap-2">
                  <Button onClick={generateNewColor} size="sm" className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Générer
                  </Button>
                  <Button onClick={exportColors} variant="outline" size="sm" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Couleur principale */}
                <div className="space-y-4">
                  <div
                    className="w-full h-48 rounded-lg shadow-lg border-4 border-white"
                    style={{ backgroundColor: currentColor }}
                  />
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="#FF5733"
                      value={inputColor}
                      onChange={(e) => setInputColor(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleColorInput} size="sm">
                      <Pipette className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => toggleFavorite(currentColorInfo)}
                      variant="outline"
                      size="sm"
                      className={favorites.some(fav => fav.hex === currentColor) ? "text-red-500" : ""}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>

                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                    className="w-full h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                </div>

                {/* Informations couleur */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: "HEX", value: currentColorInfo.hex },
                      { label: "RGB", value: currentColorInfo.rgb },
                      { label: "HSL", value: currentColorInfo.hsl },
                      { label: "CMYK", value: currentColorInfo.cmyk }
                    ].map((format) => (
                      <div
                        key={format.label}
                        onClick={() => copyToClipboard(format.value, format.label)}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Label className="text-xs text-gray-500 uppercase tracking-wide">{format.label}</Label>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm">{format.value}</span>
                          <Copy className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Label className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wide">Nom</Label>
                    <p className="text-sm font-medium">{currentColorInfo.name}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="palettes">
          <IntelligentPaletteGenerator />
        </TabsContent>

        <TabsContent value="harmonies">
          <ColorHarmonyGenerator />
        </TabsContent>

        <TabsContent value="extractor">
          <ColorPaletteExtractor />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recent">Historique ({colorHistory.length})</TabsTrigger>
              <TabsTrigger value="favorites">Favoris ({favorites.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="space-y-4">
              {colorHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucune couleur dans l'historique
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {colorHistory.map((color, index) => (
                    <div
                      key={index}
                      onClick={() => setCurrentColor(color.hex)}
                      className="aspect-square rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-shadow border-2 border-white"
                      style={{ backgroundColor: color.hex }}
                      title={`${color.hex} - ${color.name}`}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              {favorites.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucune couleur favorite
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {favorites.map((color, index) => (
                    <div
                      key={index}
                      onClick={() => setCurrentColor(color.hex)}
                      className="aspect-square rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-shadow border-2 border-white relative"
                      style={{ backgroundColor: color.hex }}
                      title={`${color.hex} - ${color.name}`}
                    >
                      <Heart className="absolute top-1 right-1 w-4 h-4 text-white fill-red-500" />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};
