
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Download, Layers, Plus, Minus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface GradientStop {
  color: string;
  position: number;
}

interface Gradient {
  id: string;
  name: string;
  type: 'linear' | 'radial' | 'conic';
  angle: number;
  stops: GradientStop[];
  css: string;
}

export const GradientGenerator = () => {
  const [currentGradient, setCurrentGradient] = useState<Gradient>({
    id: '1',
    name: 'Dégradé par défaut',
    type: 'linear',
    angle: 45,
    stops: [
      { color: '#3B82F6', position: 0 },
      { color: '#8B5CF6', position: 100 }
    ],
    css: ''
  });
  const [gradientHistory, setGradientHistory] = useState<Gradient[]>([]);

  const presetGradients = [
    {
      name: "Coucher de soleil",
      type: 'linear' as const,
      angle: 135,
      stops: [
        { color: '#FF7E5F', position: 0 },
        { color: '#FEB47B', position: 100 }
      ]
    },
    {
      name: "Océan",
      type: 'linear' as const,
      angle: 180,
      stops: [
        { color: '#667eea', position: 0 },
        { color: '#764ba2', position: 100 }
      ]
    },
    {
      name: "Forêt",
      type: 'linear' as const,
      angle: 90,
      stops: [
        { color: '#56ab2f', position: 0 },
        { color: '#a8e6cf', position: 100 }
      ]
    },
    {
      name: "Aurora",
      type: 'linear' as const,
      angle: 45,
      stops: [
        { color: '#00c9ff', position: 0 },
        { color: '#92fe9d', position: 50 },
        { color: '#ff9a9e', position: 100 }
      ]
    },
    {
      name: "Galaxie",
      type: 'radial' as const,
      angle: 0,
      stops: [
        { color: '#0f0c29', position: 0 },
        { color: '#302b63', position: 50 },
        { color: '#24243e', position: 100 }
      ]
    },
    {
      name: "Arc-en-ciel",
      type: 'conic' as const,
      angle: 0,
      stops: [
        { color: '#ff0000', position: 0 },
        { color: '#ffff00', position: 16.66 },
        { color: '#00ff00', position: 33.33 },
        { color: '#00ffff', position: 50 },
        { color: '#0000ff', position: 66.66 },
        { color: '#ff00ff', position: 83.33 },
        { color: '#ff0000', position: 100 }
      ]
    }
  ];

  const generateRandomColor = () => {
    return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  };

  const generateCSS = (gradient: Gradient) => {
    const stopsString = gradient.stops
      .sort((a, b) => a.position - b.position)
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ');

    switch (gradient.type) {
      case 'linear':
        return `linear-gradient(${gradient.angle}deg, ${stopsString})`;
      case 'radial':
        return `radial-gradient(circle, ${stopsString})`;
      case 'conic':
        return `conic-gradient(from ${gradient.angle}deg, ${stopsString})`;
      default:
        return `linear-gradient(${gradient.angle}deg, ${stopsString})`;
    }
  };

  const updateGradient = (updates: Partial<Gradient>) => {
    const updated = { ...currentGradient, ...updates };
    updated.css = generateCSS(updated);
    setCurrentGradient(updated);
  };

  const addColorStop = () => {
    const newPosition = Math.random() * 100;
    const newColor = generateRandomColor();
    const newStops = [...currentGradient.stops, { color: newColor, position: newPosition }];
    updateGradient({ stops: newStops });
  };

  const removeColorStop = (index: number) => {
    if (currentGradient.stops.length <= 2) {
      toast({
        title: "Impossible de supprimer",
        description: "Un dégradé doit avoir au moins 2 couleurs.",
        variant: "destructive",
      });
      return;
    }
    const newStops = currentGradient.stops.filter((_, i) => i !== index);
    updateGradient({ stops: newStops });
  };

  const updateColorStop = (index: number, updates: Partial<GradientStop>) => {
    const newStops = currentGradient.stops.map((stop, i) => 
      i === index ? { ...stop, ...updates } : stop
    );
    updateGradient({ stops: newStops });
  };

  const generateRandomGradient = () => {
    const types: Array<'linear' | 'radial' | 'conic'> = ['linear', 'radial', 'conic'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomAngle = Math.floor(Math.random() * 360);
    const numStops = 2 + Math.floor(Math.random() * 3); // 2-4 stops
    
    const stops: GradientStop[] = [];
    for (let i = 0; i < numStops; i++) {
      stops.push({
        color: generateRandomColor(),
        position: (100 / (numStops - 1)) * i
      });
    }

    const newGradient: Gradient = {
      id: Date.now().toString(),
      name: `Dégradé ${randomType}`,
      type: randomType,
      angle: randomAngle,
      stops,
      css: ''
    };

    newGradient.css = generateCSS(newGradient);
    setCurrentGradient(newGradient);
    setGradientHistory(prev => [newGradient, ...prev.slice(0, 9)]);
  };

  const loadPreset = (preset: any) => {
    const newGradient: Gradient = {
      id: Date.now().toString(),
      name: preset.name,
      type: preset.type,
      angle: preset.angle,
      stops: preset.stops,
      css: ''
    };
    newGradient.css = generateCSS(newGradient);
    setCurrentGradient(newGradient);
    setGradientHistory(prev => [newGradient, ...prev.slice(0, 9)]);
  };

  const copyToClipboard = (format: 'css' | 'background' | 'url') => {
    let text = "";
    const css = generateCSS(currentGradient);
    
    switch (format) {
      case 'css':
        text = css;
        break;
      case 'background':
        text = `background: ${css};`;
        break;
      case 'url':
        text = `background-image: ${css};`;
        break;
    }

    navigator.clipboard.writeText(text);
    toast({
      title: "Dégradé copié !",
      description: `Format ${format.toUpperCase()} copié dans le presse-papiers.`,
    });
  };

  const exportGradient = () => {
    const data = {
      gradient: currentGradient,
      css: generateCSS(currentGradient),
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gradient-${currentGradient.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Export réussi !",
      description: "Votre dégradé a été exporté avec succès.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Aperçu principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Générateur de Dégradés Avancé
            </span>
            <div className="flex gap-2">
              <Button onClick={generateRandomGradient} size="sm" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Aléatoire
              </Button>
              <Button onClick={exportGradient} variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
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
                style={{ background: generateCSS(currentGradient) }}
              />
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">CSS</Label>
                <code className="text-sm font-mono break-all">{generateCSS(currentGradient)}</code>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button onClick={() => copyToClipboard('css')} variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-1" />
                  CSS
                </Button>
                <Button onClick={() => copyToClipboard('background')} variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-1" />
                  Background
                </Button>
                <Button onClick={() => copyToClipboard('url')} variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-1" />
                  Image
                </Button>
              </div>
            </div>

            {/* Contrôles */}
            <div className="space-y-6">
              {/* Type de dégradé */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Type de dégradé</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(['linear', 'radial', 'conic'] as const).map((type) => (
                    <Button
                      key={type}
                      onClick={() => updateGradient({ type })}
                      variant={currentGradient.type === type ? "default" : "outline"}
                      size="sm"
                      className="capitalize"
                    >
                      {type === 'linear' ? 'Linéaire' : type === 'radial' ? 'Radial' : 'Conique'}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Angle */}
              {currentGradient.type !== 'radial' && (
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Angle: {currentGradient.angle}°
                  </Label>
                  <Slider
                    value={[currentGradient.angle]}
                    onValueChange={([value]) => updateGradient({ angle: value })}
                    max={360}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}

              {/* Couleurs */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium">Couleurs ({currentGradient.stops.length})</Label>
                  <Button onClick={addColorStop} size="sm" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {currentGradient.stops.map((stop, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <input
                        type="color"
                        value={stop.color}
                        onChange={(e) => updateColorStop(index, { color: e.target.value })}
                        className="w-12 h-8 rounded border-2 border-gray-200 cursor-pointer"
                      />
                      <div className="flex-1">
                        <Label className="text-xs text-gray-500 mb-1 block">Position: {stop.position}%</Label>
                        <Slider
                          value={[stop.position]}
                          onValueChange={([value]) => updateColorStop(index, { position: value })}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <Button
                        onClick={() => removeColorStop(index)}
                        size="sm"
                        variant="outline"
                        disabled={currentGradient.stops.length <= 2}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Presets */}
      <Card>
        <CardHeader>
          <CardTitle>Dégradés prédéfinis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {presetGradients.map((preset, index) => (
              <div
                key={index}
                onClick={() => loadPreset(preset)}
                className="cursor-pointer group"
              >
                <div
                  className="w-full h-24 rounded-lg shadow-md group-hover:shadow-lg transition-shadow border-2 border-white"
                  style={{ background: generateCSS({ ...preset, css: '', id: '' } as Gradient) }}
                />
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium">{preset.name}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {preset.type === 'linear' ? 'Linéaire' : preset.type === 'radial' ? 'Radial' : 'Conique'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historique */}
      {gradientHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique récent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {gradientHistory.map((gradient) => (
                <div
                  key={gradient.id}
                  onClick={() => setCurrentGradient(gradient)}
                  className="cursor-pointer group"
                >
                  <div
                    className="w-full h-20 rounded-lg shadow-md group-hover:shadow-lg transition-shadow border-2 border-white"
                    style={{ background: gradient.css }}
                  />
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium truncate">{gradient.name}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {gradient.type === 'linear' ? 'Linéaire' : gradient.type === 'radial' ? 'Radial' : 'Conique'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
