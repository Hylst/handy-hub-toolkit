
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Copy, RefreshCw, Download, Type, Palette } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TypographyStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
  letterSpacing: number;
  color: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration: 'none' | 'underline' | 'line-through';
  textShadow: string;
}

export const TypographyGenerator = () => {
  const [sampleText, setSampleText] = useState("Votre texte ici pour prévisualiser le style");
  const [currentStyle, setCurrentStyle] = useState<TypographyStyle>({
    fontFamily: "Inter, sans-serif",
    fontSize: 24,
    fontWeight: "400",
    lineHeight: 1.5,
    letterSpacing: 0,
    color: "#000000",
    textAlign: 'left',
    textTransform: 'none',
    textDecoration: 'none',
    textShadow: 'none'
  });

  const fontFamilies = [
    { name: "Inter", value: "Inter, sans-serif" },
    { name: "Roboto", value: "Roboto, sans-serif" },
    { name: "Open Sans", value: "'Open Sans', sans-serif" },
    { name: "Lato", value: "Lato, sans-serif" },
    { name: "Montserrat", value: "Montserrat, sans-serif" },
    { name: "Source Sans Pro", value: "'Source Sans Pro', sans-serif" },
    { name: "Ubuntu", value: "Ubuntu, sans-serif" },
    { name: "Raleway", value: "Raleway, sans-serif" },
    { name: "Poppins", value: "Poppins, sans-serif" },
    { name: "Nunito", value: "Nunito, sans-serif" },
    { name: "Playfair Display", value: "'Playfair Display', serif" },
    { name: "Merriweather", value: "Merriweather, serif" },
    { name: "Georgia", value: "Georgia, serif" },
    { name: "Times", value: "'Times New Roman', serif" },
    { name: "Fira Code", value: "'Fira Code', monospace" },
    { name: "Source Code Pro", value: "'Source Code Pro', monospace" },
    { name: "JetBrains Mono", value: "'JetBrains Mono', monospace" }
  ];

  const fontWeights = [
    { name: "Thin", value: "100" },
    { name: "Extra Light", value: "200" },
    { name: "Light", value: "300" },
    { name: "Regular", value: "400" },
    { name: "Medium", value: "500" },
    { name: "Semi Bold", value: "600" },
    { name: "Bold", value: "700" },
    { name: "Extra Bold", value: "800" },
    { name: "Black", value: "900" }
  ];

  const presetStyles = [
    {
      name: "Titre Principal",
      style: {
        fontSize: 48,
        fontWeight: "700",
        lineHeight: 1.2,
        letterSpacing: -1,
        textTransform: 'none' as const
      }
    },
    {
      name: "Sous-titre",
      style: {
        fontSize: 32,
        fontWeight: "600",
        lineHeight: 1.3,
        letterSpacing: -0.5,
        textTransform: 'none' as const
      }
    },
    {
      name: "Corps de texte",
      style: {
        fontSize: 16,
        fontWeight: "400",
        lineHeight: 1.6,
        letterSpacing: 0,
        textTransform: 'none' as const
      }
    },
    {
      name: "Citation",
      style: {
        fontSize: 20,
        fontWeight: "400",
        lineHeight: 1.8,
        letterSpacing: 0.5,
        textTransform: 'none' as const,
        fontFamily: "'Playfair Display', serif"
      }
    },
    {
      name: "Bouton",
      style: {
        fontSize: 14,
        fontWeight: "600",
        lineHeight: 1,
        letterSpacing: 1,
        textTransform: 'uppercase' as const
      }
    },
    {
      name: "Code",
      style: {
        fontSize: 14,
        fontWeight: "400",
        lineHeight: 1.5,
        letterSpacing: 0,
        fontFamily: "'Fira Code', monospace",
        textTransform: 'none' as const
      }
    }
  ];

  const generateRandomStyle = () => {
    const randomFont = fontFamilies[Math.floor(Math.random() * fontFamilies.length)];
    const randomWeight = fontWeights[Math.floor(Math.random() * fontWeights.length)];
    const randomColor = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    
    setCurrentStyle({
      ...currentStyle,
      fontFamily: randomFont.value,
      fontSize: 16 + Math.floor(Math.random() * 40),
      fontWeight: randomWeight.value,
      lineHeight: 1 + Math.random() * 1,
      letterSpacing: -2 + Math.random() * 4,
      color: randomColor
    });
  };

  const applyPreset = (preset: any) => {
    setCurrentStyle({
      ...currentStyle,
      ...preset.style
    });
  };

  const updateStyle = (updates: Partial<TypographyStyle>) => {
    setCurrentStyle({ ...currentStyle, ...updates });
  };

  const generateCSS = () => {
    return `font-family: ${currentStyle.fontFamily};
font-size: ${currentStyle.fontSize}px;
font-weight: ${currentStyle.fontWeight};
line-height: ${currentStyle.lineHeight};
letter-spacing: ${currentStyle.letterSpacing}px;
color: ${currentStyle.color};
text-align: ${currentStyle.textAlign};
text-transform: ${currentStyle.textTransform};
text-decoration: ${currentStyle.textDecoration};${currentStyle.textShadow !== 'none' ? `\ntext-shadow: ${currentStyle.textShadow};` : ''}`;
  };

  const copyCSS = () => {
    navigator.clipboard.writeText(generateCSS());
    toast({
      title: "CSS copié !",
      description: "Le style CSS a été copié dans le presse-papiers.",
    });
  };

  const exportStyle = () => {
    const data = {
      style: currentStyle,
      css: generateCSS(),
      sampleText,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'typography-style.json';
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Export réussi !",
      description: "Votre style typographique a été exporté avec succès.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Aperçu principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Type className="w-5 h-5" />
              Générateur de Typographie
            </span>
            <div className="flex gap-2">
              <Button onClick={generateRandomStyle} size="sm" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Aléatoire
              </Button>
              <Button onClick={exportStyle} variant="outline" size="sm" className="flex items-center gap-2">
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
              <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-700 min-h-48">
                <p
                  style={{
                    fontFamily: currentStyle.fontFamily,
                    fontSize: `${currentStyle.fontSize}px`,
                    fontWeight: currentStyle.fontWeight,
                    lineHeight: currentStyle.lineHeight,
                    letterSpacing: `${currentStyle.letterSpacing}px`,
                    color: currentStyle.color,
                    textAlign: currentStyle.textAlign,
                    textTransform: currentStyle.textTransform,
                    textDecoration: currentStyle.textDecoration,
                    textShadow: currentStyle.textShadow
                  }}
                >
                  {sampleText}
                </p>
              </div>

              <Textarea
                placeholder="Modifiez le texte de prévisualisation..."
                value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
                className="min-h-24"
              />

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs text-gray-500 uppercase tracking-wide">CSS</Label>
                  <Button onClick={copyCSS} size="sm" variant="outline">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <pre className="text-sm font-mono whitespace-pre-wrap overflow-auto">
                  {generateCSS()}
                </pre>
              </div>
            </div>

            {/* Contrôles */}
            <div className="space-y-6">
              {/* Police */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Police</Label>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                  {fontFamilies.map((font) => (
                    <Button
                      key={font.value}
                      onClick={() => updateStyle({ fontFamily: font.value })}
                      variant={currentStyle.fontFamily === font.value ? "default" : "outline"}
                      size="sm"
                      className="justify-start text-left"
                      style={{ fontFamily: font.value }}
                    >
                      {font.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Taille */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Taille: {currentStyle.fontSize}px
                </Label>
                <Slider
                  value={[currentStyle.fontSize]}
                  onValueChange={([value]) => updateStyle({ fontSize: value })}
                  min={8}
                  max={72}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Graisse */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Graisse</Label>
                <div className="grid grid-cols-3 gap-2">
                  {fontWeights.slice(0, 9).map((weight) => (
                    <Button
                      key={weight.value}
                      onClick={() => updateStyle({ fontWeight: weight.value })}
                      variant={currentStyle.fontWeight === weight.value ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                    >
                      {weight.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Hauteur de ligne */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Hauteur de ligne: {currentStyle.lineHeight.toFixed(1)}
                </Label>
                <Slider
                  value={[currentStyle.lineHeight]}
                  onValueChange={([value]) => updateStyle({ lineHeight: value })}
                  min={0.8}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Espacement des lettres */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Espacement: {currentStyle.letterSpacing}px
                </Label>
                <Slider
                  value={[currentStyle.letterSpacing]}
                  onValueChange={([value]) => updateStyle({ letterSpacing: value })}
                  min={-3}
                  max={5}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Couleur */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Couleur</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={currentStyle.color}
                    onChange={(e) => updateStyle({ color: e.target.value })}
                    className="w-16 h-10 rounded border-2 border-gray-200 cursor-pointer"
                  />
                  <Input
                    value={currentStyle.color}
                    onChange={(e) => updateStyle({ color: e.target.value })}
                    className="flex-1"
                    placeholder="#000000"
                  />
                </div>
              </div>

              {/* Alignement */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Alignement</Label>
                <div className="grid grid-cols-4 gap-2">
                  {(['left', 'center', 'right', 'justify'] as const).map((align) => (
                    <Button
                      key={align}
                      onClick={() => updateStyle({ textAlign: align })}
                      variant={currentStyle.textAlign === align ? "default" : "outline"}
                      size="sm"
                      className="capitalize"
                    >
                      {align === 'left' ? 'G' : align === 'center' ? 'C' : align === 'right' ? 'D' : 'J'}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Transformation */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Transformation</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(['none', 'uppercase', 'lowercase', 'capitalize'] as const).map((transform) => (
                    <Button
                      key={transform}
                      onClick={() => updateStyle({ textTransform: transform })}
                      variant={currentStyle.textTransform === transform ? "default" : "outline"}
                      size="sm"
                      className="text-xs capitalize"
                    >
                      {transform === 'none' ? 'Normal' : transform}
                    </Button>
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
          <CardTitle>Styles prédéfinis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {presetStyles.map((preset, index) => (
              <Button
                key={index}
                onClick={() => applyPreset(preset)}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start"
              >
                <Badge variant="secondary" className="mb-2 text-xs">
                  {preset.name}
                </Badge>
                <div className="text-left">
                  <p className="text-xs text-gray-500">
                    {preset.style.fontSize}px • {fontWeights.find(w => w.value === preset.style.fontWeight)?.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Line: {preset.style.lineHeight} • Letter: {preset.style.letterSpacing}
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
