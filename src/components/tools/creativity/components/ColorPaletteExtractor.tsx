import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Upload, Palette, Copy, Download, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ExtractedColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  count: number;
  percentage: number;
}

interface ExtractionPreset {
  id: string;
  name: string;
  description: string;
  tolerance: number;
  clustering: 'basic' | 'advanced' | 'kmeans';
  minSaturation: number;
}

interface BitReduction {
  r: number;
  g: number;
  b: number;
}

const EXTRACTION_PRESETS: ExtractionPreset[] = [
  {
    id: 'basic',
    name: 'Basique',
    description: 'Extraction rapide des couleurs principales',
    tolerance: 30,
    clustering: 'basic',
    minSaturation: 0.1
  },
  {
    id: 'detailed',
    name: 'Détaillé',
    description: 'Analyse approfondie avec plus de nuances',
    tolerance: 15,
    clustering: 'advanced',
    minSaturation: 0.05
  },
  {
    id: 'vibrant',
    name: 'Couleurs vives',
    description: 'Focus sur les couleurs saturées et vibrantes',
    tolerance: 25,
    clustering: 'kmeans',
    minSaturation: 0.3
  },
  {
    id: 'artistic',
    name: 'Artistique',
    description: 'Palette harmonieuse pour l\'art et le design',
    tolerance: 20,
    clustering: 'advanced',
    minSaturation: 0.2
  }
];

