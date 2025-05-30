
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Palette, Image, Type, Zap, Sparkles, Paintbrush, Camera, Layers } from "lucide-react";
import { ColorGeneratorAdvanced } from "./components/ColorGeneratorAdvanced";
import { PaletteGenerator } from "./components/PaletteGenerator";
import { GradientGenerator } from "./components/GradientGenerator";
import { TypographyGenerator } from "./components/TypographyGenerator";
import { ImageFilters } from "./components/ImageFilters";
import { PatternGenerator } from "./components/PatternGenerator";
import { LogoMaker } from "./components/LogoMaker";
import { IconGenerator } from "./components/IconGenerator";

export const CreativitySuiteAdvanced = () => {
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* En-tête responsive avec design moderne */}
      <div className="text-center space-y-4 p-4 lg:p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-950/50 dark:via-pink-950/50 dark:to-indigo-950/50 rounded-2xl border-2 border-purple-200 dark:border-purple-800 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4 mb-4">
          <div className="flex justify-center">
            <div className="p-3 lg:p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg animate-pulse">
              <Sparkles className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Suite Créativité Complète
            </h1>
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 mt-2">
              Tous vos outils de création et design en un seul endroit
            </p>
          </div>
        </div>
        
        <p className="text-sm lg:text-lg text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
          Créez des couleurs harmonieuses, générez des palettes tendance, créez des dégradés magnifiques, 
          explorez la typographie, appliquez des filtres à vos images et bien plus encore. 
          Une suite complète pour libérer votre créativité !
        </p>
        
        <div className="flex justify-center gap-2 lg:gap-3 flex-wrap">
          <Badge variant="secondary" className="text-xs lg:text-sm px-3 lg:px-4 py-2">
            <Palette className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            Couleurs avancées
          </Badge>
          <Badge variant="secondary" className="text-xs lg:text-sm px-3 lg:px-4 py-2">
            <Paintbrush className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            Palettes intelligentes
          </Badge>
          <Badge variant="secondary" className="text-xs lg:text-sm px-3 lg:px-4 py-2">
            <Layers className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            Dégradés dynamiques
          </Badge>
          <Badge variant="secondary" className="text-xs lg:text-sm px-3 lg:px-4 py-2">
            <Type className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            Typographie
          </Badge>
          <Badge variant="secondary" className="text-xs lg:text-sm px-3 lg:px-4 py-2">
            <Camera className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            Filtres image
          </Badge>
          <Badge variant="secondary" className="text-xs lg:text-sm px-3 lg:px-4 py-2">
            <Image className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            Motifs & textures
          </Badge>
          <Badge variant="secondary" className="text-xs lg:text-sm px-3 lg:px-4 py-2">
            <Zap className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            Export optimisé
          </Badge>
        </div>
      </div>

      {/* Navigation par onglets responsive */}
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 mb-4 lg:mb-8 h-auto">
          <TabsTrigger value="colors" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 lg:p-3">
            <Palette className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Couleurs</span>
          </TabsTrigger>
          <TabsTrigger value="palettes" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 lg:p-3">
            <Paintbrush className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Palettes</span>
          </TabsTrigger>
          <TabsTrigger value="gradients" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 lg:p-3">
            <Layers className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Dégradés</span>
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 lg:p-3">
            <Type className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Typo</span>
          </TabsTrigger>
          <TabsTrigger value="filters" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 lg:p-3">
            <Camera className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Filtres</span>
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 lg:p-3">
            <Image className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Motifs</span>
          </TabsTrigger>
          <TabsTrigger value="logos" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 lg:p-3">
            <Zap className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Logos</span>
          </TabsTrigger>
          <TabsTrigger value="icons" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 lg:p-3">
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm">Icônes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors">
          <ColorGeneratorAdvanced />
        </TabsContent>

        <TabsContent value="palettes">
          <PaletteGenerator />
        </TabsContent>

        <TabsContent value="gradients">
          <GradientGenerator />
        </TabsContent>

        <TabsContent value="typography">
          <TypographyGenerator />
        </TabsContent>

        <TabsContent value="filters">
          <ImageFilters />
        </TabsContent>

        <TabsContent value="patterns">
          <PatternGenerator />
        </TabsContent>

        <TabsContent value="logos">
          <LogoMaker />
        </TabsContent>

        <TabsContent value="icons">
          <IconGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
};
