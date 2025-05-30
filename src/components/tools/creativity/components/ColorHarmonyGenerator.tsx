
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ColorHarmony {
  name: string;
  colors: string[];
  description: string;
}

export const ColorHarmonyGenerator = () => {
  const [baseColor, setBaseColor] = useState("#3B82F6");
  const [harmonies, setHarmonies] = useState<ColorHarmony[]>([]);

  const generateHarmonies = () => {
    // Convertir hex en HSL
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

    // Convertir HSL en hex
    const hslToHex = (h: number, s: number, l: number) => {
      h = h % 360;
      s = s / 100;
      l = l / 100;

      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l - c / 2;
      let r = 0, g = 0, b = 0;

      if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
      } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
      } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
      } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
      } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
      } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
      }

      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);

      return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      }).join("");
    };

    const [h, s, l] = hexToHsl(baseColor);

    const newHarmonies: ColorHarmony[] = [
      {
        name: "Complémentaire",
        colors: [baseColor, hslToHex(h + 180, s, l)],
        description: "Couleurs opposées sur le cercle chromatique"
      },
      {
        name: "Analogue",
        colors: [
          hslToHex(h - 30, s, l),
          baseColor,
          hslToHex(h + 30, s, l)
        ],
        description: "Couleurs adjacentes sur le cercle chromatique"
      },
      {
        name: "Triade",
        colors: [
          baseColor,
          hslToHex(h + 120, s, l),
          hslToHex(h + 240, s, l)
        ],
        description: "Trois couleurs équidistantes"
      },
      {
        name: "Tétrade",
        colors: [
          baseColor,
          hslToHex(h + 90, s, l),
          hslToHex(h + 180, s, l),
          hslToHex(h + 270, s, l)
        ],
        description: "Quatre couleurs équidistantes"
      },
      {
        name: "Split-Complémentaire",
        colors: [
          baseColor,
          hslToHex(h + 150, s, l),
          hslToHex(h + 210, s, l)
        ],
        description: "Une couleur et les deux adjacentes à sa complémentaire"
      },
      {
        name: "Monochrome",
        colors: [
          hslToHex(h, s, Math.max(l - 40, 10)),
          hslToHex(h, s, Math.max(l - 20, 10)),
          baseColor,
          hslToHex(h, s, Math.min(l + 20, 90)),
          hslToHex(h, s, Math.min(l + 40, 90))
        ],
        description: "Variations de luminosité de la même teinte"
      }
    ];

    setHarmonies(newHarmonies);
    toast({
      title: "Harmonies générées !",
      description: `${newHarmonies.length} harmonies de couleurs créées.`,
    });
  };

  const copyPalette = (colors: string[]) => {
    const palette = colors.join(', ');
    navigator.clipboard.writeText(palette);
    toast({
      title: "Palette copiée !",
      description: "Les couleurs ont été copiées dans le presse-papiers.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Générateur d'Harmonies</span>
          <Button onClick={generateHarmonies} size="sm" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Générer
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Couleur de base */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Couleur de base</Label>
          <div className="flex gap-2">
            <input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="w-16 h-10 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="flex-1 p-2 border rounded-md font-mono text-sm"
              placeholder="#3B82F6"
            />
          </div>
        </div>

        {/* Harmonies générées */}
        {harmonies.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Harmonies de couleurs</h3>
            {harmonies.map((harmony, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{harmony.name}</h4>
                    <p className="text-xs text-gray-500">{harmony.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyPalette(harmony.colors)}
                    className="flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copier
                  </Button>
                </div>
                <div className="flex gap-2">
                  {harmony.colors.map((color, colorIndex) => (
                    <div key={colorIndex} className="flex-1 space-y-1">
                      <div
                        className="w-full h-12 rounded border-2 border-white shadow-sm cursor-pointer"
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          navigator.clipboard.writeText(color);
                          toast({
                            title: "Couleur copiée !",
                            description: `${color} copié.`,
                          });
                        }}
                        title={color}
                      />
                      <p className="text-xs font-mono text-center">{color}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {harmonies.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Cliquez sur "Générer" pour créer des harmonies de couleurs</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