export const ColorPaletteExtractor = () => {
  const [image, setImage] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('basic');
  const [colorCount, setColorCount] = useState([8]);
  const [bitReduction, setBitReduction] = useState<BitReduction>({ r: 8, g: 8, b: 8 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const reduceBits = (value: number, bits: number): number => {
    const max = (1 << bits) - 1;
    const scale = 255 / max;
    return Math.round(Math.round(value / scale) * scale);
  };

  const applyBitReduction = (rgb: { r: number; g: number; b: number }): { r: number; g: number; b: number } => {
    return {
      r: reduceBits(rgb.r, bitReduction.r),
      g: reduceBits(rgb.g, bitReduction.g),
      b: reduceBits(rgb.b, bitReduction.b)
    };
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    
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
    
    return { h: h * 360, s, l };
  };

  const colorDistance = (rgb1: { r: number; g: number; b: number }, rgb2: { r: number; g: number; b: number }): number => {
    // Use perceptual color distance (weighted RGB)
    const dr = rgb1.r - rgb2.r;
    const dg = rgb1.g - rgb2.g;
    const db = rgb1.b - rgb2.b;
    return Math.sqrt(0.3 * dr * dr + 0.59 * dg * dg + 0.11 * db * db);
  };

  const kMeansCluster = (colors: { rgb: { r: number; g: number; b: number }; count: number }[], k: number): ExtractedColor[] => {
    if (colors.length <= k) return colors.map(c => ({ hex: rgbToHex(c.rgb.r, c.rgb.g, c.rgb.b), rgb: c.rgb, count: c.count, percentage: 0 }));

    // Initialize centroids randomly
    let centroids = colors.slice(0, k).map(c => ({ ...c.rgb }));
    
    for (let iter = 0; iter < 20; iter++) {
      const clusters: { rgb: { r: number; g: number; b: number }; count: number }[][] = Array(k).fill(null).map(() => []);
      
      // Assign colors to nearest centroid
      colors.forEach(color => {
        let minDist = Infinity;
        let clusterIndex = 0;
        
        centroids.forEach((centroid, i) => {
          const dist = colorDistance(color.rgb, centroid);
          if (dist < minDist) {
            minDist = dist;
            clusterIndex = i;
          }
        });
        
        clusters[clusterIndex].push(color);
      });
      
      // Update centroids
      const newCentroids = clusters.map(cluster => {
        if (cluster.length === 0) return centroids[0];
        
        const totalWeight = cluster.reduce((sum, c) => sum + c.count, 0);
        const r = cluster.reduce((sum, c) => sum + c.rgb.r * c.count, 0) / totalWeight;
        const g = cluster.reduce((sum, c) => sum + c.rgb.g * c.count, 0) / totalWeight;
        const b = cluster.reduce((sum, c) => sum + c.rgb.b * c.count, 0) / totalWeight;
        
        return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
      });
      
      centroids = newCentroids;
    }
    
    // Convert centroids to final colors with counts
    return centroids.map((centroid, i) => {
      const clusterColors = colors.filter(color => {
        let minDist = Infinity;
        let nearestCentroid = 0;
        centroids.forEach((c, idx) => {
          const dist = colorDistance(color.rgb, c);
          if (dist < minDist) {
            minDist = dist;
            nearestCentroid = idx;
          }
        });
        return nearestCentroid === i;
      });
      
      const totalCount = clusterColors.reduce((sum, c) => sum + c.count, 0);
      return {
        hex: rgbToHex(centroid.r, centroid.g, centroid.b),
        rgb: centroid,
        count: totalCount,
        percentage: 0
      };
    }).filter(c => c.count > 0);
  };

  const extractColorsFromImage = (imageData: string, preset: ExtractionPreset, maxColors: number): Promise<ExtractedColor[]> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          resolve([]);
          return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve([]);
          return;
        }

        // Set canvas size to image size for better quality
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const colorMap = new Map<string, { rgb: { r: number; g: number; b: number }; count: number }>();

        // Sample pixels (skip some for performance on large images)
        const step = Math.max(1, Math.floor(data.length / (4 * 15000))); // Sample ~15k pixels max
        
        for (let i = 0; i < data.length; i += 4 * step) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          // Skip transparent pixels
          if (a < 128) continue;

          // Apply bit reduction
          const reducedRgb = applyBitReduction({ r, g, b });
          
          // Filter by saturation if needed
          const hsl = rgbToHsl(reducedRgb.r, reducedRgb.g, reducedRgb.b);
          if (hsl.s < preset.minSaturation && hsl.l > 0.1 && hsl.l < 0.9) continue;

          const hex = rgbToHex(reducedRgb.r, reducedRgb.g, reducedRgb.b);
          const existing = colorMap.get(hex);
          
          if (existing) {
            existing.count++;
          } else {
            colorMap.set(hex, { rgb: reducedRgb, count: 1 });
          }
        }

        // Convert to array
        const colorArray = Array.from(colorMap.values());
        
        // Apply clustering based on preset
        let finalColors: ExtractedColor[];
        
        if (preset.clustering === 'kmeans' && colorArray.length > maxColors) {
          finalColors = kMeansCluster(colorArray, maxColors);
        } else if (preset.clustering === 'advanced') {
          // Remove very similar colors
          const filteredColors: typeof colorArray = [];
          const minDistance = preset.tolerance;
          
          colorArray.sort((a, b) => b.count - a.count);
          
          for (const color of colorArray) {
            const isSimilar = filteredColors.some(existing => 
              colorDistance(color.rgb, existing.rgb) < minDistance
            );
            
            if (!isSimilar) {
              filteredColors.push(color);
            }
          }
          
          finalColors = filteredColors
            .slice(0, maxColors)
            .map(c => ({
              hex: rgbToHex(c.rgb.r, c.rgb.g, c.rgb.b),
              rgb: c.rgb,
              count: c.count,
              percentage: 0
            }));
        } else {
          // Basic clustering - just sort by frequency
          finalColors = colorArray
            .sort((a, b) => b.count - a.count)
            .slice(0, maxColors)
            .map(c => ({
              hex: rgbToHex(c.rgb.r, c.rgb.g, c.rgb.b),
              rgb: c.rgb,
              count: c.count,
              percentage: 0
            }));
        }

        // Calculate percentages
        const totalCount = finalColors.reduce((sum, color) => sum + color.count, 0);
        finalColors.forEach(color => {
          color.percentage = Math.round((color.count / totalCount) * 100 * 10) / 10;
        });

        resolve(finalColors);
      };
      img.src = imageData;
    });
  };

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

  const extractColors = async (imageData: string) => {
    setIsExtracting(true);
    
    try {
      const preset = EXTRACTION_PRESETS.find(p => p.id === selectedPreset) || EXTRACTION_PRESETS[0];
      const colors = await extractColorsFromImage(imageData, preset, colorCount[0]);
      
      setExtractedColors(colors);
      
      toast({
        title: "Couleurs extraites !",
        description: `${colors.length} couleurs dominantes trouvées.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'extraire les couleurs de l'image.",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    toast({
      title: "Couleur copiée !",
      description: `${hex} copié dans le presse-papiers.`,
    });
  };

  const generatePixelArtRamp = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // Sort colors by HSL for better ramp organization
    const sortedColors = [...extractedColors].sort((a, b) => {
      const hslA = rgbToHsl(a.rgb.r, a.rgb.g, a.rgb.b);
      const hslB = rgbToHsl(b.rgb.r, b.rgb.g, b.rgb.b);
      
      // Sort by hue first, then lightness
      if (Math.abs(hslA.h - hslB.h) > 10) {
        return hslA.h - hslB.h;
      }
      return hslA.l - hslB.l;
    });
    
    // Calculate grid dimensions
    const colorsPerRow = Math.ceil(Math.sqrt(sortedColors.length));
    const rows = Math.ceil(sortedColors.length / colorsPerRow);
    
    // Each color square is 4x4 pixels
    const squareSize = 4;
    canvas.width = colorsPerRow * squareSize;
    canvas.height = rows * squareSize;
    
    // Draw color squares
    sortedColors.forEach((color, index) => {
      const row = Math.floor(index / colorsPerRow);
      const col = index % colorsPerRow;
      
      ctx.fillStyle = color.hex;
      ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
    });
    
    return canvas;
  };

  const exportPalette = (format: 'txt' | 'lst' | 'pixelart') => {
    if (extractedColors.length === 0) {
      toast({
        title: "Aucune couleur à exporter",
        description: "Veuillez d'abord extraire des couleurs.",
        variant: "destructive"
      });
      return;
    }

    if (format === 'pixelart') {
      const canvas = generatePixelArtRamp();
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'palette-pixelart.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          toast({
            title: "Rampe pixel art exportée !",
            description: "Fichier palette-pixelart.png téléchargé.",
          });
        }
      }, 'image/png');
      return;
    }

    let content = '';
    
    if (format === 'txt') {
      content = extractedColors.map(color => 
        `${color.hex} - RGB(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}) - ${color.percentage}%`
      ).join('\n');
    } else {
      content = extractedColors.map(color => 
        `DATA ${color.rgb.r},${color.rgb.g},${color.rgb.b}`
      ).join('\n');
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: `Palette exportée !`,
      description: `Fichier palette.${format} téléchargé.`,
    });
  };

  const reExtractColors = () => {
    if (image) {
      extractColors(image);
    }
  };

  return (
    <div className="space-y-6">
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
              <div className="w-full max-h-96 rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                <img 
                  src={image} 
                  alt="Image uploadée" 
                  className="max-w-full max-h-96 object-contain"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paramètres d'extraction */}
      {image && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Paramètres d'extraction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preset de détection */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Preset de détection</Label>
              <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXTRACTION_PRESETS.map(preset => (
                    <SelectItem key={preset.id} value={preset.id}>
                      <div>
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-xs text-muted-foreground">{preset.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Nombre de couleurs */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Nombre de couleurs: {colorCount[0]}
              </Label>
              <Slider
                value={colorCount}
                onValueChange={setColorCount}
                min={3}
                max={20}
                step={1}
                className="w-full"
              />
            </div>

            <Separator />

            {/* Réduction de bits */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Réduction de couleur (bits par composante)</Label>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Rouge: {bitReduction.r} bits</Label>
                  <Slider
                    value={[bitReduction.r]}
                    onValueChange={([value]) => setBitReduction(prev => ({ ...prev, r: value }))}
                    min={2}
                    max={8}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Vert: {bitReduction.g} bits</Label>
                  <Slider
                    value={[bitReduction.g]}
                    onValueChange={([value]) => setBitReduction(prev => ({ ...prev, g: value }))}
                    min={2}
                    max={8}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Bleu: {bitReduction.b} bits</Label>
                  <Slider
                    value={[bitReduction.b]}
                    onValueChange={([value]) => setBitReduction(prev => ({ ...prev, b: value }))}
                    min={2}
                    max={8}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Button re-extraction */}
            <Button 
              onClick={reExtractColors} 
              disabled={isExtracting} 
              className="w-full"
            >
              {isExtracting ? "Extraction en cours..." : "Re-extraire les couleurs"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Résultats */}
      {image && (
        <Card>
          <CardHeader>
            <CardTitle>Couleurs extraites</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* État d'extraction */}
            {isExtracting && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Extraction des couleurs en cours...</p>
              </div>
            )}

            {/* Couleurs extraites */}
            {extractedColors.length > 0 && !isExtracting && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  {extractedColors.map((color, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                      onClick={() => copyColor(color.hex)}
                    >
                      <div
                        className="w-10 h-10 rounded border-2 border-background shadow-sm"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-sm">{color.hex}</span>
                          <span className="text-xs text-muted-foreground">{color.percentage}%</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                        </div>
                        <div className="w-full bg-muted-foreground/20 rounded-full h-1.5 mt-2">
                          <div
                            className="bg-primary h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${color.percentage}%` }}
                          />
                        </div>
                      </div>
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>

                {/* Aperçu de la rampe pixel art */}
                <div className="pt-4">
                  <Label className="text-sm font-medium mb-2 block">Aperçu rampe pixel art</Label>
                  <div className="p-4 bg-muted rounded-lg flex justify-center">
                    <canvas
                      ref={(canvas) => {
                        if (canvas && extractedColors.length > 0) {
                          const pixelArtCanvas = generatePixelArtRamp();
                          const ctx = canvas.getContext('2d');
                          if (ctx) {
                            // Scale up for better visibility (8x scale)
                            const scale = 8;
                            canvas.width = pixelArtCanvas.width * scale;
                            canvas.height = pixelArtCanvas.height * scale;
                            ctx.imageSmoothingEnabled = false;
                            ctx.drawImage(pixelArtCanvas, 0, 0, canvas.width, canvas.height);
                          }
                        }
                      }}
                      className="border border-border rounded max-w-full"
                    />
                  </div>
                </div>

                {/* Export buttons */}
                <div className="grid grid-cols-2 gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => exportPalette('txt')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export .TXT
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => exportPalette('lst')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export .LST
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => exportPalette('pixelart')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Pixel Art
                  </Button>
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
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copier tout
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};
