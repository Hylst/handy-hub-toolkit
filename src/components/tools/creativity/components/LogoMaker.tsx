import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Download, RefreshCw, Zap, Type, Circle, Square, Triangle, Star, Heart, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface LogoSettings {
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  textColor: string;
  backgroundColor: string;
  shape: 'none' | 'circle' | 'square' | 'rounded' | 'hexagon';
  shapeColor: string;
  icon: string;
  iconSize: number;
  iconColor: string;
  layout: 'horizontal' | 'vertical' | 'icon-only' | 'text-only';
  padding: number;
  borderWidth: number;
  borderColor: string;
}

export const LogoMaker = () => {
  const [logo, setLogo] = useState<LogoSettings>({
    text: "Mon Logo",
    fontSize: 32,
    fontFamily: "Inter, sans-serif",
    fontWeight: "700",
    textColor: "#1F2937",
    backgroundColor: "#FFFFFF",
    shape: 'none',
    shapeColor: "#3B82F6",
    icon: "⭐",
    iconSize: 32,
    iconColor: "#3B82F6",
    layout: 'horizontal',
    padding: 20,
    borderWidth: 0,
    borderColor: "#E5E7EB"
  });

  const fontFamilies = [
    { name: "Inter", value: "Inter, sans-serif" },
    { name: "Roboto", value: "Roboto, sans-serif" },
    { name: "Montserrat", value: "Montserrat, sans-serif" },
    { name: "Poppins", value: "Poppins, sans-serif" },
    { name: "Playfair Display", value: "'Playfair Display', serif" },
    { name: "Source Code Pro", value: "'Source Code Pro', monospace" }
  ];

  const iconOptions = [
    "⭐", "💡", "🚀", "🔥", "⚡", "🌟", "💎", "🎯", "🏆", "🌈",
    "🎨", "📱", "💻", "🎵", "📧", "🔧", "⚙️", "🛡️", "🌍", "🌱",
    "☀️", "🌙", "🔵", "🟢", "🟡", "🟣", "🔴", "🟠", "⚫", "⚪"
  ];

  const shapes = [
    { key: 'none', name: 'Aucune', icon: '—' },
    { key: 'circle', name: 'Cercle', icon: '●' },
    { key: 'square', name: 'Carré', icon: '■' },
    { key: 'rounded', name: 'Arrondi', icon: '▢' },
    { key: 'hexagon', name: 'Hexagone', icon: '⬡' }
  ];

  const layouts = [
    { key: 'horizontal', name: 'Horizontal', icon: '↔' },
    { key: 'vertical', name: 'Vertical', icon: '↕' },
    { key: 'icon-only', name: 'Icône seule', icon: '●' },
    { key: 'text-only', name: 'Texte seul', icon: 'T' }
  ];

  const presetLogos: Array<{ name: string; settings: LogoSettings }> = [
    {
      name: "Tech Startup",
      settings: {
        text: "TechCorp",
        fontSize: 28,
        fontFamily: "Inter, sans-serif",
        fontWeight: "700",
        textColor: "#FFFFFF",
        backgroundColor: "#1F2937",
        shape: 'rounded' as const,
        shapeColor: "#3B82F6",
        icon: "🚀",
        iconSize: 28,
        iconColor: "#60A5FA",
        layout: 'horizontal' as const,
        padding: 16,
        borderWidth: 0,
        borderColor: "#E5E7EB"
      }
    },
    {
      name: "Creative Agency",
      settings: {
        text: "Creative",
        fontSize: 36,
        fontFamily: "'Playfair Display', serif",
        fontWeight: "400",
        textColor: "#EC4899",
        backgroundColor: "#FFFBEB",
        shape: 'circle' as const,
        shapeColor: "#F59E0B",
        icon: "🎨",
        iconSize: 32,
        iconColor: "#EC4899",
        layout: 'vertical' as const,
        padding: 24,
        borderWidth: 2,
        borderColor: "#F59E0B"
      }
    },
    {
      name: "Eco Brand",
      settings: {
        text: "EcoLife",
        fontSize: 30,
        fontFamily: "Montserrat, sans-serif",
        fontWeight: "600",
        textColor: "#065F46",
        backgroundColor: "#ECFDF5",
        shape: 'hexagon' as const,
        shapeColor: "#10B981",
        icon: "🌱",
        iconSize: 30,
        iconColor: "#059669",
        layout: 'horizontal' as const,
        padding: 20,
        borderWidth: 1,
        borderColor: "#10B981"
      }
    },
    {
      name: "Minimal",
      settings: {
        text: "Minimal",
        fontSize: 24,
        fontFamily: "Inter, sans-serif",
        fontWeight: "300",
        textColor: "#374151",
        backgroundColor: "#FFFFFF",
        shape: 'none' as const,
        shapeColor: "#000000",
        icon: "●",
        iconSize: 8,
        iconColor: "#000000",
        layout: 'horizontal' as const,
        padding: 12,
        borderWidth: 0,
        borderColor: "#E5E7EB"
      }
    }
  ];

  const updateLogo = (updates: Partial<LogoSettings>) => {
    setLogo(prev => ({ ...prev, ...updates }));
  };

  const applyPreset = (preset: typeof presetLogos[0]) => {
    setLogo(preset.settings);
  };

  const generateRandomLogo = () => {
    const randomFont = fontFamilies[Math.floor(Math.random() * fontFamilies.length)];
    const randomIcon = iconOptions[Math.floor(Math.random() * iconOptions.length)];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    const randomLayout = layouts[Math.floor(Math.random() * layouts.length)];
    const randomColor1 = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    const randomColor2 = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    
    updateLogo({
      fontFamily: randomFont.value,
      icon: randomIcon,
      shape: randomShape.key as LogoSettings['shape'],
      layout: randomLayout.key as LogoSettings['layout'],
      textColor: randomColor1,
      iconColor: randomColor2,
      fontSize: 20 + Math.floor(Math.random() * 30),
      iconSize: 20 + Math.floor(Math.random() * 30)
    });
  };

  const generateSVG = () => {
    const { text, fontSize, fontFamily, fontWeight, textColor, backgroundColor, 
            shape, shapeColor, icon, iconSize, iconColor, layout, padding, 
            borderWidth, borderColor } = logo;

    // Calculer les dimensions
    const textWidth = text.length * fontSize * 0.6;
    const hasIcon = layout !== 'text-only';
    const hasText = layout !== 'icon-only';
    
    let totalWidth, totalHeight;
    
    if (layout === 'horizontal') {
      totalWidth = (hasIcon ? iconSize : 0) + (hasText ? textWidth : 0) + 
                   (hasIcon && hasText ? padding * 0.5 : 0) + padding * 2;
      totalHeight = Math.max(hasIcon ? iconSize : 0, hasText ? fontSize : 0) + padding * 2;
    } else {
      totalWidth = Math.max(hasIcon ? iconSize : 0, hasText ? textWidth : 0) + padding * 2;
      totalHeight = (hasIcon ? iconSize : 0) + (hasText ? fontSize : 0) + 
                    (hasIcon && hasText ? padding * 0.5 : 0) + padding * 2;
    }

    // Générer le SVG
    let svgContent = `
      <svg width="${totalWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .logo-text { 
              font-family: ${fontFamily}; 
              font-size: ${fontSize}px; 
              font-weight: ${fontWeight}; 
              fill: ${textColor}; 
              text-anchor: middle; 
              dominant-baseline: central;
            }
            .logo-icon { 
              font-size: ${iconSize}px; 
              text-anchor: middle; 
              dominant-baseline: central;
            }
          </style>
        </defs>
    `;

    // Forme de fond
    if (shape !== 'none') {
      const shapeProps = `fill="${backgroundColor}" stroke="${borderWidth > 0 ? borderColor : 'none'}" stroke-width="${borderWidth}"`;
      
      switch (shape) {
        case 'circle':
          const radius = Math.min(totalWidth, totalHeight) / 2;
          svgContent += `<circle cx="${totalWidth/2}" cy="${totalHeight/2}" r="${radius}" ${shapeProps}/>`;
          break;
        case 'square':
          svgContent += `<rect x="0" y="0" width="${totalWidth}" height="${totalHeight}" ${shapeProps}/>`;
          break;
        case 'rounded':
          svgContent += `<rect x="0" y="0" width="${totalWidth}" height="${totalHeight}" rx="8" ry="8" ${shapeProps}/>`;
          break;
        case 'hexagon':
          const centerX = totalWidth / 2;
          const centerY = totalHeight / 2;
          const hexRadius = Math.min(totalWidth, totalHeight) / 2.2;
          const hexPoints = [];
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = centerX + hexRadius * Math.cos(angle);
            const y = centerY + hexRadius * Math.sin(angle);
            hexPoints.push(`${x},${y}`);
          }
          svgContent += `<polygon points="${hexPoints.join(' ')}" ${shapeProps}/>`;
          break;
      }
    } else {
      // Fond rectangulaire simple
      svgContent += `<rect x="0" y="0" width="${totalWidth}" height="${totalHeight}" fill="${backgroundColor}" stroke="${borderWidth > 0 ? borderColor : 'none'}" stroke-width="${borderWidth}"/>`;
    }

    // Positionnement du contenu
    let iconX = 0, iconY = 0, textX = 0, textY = 0;
    
    if (layout === 'horizontal') {
      if (hasIcon && hasText) {
        iconX = padding + iconSize / 2;
        iconY = totalHeight / 2;
        textX = iconX + iconSize / 2 + padding * 0.5 + textWidth / 2;
        textY = totalHeight / 2;
      } else if (hasIcon) {
        iconX = totalWidth / 2;
        iconY = totalHeight / 2;
      } else {
        textX = totalWidth / 2;
        textY = totalHeight / 2;
      }
    } else if (layout === 'vertical') {
      if (hasIcon && hasText) {
        iconX = totalWidth / 2;
        iconY = padding + iconSize / 2;
        textX = totalWidth / 2;
        textY = iconY + iconSize / 2 + padding * 0.5 + fontSize / 2;
      } else if (hasIcon) {
        iconX = totalWidth / 2;
        iconY = totalHeight / 2;
      } else {
        textX = totalWidth / 2;
        textY = totalHeight / 2;
      }
    } else if (layout === 'icon-only') {
      iconX = totalWidth / 2;
      iconY = totalHeight / 2;
    } else {
      textX = totalWidth / 2;
      textY = totalHeight / 2;
    }

    // Ajouter l'icône
    if (hasIcon) {
      svgContent += `<text x="${iconX}" y="${iconY}" class="logo-icon" fill="${iconColor}">${icon}</text>`;
    }

    // Ajouter le texte
    if (hasText) {
      svgContent += `<text x="${textX}" y="${textY}" class="logo-text">${text}</text>`;
    }

    svgContent += `</svg>`;
    return svgContent;
  };

  const downloadSVG = () => {
    const svg = generateSVG();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logo-${logo.text.toLowerCase().replace(/\s+/g, '-')}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Logo téléchargé !",
      description: "Votre logo SVG a été téléchargé avec succès.",
    });
  };

  const downloadPNG = () => {
    const svg = generateSVG();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width * 2; // 2x pour la qualité
      canvas.height = img.height * 2;
      ctx?.scale(2, 2);
      ctx?.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `logo-${logo.text.toLowerCase().replace(/\s+/g, '-')}.png`;
          a.click();
          URL.revokeObjectURL(url);
          toast({
            title: "Logo téléchargé !",
            description: "Votre logo PNG a été téléchargé avec succès.",
          });
        }
      }, 'image/png');
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svg);
  };

  return (
    <div className="space-y-6">
      {/* Aperçu principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Créateur de Logo Simplifié
            </span>
            <div className="flex gap-2">
              <Button onClick={generateRandomLogo} size="sm" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Aléatoire
              </Button>
              <Button onClick={downloadSVG} variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                SVG
              </Button>
              <Button onClick={downloadPNG} variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                PNG
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Aperçu */}
            <div className="space-y-4">
              <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg min-h-64">
                <div 
                  dangerouslySetInnerHTML={{ __html: generateSVG() }}
                  className="max-w-full max-h-full"
                />
              </div>

              {/* Texte du logo */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Texte du logo</Label>
                <Input
                  value={logo.text}
                  onChange={(e) => updateLogo({ text: e.target.value })}
                  placeholder="Mon Logo"
                  className="w-full"
                />
              </div>
            </div>

            {/* Contrôles */}
            <div className="space-y-6">
              {/* Disposition */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Disposition</Label>
                <div className="grid grid-cols-2 gap-2">
                  {layouts.map((layout) => (
                    <Button
                      key={layout.key}
                      onClick={() => updateLogo({ layout: layout.key as LogoSettings['layout'] })}
                      variant={logo.layout === layout.key ? "default" : "outline"}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <span>{layout.icon}</span>
                      <span className="text-xs">{layout.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Icône */}
              {logo.layout !== 'text-only' && (
                <div>
                  <Label className="text-sm font-medium mb-3 block">Icône</Label>
                  <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto mb-3">
                    {iconOptions.map((iconOption) => (
                      <Button
                        key={iconOption}
                        onClick={() => updateLogo({ icon: iconOption })}
                        variant={logo.icon === iconOption ? "default" : "outline"}
                        size="sm"
                        className="aspect-square p-1"
                      >
                        {iconOption}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label className="text-xs text-gray-500 mb-1 block">Taille: {logo.iconSize}px</Label>
                      <input
                        type="range"
                        min="16"
                        max="64"
                        value={logo.iconSize}
                        onChange={(e) => updateLogo({ iconSize: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Couleur</Label>
                      <input
                        type="color"
                        value={logo.iconColor}
                        onChange={(e) => updateLogo({ iconColor: e.target.value })}
                        className="w-12 h-8 rounded border cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Police et texte */}
              {logo.layout !== 'icon-only' && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Police</Label>
                    <select
                      value={logo.fontFamily}
                      onChange={(e) => updateLogo({ fontFamily: e.target.value })}
                      className="w-full p-2 border rounded-md text-sm"
                    >
                      {fontFamilies.map((font) => (
                        <option key={font.value} value={font.value}>
                          {font.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Taille: {logo.fontSize}px</Label>
                      <input
                        type="range"
                        min="12"
                        max="48"
                        value={logo.fontSize}
                        onChange={(e) => updateLogo({ fontSize: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Couleur</Label>
                      <input
                        type="color"
                        value={logo.textColor}
                        onChange={(e) => updateLogo({ textColor: e.target.value })}
                        className="w-full h-8 rounded border cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Graisse</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {['300', '400', '700'].map((weight) => (
                        <Button
                          key={weight}
                          onClick={() => updateLogo({ fontWeight: weight })}
                          variant={logo.fontWeight === weight ? "default" : "outline"}
                          size="sm"
                          className="text-xs"
                        >
                          {weight === '300' ? 'Light' : weight === '400' ? 'Normal' : 'Bold'}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Forme et couleurs */}
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Forme de fond</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {shapes.map((shape) => (
                      <Button
                        key={shape.key}
                        onClick={() => updateLogo({ shape: shape.key as LogoSettings['shape'] })}
                        variant={logo.shape === shape.key ? "default" : "outline"}
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <span>{shape.icon}</span>
                        <span className="text-xs">{shape.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Couleur de fond</Label>
                    <input
                      type="color"
                      value={logo.backgroundColor}
                      onChange={(e) => updateLogo({ backgroundColor: e.target.value })}
                      className="w-full h-8 rounded border cursor-pointer"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Couleur forme</Label>
                    <input
                      type="color"
                      value={logo.shapeColor}
                      onChange={(e) => updateLogo({ shapeColor: e.target.value })}
                      className="w-full h-8 rounded border cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Espacement: {logo.padding}px</Label>
                  <input
                    type="range"
                    min="8"
                    max="40"
                    value={logo.padding}
                    onChange={(e) => updateLogo({ padding: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logos prédéfinis */}
      <Card>
        <CardHeader>
          <CardTitle>Styles prédéfinis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {presetLogos.map((preset, index) => (
              <div
                key={index}
                onClick={() => applyPreset(preset)}
                className="cursor-pointer group p-4 border rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-center mb-3 h-20">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: (() => {
                        const tempLogo = { ...logo, ...preset.settings };
                        // Générer le SVG avec les paramètres du preset
                        return generateSVG().replace(/logo-\w+-\d+/g, `preset-${index}`);
                      })()
                    }}
                    className="max-w-full max-h-full"
                  />
                </div>
                <Badge variant="outline" className="w-full justify-center text-xs">
                  {preset.name}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
