
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, Sparkles, Copy, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface IconSettings {
  size: number;
  color: string;
  backgroundColor: string;
  borderRadius: number;
  padding: number;
  shadow: boolean;
  stroke: number;
  style: 'filled' | 'outlined' | 'duotone';
}

export const IconGenerator = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("⭐");
  const [iconSettings, setIconSettings] = useState<IconSettings>({
    size: 32,
    color: "#3B82F6",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 8,
    shadow: false,
    stroke: 2,
    style: 'filled'
  });

  const iconCategories = {
    "Populaires": ["⭐", "❤️", "🔥", "💡", "🚀", "⚡", "🎯", "💎", "🏆", "🌟", "🎨", "📱"],
    "Interface": ["🏠", "⚙️", "📧", "📁", "🔍", "➕", "❌", "✅", "📊", "📈", "🔔", "👤"],
    "Technologie": ["💻", "📱", "⌨️", "🖥️", "📀", "💾", "🔧", "⚙️", "🔌", "📡", "🛡️", "🔒"],
    "Business": ["💼", "📊", "📈", "💰", "🏢", "📋", "📝", "📞", "📧", "🎯", "💳", "🏆"],
    "Social": ["👥", "👤", "💬", "📢", "👍", "❤️", "📸", "🎥", "🔗", "📤", "📥", "🔄"],
    "Temps": ["⏰", "📅", "⏳", "⏱️", "🕐", "📆", "⌛", "🔄", "⏮️", "⏭️", "⏸️", "▶️"],
    "Transport": ["🚗", "✈️", "🚢", "🚂", "🚌", "🚲", "🛸", "🚁", "🛴", "🏍️", "🚚", "🚛"],
    "Nature": ["🌱", "🌳", "🌸", "🌞", "🌙", "⭐", "🌈", "☀️", "🌊", "🔥", "❄️", "⚡"],
    "Nourriture": ["🍎", "🍕", "☕", "🍰", "🍔", "🍜", "🥗", "🍷", "🧊", "🍯", "🥖", "🧀"],
    "Sport": ["⚽", "🏀", "🎾", "🏈", "⚾", "🏐", "🏓", "🥊", "🏆", "🎖️", "🥇", "🏃"]
  };

  const allIcons = Object.values(iconCategories).flat();
  const filteredIcons = searchTerm 
    ? allIcons.filter(icon => icon.includes(searchTerm))
    : allIcons;

  const updateSettings = (updates: Partial<IconSettings>) => {
    setIconSettings(prev => ({ ...prev, ...updates }));
  };

  const generateRandomIcon = () => {
    const randomIcon = allIcons[Math.floor(Math.random() * allIcons.length)];
    const randomColor = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    const randomBgColor = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    
    setSelectedIcon(randomIcon);
    updateSettings({
      color: randomColor,
      backgroundColor: randomBgColor,
      size: 24 + Math.floor(Math.random() * 40),
      borderRadius: Math.floor(Math.random() * 20),
      padding: 4 + Math.floor(Math.random() * 20)
    });
  };

  const presetStyles = [
    {
      name: "Moderne",
      settings: {
        size: 32,
        color: "#3B82F6",
        backgroundColor: "#F0F7FF",
        borderRadius: 12,
        padding: 12,
        shadow: true,
        stroke: 2,
        style: 'filled' as const
      }
    },
    {
      name: "Minimal",
      settings: {
        size: 28,
        color: "#374151",
        backgroundColor: "#FFFFFF",
        borderRadius: 0,
        padding: 8,
        shadow: false,
        stroke: 1,
        style: 'outlined' as const
      }
    },
    {
      name: "Coloré",
      settings: {
        size: 36,
        color: "#FFFFFF",
        backgroundColor: "#EC4899",
        borderRadius: 20,
        padding: 16,
        shadow: true,
        stroke: 2,
        style: 'filled' as const
      }
    },
    {
      name: "Doux",
      settings: {
        size: 30,
        color: "#10B981",
        backgroundColor: "#ECFDF5",
        borderRadius: 16,
        padding: 14,
        shadow: false,
        stroke: 1.5,
        style: 'duotone' as const
      }
    }
  ];

  const generateSVG = () => {
    const { size, color, backgroundColor, borderRadius, padding, shadow } = iconSettings;
    const totalSize = size + padding * 2;
    
    let shadowFilter = '';
    if (shadow) {
      shadowFilter = `
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.1"/>
          </filter>
        </defs>
      `;
    }

    return `
      <svg width="${totalSize}" height="${totalSize}" xmlns="http://www.w3.org/2000/svg">
        ${shadowFilter}
        <rect 
          x="0" y="0" 
          width="${totalSize}" 
          height="${totalSize}" 
          rx="${borderRadius}" 
          fill="${backgroundColor}"
          ${shadow ? 'filter="url(#shadow)"' : ''}
        />
        <text 
          x="${totalSize/2}" 
          y="${totalSize/2}" 
          font-size="${size}px" 
          text-anchor="middle" 
          dominant-baseline="central"
          fill="${color}"
        >
          ${selectedIcon}
        </text>
      </svg>
    `;
  };

  const downloadSVG = () => {
    const svg = generateSVG();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `icon-${selectedIcon}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Icône téléchargée !",
      description: "Votre icône SVG a été téléchargée avec succès.",
    });
  };

  const downloadPNG = () => {
    const svg = generateSVG();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const scale = 4; // 4x pour la qualité
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx?.scale(scale, scale);
      ctx?.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `icon-${selectedIcon}.png`;
          a.click();
          URL.revokeObjectURL(url);
          toast({
            title: "Icône téléchargée !",
            description: "Votre icône PNG a été téléchargée avec succès.",
          });
        }
      }, 'image/png');
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svg);
  };

  const copyCSS = () => {
    const css = `background-image: url("data:image/svg+xml,${encodeURIComponent(generateSVG())}");`;
    navigator.clipboard.writeText(css);
    toast({
      title: "CSS copié !",
      description: "Le code CSS de l'icône a été copié dans le presse-papiers.",
    });
  };

  const applyPreset = (preset: typeof presetStyles[0]) => {
    updateSettings(preset.settings);
  };

  return (
    <div className="space-y-6">
      {/* Sélection d'icône */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Générateur d'Icônes Personnalisées
            </span>
            <div className="flex gap-2">
              <Button onClick={generateRandomIcon} size="sm" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Aléatoire
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Recherche */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher une icône..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sélection d'icônes */}
            <div>
              {searchTerm ? (
                <div>
                  <h4 className="font-medium mb-3">Résultats de recherche ({filteredIcons.length})</h4>
                  <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
                    {filteredIcons.map((icon, index) => (
                      <Button
                        key={index}
                        onClick={() => setSelectedIcon(icon)}
                        variant={selectedIcon === icon ? "default" : "outline"}
                        size="sm"
                        className="aspect-square p-1 text-lg"
                      >
                        {icon}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(iconCategories).map(([category, icons]) => (
                    <div key={category}>
                      <h4 className="font-medium mb-2 text-sm">{category}</h4>
                      <div className="grid grid-cols-8 gap-2">
                        {icons.map((icon, index) => (
                          <Button
                            key={index}
                            onClick={() => setSelectedIcon(icon)}
                            variant={selectedIcon === icon ? "default" : "outline"}
                            size="sm"
                            className="aspect-square p-1 text-lg"
                          >
                            {icon}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Aperçu et contrôles */}
            <div className="space-y-6">
              {/* Aperçu */}
              <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div 
                  dangerouslySetInnerHTML={{ __html: generateSVG() }}
                  className="max-w-full max-h-full"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                <Button onClick={downloadSVG} size="sm" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  SVG
                </Button>
                <Button onClick={downloadPNG} variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  PNG
                </Button>
                <Button onClick={copyCSS} variant="outline" size="sm" className="flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  CSS
                </Button>
              </div>

              {/* Contrôles */}
              <div className="space-y-4">
                {/* Taille */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Taille: {iconSettings.size}px
                  </Label>
                  <input
                    type="range"
                    min="16"
                    max="64"
                    value={iconSettings.size}
                    onChange={(e) => updateSettings({ size: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                {/* Couleurs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Couleur icône</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={iconSettings.color}
                        onChange={(e) => updateSettings({ color: e.target.value })}
                        className="w-12 h-10 rounded border cursor-pointer"
                      />
                      <Input
                        value={iconSettings.color}
                        onChange={(e) => updateSettings({ color: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Couleur fond</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={iconSettings.backgroundColor}
                        onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                        className="w-12 h-10 rounded border cursor-pointer"
                      />
                      <Input
                        value={iconSettings.backgroundColor}
                        onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Espacement et arrondi */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Espacement: {iconSettings.padding}px
                    </Label>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={iconSettings.padding}
                      onChange={(e) => updateSettings({ padding: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Arrondi: {iconSettings.borderRadius}px
                    </Label>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={iconSettings.borderRadius}
                      onChange={(e) => updateSettings({ borderRadius: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Ombre */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="shadow"
                    checked={iconSettings.shadow}
                    onChange={(e) => updateSettings({ shadow: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="shadow" className="text-sm font-medium">
                    Ajouter une ombre
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Styles prédéfinis */}
      <Card>
        <CardHeader>
          <CardTitle>Styles prédéfinis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {presetStyles.map((preset, index) => (
              <div
                key={index}
                onClick={() => applyPreset(preset)}
                className="cursor-pointer group p-4 border rounded-lg hover:shadow-lg transition-shadow text-center"
              >
                <div className="flex items-center justify-center mb-3 h-16">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: (() => {
                        const tempSettings = { ...iconSettings, ...preset.settings };
                        const { size, color, backgroundColor, borderRadius, padding, shadow } = tempSettings;
                        const totalSize = size + padding * 2;
                        
                        return `
                          <svg width="${totalSize}" height="${totalSize}" xmlns="http://www.w3.org/2000/svg">
                            ${shadow ? `
                              <defs>
                                <filter id="shadow-${index}" x="-20%" y="-20%" width="140%" height="140%">
                                  <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.1"/>
                                </filter>
                              </defs>
                            ` : ''}
                            <rect 
                              x="0" y="0" 
                              width="${totalSize}" 
                              height="${totalSize}" 
                              rx="${borderRadius}" 
                              fill="${backgroundColor}"
                              ${shadow ? `filter="url(#shadow-${index})"` : ''}
                            />
                            <text 
                              x="${totalSize/2}" 
                              y="${totalSize/2}" 
                              font-size="${size}px" 
                              text-anchor="middle" 
                              dominant-baseline="central"
                              fill="${color}"
                            >
                              ${selectedIcon}
                            </text>
                          </svg>
                        `;
                      })()
                    }}
                  />
                </div>
                <Badge variant="outline" className="text-xs">
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
