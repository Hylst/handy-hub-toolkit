
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Download, Image, Grid } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PatternSettings {
  type: 'dots' | 'stripes' | 'grid' | 'waves' | 'zigzag' | 'hexagon' | 'triangles' | 'circles';
  size: number;
  spacing: number;
  color1: string;
  color2: string;
  rotation: number;
  opacity: number;
}

export const PatternGenerator = () => {
  const [pattern, setPattern] = useState<PatternSettings>({
    type: 'dots',
    size: 20,
    spacing: 40,
    color1: '#3B82F6',
    color2: '#FFFFFF',
    rotation: 0,
    opacity: 100
  });

  const patternTypes = [
    { key: 'dots', name: 'Points', icon: '●' },
    { key: 'stripes', name: 'Rayures', icon: '||' },
    { key: 'grid', name: 'Grille', icon: '#' },
    { key: 'waves', name: 'Vagues', icon: '~' },
    { key: 'zigzag', name: 'Zigzag', icon: '/\\' },
    { key: 'hexagon', name: 'Hexagones', icon: '⬡' },
    { key: 'triangles', name: 'Triangles', icon: '△' },
    { key: 'circles', name: 'Cercles', icon: '○' }
  ];

  const presetPatterns = [
    {
      name: "Points bleus",
      settings: {
        type: 'dots' as const,
        size: 8,
        spacing: 24,
        color1: '#3B82F6',
        color2: '#FFFFFF',
        rotation: 0,
        opacity: 80
      }
    },
    {
      name: "Rayures grises",
      settings: {
        type: 'stripes' as const,
        size: 4,
        spacing: 16,
        color1: '#6B7280',
        color2: '#F3F4F6',
        rotation: 45,
        opacity: 100
      }
    },
    {
      name: "Grille fine",
      settings: {
        type: 'grid' as const,
        size: 1,
        spacing: 20,
        color1: '#E5E7EB',
        color2: '#FFFFFF',
        rotation: 0,
        opacity: 50
      }
    },
    {
      name: "Vagues océan",
      settings: {
        type: 'waves' as const,
        size: 30,
        spacing: 60,
        color1: '#0EA5E9',
        color2: '#E0F2FE',
        rotation: 0,
        opacity: 70
      }
    },
    {
      name: "Zigzag coloré",
      settings: {
        type: 'zigzag' as const,
        size: 15,
        spacing: 30,
        color1: '#EF4444',
        color2: '#FEF2F2',
        rotation: 0,
        opacity: 85
      }
    },
    {
      name: "Hexagones or",
      settings: {
        type: 'hexagon' as const,
        size: 25,
        spacing: 35,
        color1: '#F59E0B',
        color2: '#FFFBEB',
        rotation: 30,
        opacity: 90
      }
    }
  ];

  const generateRandomPattern = () => {
    const types = patternTypes.map(p => p.key) as PatternSettings['type'][];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomColor1 = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    const randomColor2 = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    
    setPattern({
      type: randomType,
      size: 10 + Math.floor(Math.random() * 40),
      spacing: 20 + Math.floor(Math.random() * 80),
      color1: randomColor1,
      color2: randomColor2,
      rotation: Math.floor(Math.random() * 360),
      opacity: 50 + Math.floor(Math.random() * 50)
    });
  };

  const updatePattern = (updates: Partial<PatternSettings>) => {
    setPattern(prev => ({ ...prev, ...updates }));
  };

  const applyPreset = (preset: typeof presetPatterns[0]) => {
    setPattern(preset.settings);
  };

  const generateSVGPattern = () => {
    const { type, size, spacing, color1, color2, rotation, opacity } = pattern;
    
    let patternContent = '';
    const patternId = `pattern-${type}-${Date.now()}`;
    
    switch (type) {
      case 'dots':
        patternContent = `
          <circle cx="${spacing/2}" cy="${spacing/2}" r="${size/2}" fill="${color1}" opacity="${opacity/100}"/>
        `;
        break;
      case 'stripes':
        patternContent = `
          <rect x="0" y="0" width="${size}" height="${spacing}" fill="${color1}" opacity="${opacity/100}"/>
        `;
        break;
      case 'grid':
        patternContent = `
          <rect x="0" y="0" width="${spacing}" height="${size}" fill="${color1}" opacity="${opacity/100}"/>
          <rect x="0" y="0" width="${size}" height="${spacing}" fill="${color1}" opacity="${opacity/100}"/>
        `;
        break;
      case 'waves':
        patternContent = `
          <path d="M0,${spacing/2} Q${spacing/4},${spacing/2-size/2} ${spacing/2},${spacing/2} T${spacing},${spacing/2}" 
                stroke="${color1}" stroke-width="${size/4}" fill="none" opacity="${opacity/100}"/>
        `;
        break;
      case 'zigzag':
        patternContent = `
          <path d="M0,${spacing/2} L${spacing/4},${spacing/2-size/2} L${spacing/2},${spacing/2} L${spacing*3/4},${spacing/2-size/2} L${spacing},${spacing/2}" 
                stroke="${color1}" stroke-width="${size/4}" fill="none" opacity="${opacity/100}"/>
        `;
        break;
      case 'hexagon':
        const hexPoints = [];
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = spacing/2 + (size/2) * Math.cos(angle);
          const y = spacing/2 + (size/2) * Math.sin(angle);
          hexPoints.push(`${x},${y}`);
        }
        patternContent = `
          <polygon points="${hexPoints.join(' ')}" fill="${color1}" opacity="${opacity/100}"/>
        `;
        break;
      case 'triangles':
        patternContent = `
          <polygon points="${spacing/2},${spacing/2-size/2} ${spacing/2-size/2},${spacing/2+size/2} ${spacing/2+size/2},${spacing/2+size/2}" 
                   fill="${color1}" opacity="${opacity/100}"/>
        `;
        break;
      case 'circles':
        patternContent = `
          <circle cx="${spacing/2}" cy="${spacing/2}" r="${size/2}" fill="none" 
                  stroke="${color1}" stroke-width="${size/8}" opacity="${opacity/100}"/>
        `;
        break;
    }

    return `
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="${patternId}" x="0" y="0" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse"
                   patternTransform="rotate(${rotation})">
            <rect width="${spacing}" height="${spacing}" fill="${color2}"/>
            ${patternContent}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#${patternId})"/>
      </svg>
    `;
  };

  const generateCSS = () => {
    const svgData = encodeURIComponent(generateSVGPattern().trim());
    return `background-image: url("data:image/svg+xml,${svgData}");`;
  };

  const copyToClipboard = (format: 'css' | 'svg') => {
    let text = "";
    if (format === 'css') {
      text = generateCSS();
    } else {
      text = generateSVGPattern();
    }

    navigator.clipboard.writeText(text);
    toast({
      title: "Pattern copié !",
      description: `Format ${format.toUpperCase()} copié dans le presse-papiers.`,
    });
  };

  const downloadSVG = () => {
    const svg = generateSVGPattern();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pattern-${pattern.type}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "SVG téléchargé !",
      description: "Le motif SVG a été téléchargé avec succès.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Aperçu principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Grid className="w-5 h-5" />
              Générateur de Motifs et Textures
            </span>
            <div className="flex gap-2">
              <Button onClick={generateRandomPattern} size="sm" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Aléatoire
              </Button>
              <Button onClick={downloadSVG} variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                SVG
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Aperçu */}
            <div className="space-y-4">
              <div 
                className="w-full h-64 rounded-lg shadow-lg border-4 border-white"
                dangerouslySetInnerHTML={{ __html: generateSVGPattern() }}
              />
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs text-gray-500 uppercase tracking-wide">CSS Background</Label>
                  <div className="flex gap-2">
                    <Button onClick={() => copyToClipboard('css')} size="sm" variant="outline">
                      <Copy className="w-4 h-4 mr-1" />
                      CSS
                    </Button>
                    <Button onClick={() => copyToClipboard('svg')} size="sm" variant="outline">
                      <Copy className="w-4 h-4 mr-1" />
                      SVG
                    </Button>
                  </div>
                </div>
                <code className="text-sm font-mono break-all">
                  {generateCSS()}
                </code>
              </div>
            </div>

            {/* Contrôles */}
            <div className="space-y-6">
              {/* Type de motif */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Type de motif</Label>
                <div className="grid grid-cols-2 gap-2">
                  {patternTypes.map((type) => (
                    <Button
                      key={type.key}
                      onClick={() => updatePattern({ type: type.key as PatternSettings['type'] })}
                      variant={pattern.type === type.key ? "default" : "outline"}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <span className="text-lg">{type.icon}</span>
                      <span className="text-xs">{type.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Taille */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Taille: {pattern.size}px
                </Label>
                <Slider
                  value={[pattern.size]}
                  onValueChange={([value]) => updatePattern({ size: value })}
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Espacement */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Espacement: {pattern.spacing}px
                </Label>
                <Slider
                  value={[pattern.spacing]}
                  onValueChange={([value]) => updatePattern({ spacing: value })}
                  min={10}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Couleurs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Couleur principale</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={pattern.color1}
                      onChange={(e) => updatePattern({ color1: e.target.value })}
                      className="w-12 h-10 rounded border-2 border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={pattern.color1}
                      onChange={(e) => updatePattern({ color1: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Couleur de fond</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={pattern.color2}
                      onChange={(e) => updatePattern({ color2: e.target.value })}
                      className="w-12 h-10 rounded border-2 border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={pattern.color2}
                      onChange={(e) => updatePattern({ color2: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Rotation */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Rotation: {pattern.rotation}°
                </Label>
                <Slider
                  value={[pattern.rotation]}
                  onValueChange={([value]) => updatePattern({ rotation: value })}
                  min={0}
                  max={360}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Opacité */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Opacité: {pattern.opacity}%
                </Label>
                <Slider
                  value={[pattern.opacity]}
                  onValueChange={([value]) => updatePattern({ opacity: value })}
                  min={10}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motifs prédéfinis */}
      <Card>
        <CardHeader>
          <CardTitle>Motifs prédéfinis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {presetPatterns.map((preset, index) => (
              <div
                key={index}
                onClick={() => applyPreset(preset)}
                className="cursor-pointer group"
              >
                <div 
                  className="w-full h-24 rounded-lg shadow-md group-hover:shadow-lg transition-shadow border-2 border-white"
                  dangerouslySetInnerHTML={{ 
                    __html: (() => {
                      const tempPattern = { ...pattern, ...preset.settings };
                      const svgContent = generateSVGPattern();
                      return svgContent.replace(/pattern-\w+-\d+/g, `preset-${index}`);
                    })()
                  }}
                />
                <div className="mt-2 text-center">
                  <Badge variant="outline" className="text-xs">
                    {preset.name}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
