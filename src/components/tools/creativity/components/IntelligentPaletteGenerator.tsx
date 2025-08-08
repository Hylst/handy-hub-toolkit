import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  RefreshCw, 
  Copy, 
  Heart, 
  Download, 
  Pipette, 
  Sparkles,
  Share2,
  History,
  Star
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePaletteGeneration } from "../hooks/usePaletteGeneration";
import { PalettePresets } from "./PalettePresets";

export const IntelligentPaletteGenerator = () => {
  const {
    currentPalette,
    paletteHistory,
    favorites,
    paletteTypes,
    generatePalette,
    generateRandomPalette,
    toggleFavorite,
    copyPalette,
    setCurrentPalette
  } = usePaletteGeneration();

  const [baseColor, setBaseColor] = useState("#3B82F6");
  const [selectedType, setSelectedType] = useState<string>();
  const [inputColor, setInputColor] = useState("");

  const handleGeneratePalette = (typeId?: string) => {
    const type = paletteTypes.find(t => t.id === typeId) || paletteTypes[0];
    generatePalette(type, baseColor);
    setSelectedType(type.id);
    
    toast({
      title: "Palette générée !",
      description: `${type.name} créée avec succès.`,
    });
  };

  const handleRandomGeneration = () => {
    const palette = generateRandomPalette();
    const type = paletteTypes.find(t => t.id === palette.type);
    setSelectedType(type?.id);
    
    toast({
      title: "Palette aléatoire !",
      description: `${palette.name} générée automatiquement.`,
    });
  };

  const handleColorInput = () => {
    if (inputColor.match(/^#[0-9A-F]{6}$/i)) {
      setBaseColor(inputColor);
      setInputColor("");
      toast({
        title: "Couleur mise à jour",
        description: "Vous pouvez maintenant générer une palette.",
      });
    } else {
      toast({
        title: "Format invalide",
        description: "Veuillez entrer une couleur au format #RRGGBB",
        variant: "destructive",
      });
    }
  };

  const handleCopyPalette = (format: 'hex' | 'css' | 'scss' | 'json' = 'hex') => {
    if (!currentPalette) return;
    
    copyPalette(currentPalette, format);
    toast({
      title: "Palette copiée !",
      description: `Format ${format.toUpperCase()} copié dans le presse-papiers.`,
    });
  };

  const handleExportPalettes = () => {
    const data = {
      current: currentPalette,
      history: paletteHistory,
      favorites: favorites,
      exportDate: new Date().toISOString(),
      version: "1.0"
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palettes-intelligentes-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export réussi !",
      description: "Toutes vos palettes ont été exportées.",
    });
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec design moderne inspiré de l'image */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Générateur de Palettes Intelligentes
              </span>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleRandomGeneration} size="sm" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Aléatoire
              </Button>
              <Button onClick={handleExportPalettes} variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Cliquez sur un type de palette ou "Aléatoire" pour commencer
          </p>
          
          {/* Contrôle de couleur de base */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex-1">
              <Label className="text-sm font-medium mb-2 block">Couleur de base</Label>
              <div className="flex gap-2">
                <div
                  className="w-12 h-10 rounded-lg border-2 border-white shadow-md cursor-pointer"
                  style={{ backgroundColor: baseColor }}
                  onClick={() => document.getElementById('color-picker')?.click()}
                />
                <input
                  id="color-picker"
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="hidden"
                />
                <Input
                  placeholder="#3B82F6"
                  value={inputColor}
                  onChange={(e) => setInputColor(e.target.value)}
                  className="flex-1 font-mono"
                />
                <Button onClick={handleColorInput} size="sm" variant="outline">
                  <Pipette className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {selectedType && (
              <div className="flex-1">
                <Label className="text-sm font-medium mb-2 block">Type sélectionné</Label>
                <div className="flex gap-2">
                  <Badge variant="default" className="text-sm px-3 py-2">
                    {paletteTypes.find(t => t.id === selectedType)?.name}
                  </Badge>
                  <Button 
                    onClick={() => handleGeneratePalette(selectedType)} 
                    size="sm"
                    className="gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Générer ma première palette
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="palettes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="palettes" className="gap-2">
            <Palette className="w-4 h-4" />
            Palettes
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="w-4 h-4" />
            Historique ({paletteHistory.length})
          </TabsTrigger>
          <TabsTrigger value="favorites" className="gap-2">
            <Star className="w-4 h-4" />
            Favoris ({favorites.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="palettes" className="space-y-6">
          {/* Presets de palettes */}
          <PalettePresets 
            paletteTypes={paletteTypes}
            onSelectType={(type) => handleGeneratePalette(type.id)}
            selectedType={selectedType}
          />

          {/* Palette actuelle */}
          {currentPalette && (
            <Card className="border-2 border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{currentPalette.name}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {currentPalette.colors.length} couleurs
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => toggleFavorite(currentPalette)}
                      variant="outline"
                      size="sm"
                      className={favorites.some(fav => fav.id === currentPalette.id) ? "text-red-500" : ""}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="w-4 h-4" />
                      Partager
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Affichage de la palette */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 h-32 mb-4">
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
                      className="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-105"
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

                {/* Actions d'export */}
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={() => handleCopyPalette('hex')} variant="outline" size="sm">
                    Copier HEX
                  </Button>
                  <Button onClick={() => handleCopyPalette('css')} variant="outline" size="sm">
                    Copier CSS
                  </Button>
                  <Button onClick={() => handleCopyPalette('scss')} variant="outline" size="sm">
                    Copier SCSS
                  </Button>
                  <Button onClick={() => handleCopyPalette('json')} variant="outline" size="sm">
                    Copier JSON
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {paletteHistory.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucune palette dans l'historique</p>
              <p className="text-sm">Générez votre première palette pour la voir ici</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paletteHistory.map((palette) => (
                <Card 
                  key={palette.id}
                  onClick={() => setCurrentPalette(palette)}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="grid grid-cols-5 gap-1 h-16 rounded-lg overflow-hidden shadow-md mb-3">
                      {palette.colors.map((color, index) => (
                        <div
                          key={index}
                          style={{ backgroundColor: color }}
                          className="w-full h-full"
                        />
                      ))}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">{palette.name}</p>
                        <Badge variant="outline" className="text-xs">{palette.type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {palette.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          {favorites.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucune palette favorite</p>
              <p className="text-sm">Cliquez sur ❤️ pour ajouter des palettes à vos favoris</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((palette) => (
                <Card 
                  key={palette.id}
                  onClick={() => setCurrentPalette(palette)}
                  className="cursor-pointer hover:shadow-lg transition-shadow relative"
                >
                  <CardContent className="p-4">
                    <Heart className="absolute top-2 right-2 w-4 h-4 text-red-500 fill-red-500" />
                    <div className="grid grid-cols-5 gap-1 h-16 rounded-lg overflow-hidden shadow-md mb-3">
                      {palette.colors.map((color, index) => (
                        <div
                          key={index}
                          style={{ backgroundColor: color }}
                          className="w-full h-full"
                        />
                      ))}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">{palette.name}</p>
                        <Badge variant="outline" className="text-xs">{palette.type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {palette.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};