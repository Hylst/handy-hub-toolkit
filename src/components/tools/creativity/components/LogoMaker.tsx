
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { LogoSettings, LogoPreset } from '../types/logoTypes';
import { LogoPreview } from './LogoPreview';
import { LogoControls } from './LogoControls';
import { LogoPresetsGrid } from './LogoPresetsGrid';
import { generateLogoSVG, downloadSVG, downloadPNG } from '../utils/svgGenerator';
import { fontFamilies, iconOptions, shapes, layouts } from '../data/logoPresets';

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

  const updateLogo = (updates: Partial<LogoSettings>) => {
    setLogo(prev => ({ ...prev, ...updates }));
  };

  const applyPreset = (preset: LogoPreset) => {
    setLogo(preset.settings);
    toast({
      title: "Preset appliqué !",
      description: `Le style "${preset.name}" a été appliqué avec succès.`,
    });
  };

  const generateRandomLogo = () => {
    const randomFont = fontFamilies[Math.floor(Math.random() * fontFamilies.length)];
    const randomIcon = iconOptions[Math.floor(Math.random() * iconOptions.length)];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    const randomLayout = layouts[Math.floor(Math.random() * layouts.length)];
    const randomColor1 = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    const randomColor2 = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    const randomColor3 = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    
    updateLogo({
      fontFamily: randomFont.value,
      icon: randomIcon,
      shape: randomShape.key,
      layout: randomLayout.key,
      textColor: randomColor1,
      iconColor: randomColor2,
      shapeColor: randomColor3,
      fontSize: 20 + Math.floor(Math.random() * 30),
      iconSize: 20 + Math.floor(Math.random() * 30),
      padding: 12 + Math.floor(Math.random() * 20)
    });

    toast({
      title: "Logo généré !",
      description: "Un nouveau logo aléatoire a été créé.",
    });
  };

  const handleDownloadSVG = () => {
    const svg = generateLogoSVG(logo);
    const filename = `logo-${logo.text.toLowerCase().replace(/\s+/g, '-')}.svg`;
    downloadSVG(svg, filename);
    toast({
      title: "Logo téléchargé !",
      description: "Votre logo SVG a été téléchargé avec succès.",
    });
  };

  const handleDownloadPNG = () => {
    const svg = generateLogoSVG(logo);
    const filename = `logo-${logo.text.toLowerCase().replace(/\s+/g, '-')}.png`;
    downloadPNG(svg, filename);
    toast({
      title: "Logo téléchargé !",
      description: "Votre logo PNG a été téléchargé avec succès.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Aperçu principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Créateur de Logo Avancé
            </span>
            <div className="flex gap-2">
              <Button onClick={generateRandomLogo} size="sm" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Aléatoire
              </Button>
              <Button onClick={handleDownloadSVG} variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                SVG
              </Button>
              <Button onClick={handleDownloadPNG} variant="outline" size="sm" className="flex items-center gap-2">
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
              <LogoPreview logo={logo} className="p-8 min-h-64" />
              
              {/* Informations du logo */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-500 block">Dimensions</span>
                  <span className="font-mono">Auto × Auto</span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-500 block">Format</span>
                  <span className="font-mono">SVG vectoriel</span>
                </div>
              </div>
            </div>

            {/* Contrôles */}
            <LogoControls logo={logo} onUpdate={updateLogo} />
          </div>
        </CardContent>
      </Card>

      {/* Logos prédéfinis */}
      <LogoPresetsGrid onApplyPreset={applyPreset} />
    </div>
  );
};
