
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Download, Palette, Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  category: string;
  isFavorite: boolean;
}

export const PaletteGenerator = () => {
  const [currentPalette, setCurrentPalette] = useState<ColorPalette | null>(null);
  const [paletteHistory, setPaletteHistory] = useState<ColorPalette[]>([]);
  const [favorites, setFavorites] = useState<ColorPalette[]>([]);

  const paletteCategories = {
    monochromatic: "Monochromatique",
    complementary: "Complémentaire",
    triadic: "Triadique",
    analogous: "Analogues",
    splitComplementary: "Complémentaire divisée",
    tetradic: "Tétradique",
    warm: "Couleurs chaudes",
    cool: "Couleurs froides",
    pastel: "Pastel",
    vibrant: "Vibrant",
    earth: "Tons terreux",
    neon: "Néon"
  };

  const generateColor = () => {
    return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
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

    return [h * 360, s * 100, l * 100];
  };

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const generateMonochromaticPalette = (baseColor: string) => {
    const [h, s, l] = hexToHsl(baseColor);
    return [
      hslToHex(h, s, Math.max(l - 30, 10)),
      hslToHex(h, s, Math.max(l - 15, 20)),
      baseColor,
      hslToHex(h, s, Math.min(l + 15, 80)),
      hslToHex(h, s, Math.min(l + 30, 90))
    ];
  };

  const generateComplementaryPalette = (baseColor: string) => {
    const [h, s, l] = hexToHsl(baseColor);
    const compH = (h + 180) % 360;
    return [
      hslToHex(h, s, l - 20),
      baseColor,
      hslToHex(h, s, l + 20),
      hslToHex(compH, s, l - 20),
      hslToHex(compH, s, l + 20)
    ];
  };

  const generateTriadicPalette = (baseColor: string) => {
    const [h, s, l] = hexToHsl(baseColor);
    return [
      baseColor,
      hslToHex((h + 120) % 360, s, l),
      hslToHex((h + 240) % 360, s, l),
      hslToHex(h, s * 0.7, l + 20),
      hslToHex((h + 60) % 360, s * 0.5, l + 10)
    ];
  };

  const generateAnalogousPalette = (baseColor: string) => {
    const [h, s, l] = hexToHsl(baseColor);
    return [
      hslToHex((h - 30 + 360) % 360, s, l),
      hslToHex((h - 15 + 360) % 360, s, l),
      baseColor,
      hslToHex((h + 15) % 360, s, l),
      hslToHex((h + 30) % 360, s, l)
    ];
  };

  const generatePaletteByCategory = (category: string): ColorPalette => {
    const baseColor = generateColor();
    let colors: string[] = [];
    let name = "";

    switch (category) {
      case "monochromatic":
        colors = generateMonochromaticPalette(baseColor);
        name = "Palette Monochromatique";
        break;
      case "complementary":
        colors = generateComplementaryPalette(baseColor);
        name = "Palette Complémentaire";
        break;
      case "triadic":
        colors = generateTriadicPalette(baseColor);
        name = "Palette Triadique";
        break;
      case "analogous":
        colors = generateAnalogousPalette(baseColor);
        name = "Palette Analogues";
        break;
      case "warm":
        colors = ["#FF6B35", "#F7931E", "#FFD23F", "#EE4B2B", "#FF8C42"];
        name = "Palette Chaude";
        break;
      case "cool":
        colors = ["#4A90E2", "#7ED321", "#50E3C2", "#B8E986", "#5AC8FA"];
        name = "Palette Froide";
        break;
      case "pastel":
        colors = ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF"];
        name = "Palette Pastel";
        break;
      case "vibrant":
        colors = ["#FF0080", "#FF8000", "#FFFF00", "#80FF00", "#0080FF"];
        name = "Palette Vibrante";
        break;
      case "earth":
        colors = ["#8B4513", "#D2691E", "#CD853F", "#DEB887", "#F5DEB3"];
        name = "Tons Terreux";
        break;
      case "neon":
        colors = ["#FF073A", "#39FF14", "#FF1493", "#00FFFF", "#FFFF00"];
        name = "Palette Néon";
        break;
      default:
        colors = [baseColor, generateColor(), generateColor(), generateColor(), generateColor()];
        name = "Palette Aléatoire";
    }

    return {
      id: Date.now().toString(),
      name,
      colors,
      category: paletteCategories[category as keyof typeof paletteCategories] || "Autre",
      isFavorite: false
    };
  };

  const generateRandomPalette = () => {
    const categories = Object.keys(paletteCategories);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const newPalette = generatePaletteByCategory(randomCategory);
    setCurrentPalette(newPalette);
    setPaletteHistory(prev => [newPalette, ...prev.slice(0, 19)]);
  };

  const generateSpecificPalette = (category: string) => {
    const newPalette = generatePaletteByCategory(category);
    setCurrentPalette(newPalette);
    setPaletteHistory(prev => [newPalette, ...prev.slice(0, 19)]);
  };

  const copyPalette = (format: 'hex' | 'css' | 'scss') => {
    if (!currentPalette) return;

    let text = "";
    switch (format) {
      case 'hex':
        text = currentPalette.colors.join(", ");
        break;
      case 'css':
        text = `:root {\n${currentPalette.colors.map((color, i) => `  --color-${i + 1}: ${color};`).join('\n')}\n}`;
        break;
      case 'scss':
        text = currentPalette.colors.map((color, i) => `$color-${i + 1}: ${color};`).join('\n');
        break;
    }

    navigator.clipboard.writeText(text);
    toast({
      title: "Palette copiée !",
      description: `Format ${format.toUpperCase()} copié dans le presse-papiers.`,
    });
  };

  const toggleFavorite = (palette: ColorPalette) => {
    if (favorites.some(fav => fav.id === palette.id)) {
      setFavorites(prev => prev.filter(fav => fav.id !== palette.id));
      toast({
        title: "Retiré des favoris",
        description: "Palette retirée de vos favoris.",
      });
    } else {
      setFavorites(prev => [...prev, { ...palette, isFavorite: true }]);
      toast({
        title: "Ajouté aux favoris",
        description: "Palette ajoutée à vos favoris.",
      });
    }
  };

  const exportPalettes = () => {
    const data = {
      current: currentPalette,
      history: paletteHistory,
      favorites: favorites,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'palettes-export.json';
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Export réussi !",
      description: "Vos palettes ont été exportées avec succès.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Contrôles principaux */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Générateur de Palettes Intelligentes
            </span>
            <div className="flex gap-2">
              <Button onClick={generateRandomPalette} size="sm" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Aléatoire
              </Button>
              <Button onClick={exportPalettes} variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Types de palettes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-6">
            {Object.entries(paletteCategories).map(([key, label]) => (
              <Button
                key={key}
                onClick={() => generateSpecificPalette(key)}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Palette actuelle */}
          {currentPalette && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{currentPalette.name}</h3>
                  <Badge variant="secondary">{currentPalette.category}</Badge>
                </div>
                <Button
                  onClick={() => toggleFavorite(currentPalette)}
                  variant="outline"
                  size="sm"
                  className={favorites.some(fav => fav.id === currentPalette.id) ? "text-red-500" : ""}
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 h-32">
                {currentPalette.colors.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      navigator.clipboard.writeText(color);
                      toast({
                        title: "Couleur copiée !",
                        description: `${color} copié dans le presse-papiers.`,
                      });
                    }}
                    className="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                    style={{ backgroundColor: color }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                        <Copy className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs font-mono">{color}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button onClick={() => copyPalette('hex')} variant="outline" size="sm">
                  Copier HEX
                </Button>
                <Button onClick={() => copyPalette('css')} variant="outline" size="sm">
                  Copier CSS
                </Button>
                <Button onClick={() => copyPalette('scss')} variant="outline" size="sm">
                  Copier SCSS
                </Button>
              </div>
            </div>
          )}

          {!currentPalette && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                Cliquez sur un type de palette ou "Aléatoire" pour commencer
              </p>
              <Button onClick={generateRandomPalette} size="lg">
                Générer ma première palette
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historique et favoris */}
      {(paletteHistory.length > 0 || favorites.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Historique et Favoris</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {paletteHistory.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Historique récent</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paletteHistory.slice(0, 6).map((palette) => (
                    <div
                      key={palette.id}
                      onClick={() => setCurrentPalette(palette)}
                      className="cursor-pointer group"
                    >
                      <div className="grid grid-cols-5 gap-1 h-16 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                        {palette.colors.map((color, index) => (
                          <div
                            key={index}
                            style={{ backgroundColor: color }}
                            className="w-full h-full"
                          />
                        ))}
                      </div>
                      <div className="mt-2 text-sm">
                        <p className="font-medium truncate">{palette.name}</p>
                        <Badge variant="outline" className="text-xs">{palette.category}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {favorites.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Favoris</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map((palette) => (
                    <div
                      key={palette.id}
                      onClick={() => setCurrentPalette(palette)}
                      className="cursor-pointer group relative"
                    >
                      <div className="grid grid-cols-5 gap-1 h-16 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                        {palette.colors.map((color, index) => (
                          <div
                            key={index}
                            style={{ backgroundColor: color }}
                            className="w-full h-full"
                          />
                        ))}
                      </div>
                      <Heart className="absolute top-1 right-1 w-4 h-4 text-white fill-red-500" />
                      <div className="mt-2 text-sm">
                        <p className="font-medium truncate">{palette.name}</p>
                        <Badge variant="outline" className="text-xs">{palette.category}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
