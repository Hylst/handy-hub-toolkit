
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, RefreshCw, Camera, Image as ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  sepia: number;
  grayscale: number;
  invert: number;
  opacity: number;
}

export const ImageFilters = () => {
  const [image, setImage] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    sepia: 0,
    grayscale: 0,
    invert: 0,
    opacity: 100
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const presetFilters = [
    {
      name: "Original",
      filters: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        hue: 0,
        blur: 0,
        sepia: 0,
        grayscale: 0,
        invert: 0,
        opacity: 100
      }
    },
    {
      name: "Vintage",
      filters: {
        brightness: 110,
        contrast: 85,
        saturation: 80,
        hue: 15,
        blur: 0,
        sepia: 40,
        grayscale: 0,
        invert: 0,
        opacity: 100
      }
    },
    {
      name: "Noir & Blanc",
      filters: {
        brightness: 105,
        contrast: 110,
        saturation: 0,
        hue: 0,
        blur: 0,
        sepia: 0,
        grayscale: 100,
        invert: 0,
        opacity: 100
      }
    },
    {
      name: "Sépia",
      filters: {
        brightness: 105,
        contrast: 90,
        saturation: 80,
        hue: 0,
        blur: 0,
        sepia: 100,
        grayscale: 0,
        invert: 0,
        opacity: 100
      }
    },
    {
      name: "Éclatant",
      filters: {
        brightness: 110,
        contrast: 120,
        saturation: 150,
        hue: 0,
        blur: 0,
        sepia: 0,
        grayscale: 0,
        invert: 0,
        opacity: 100
      }
    },
    {
      name: "Doux",
      filters: {
        brightness: 110,
        contrast: 85,
        saturation: 90,
        hue: 5,
        blur: 1,
        sepia: 0,
        grayscale: 0,
        invert: 0,
        opacity: 95
      }
    },
    {
      name: "Dramatique",
      filters: {
        brightness: 95,
        contrast: 140,
        saturation: 110,
        hue: 0,
        blur: 0,
        sepia: 0,
        grayscale: 0,
        invert: 0,
        opacity: 100
      }
    },
    {
      name: "Froid",
      filters: {
        brightness: 100,
        contrast: 105,
        saturation: 90,
        hue: -20,
        blur: 0,
        sepia: 0,
        grayscale: 0,
        invert: 0,
        opacity: 100
      }
    },
    {
      name: "Chaud",
      filters: {
        brightness: 105,
        contrast: 95,
        saturation: 110,
        hue: 20,
        blur: 0,
        sepia: 20,
        grayscale: 0,
        invert: 0,
        opacity: 100
      }
    },
    {
      name: "Négatif",
      filters: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        hue: 0,
        blur: 0,
        sepia: 0,
        grayscale: 0,
        invert: 100,
        opacity: 100
      }
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        toast({
          title: "Image chargée !",
          description: "Vous pouvez maintenant appliquer des filtres.",
        });
      } else {
        toast({
          title: "Format non supporté",
          description: "Veuillez sélectionner un fichier image.",
          variant: "destructive",
        });
      }
    }
  };

  const updateFilter = (key: keyof FilterSettings, value: number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyPreset = (preset: typeof presetFilters[0]) => {
    setFilters(preset.filters);
  };

  const generateFilterCSS = () => {
    return `filter: brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) hue-rotate(${filters.hue}deg) blur(${filters.blur}px) sepia(${filters.sepia}%) grayscale(${filters.grayscale}%) invert(${filters.invert}%) opacity(${filters.opacity}%);`;
  };

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
      blur: 0,
      sepia: 0,
      grayscale: 0,
      invert: 0,
      opacity: 100
    });
  };

  const downloadImage = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Appliquer les filtres
      ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) hue-rotate(${filters.hue}deg) blur(${filters.blur}px) sepia(${filters.sepia}%) grayscale(${filters.grayscale}%) invert(${filters.invert}%) opacity(${filters.opacity}%)`;
      
      ctx.drawImage(img, 0, 0);
      
      // Télécharger l'image
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'image-filtered.png';
          a.click();
          URL.revokeObjectURL(url);
          toast({
            title: "Image téléchargée !",
            description: "L'image avec filtres a été téléchargée avec succès.",
          });
        }
      }, 'image/png');
    };
    img.src = image;
  };

  const copyCSS = () => {
    navigator.clipboard.writeText(generateFilterCSS());
    toast({
      title: "CSS copié !",
      description: "Le code CSS des filtres a été copié dans le presse-papiers.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload et aperçu */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Filtres d'Image Avancés
            </span>
            <div className="flex gap-2">
              <Button onClick={resetFilters} size="sm" variant="outline" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Reset
              </Button>
              {image && (
                <Button onClick={downloadImage} size="sm" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Télécharger
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!image ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
              <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Uploadez une image
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Glissez-déposez une image ou cliquez pour parcourir
              </p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Choisir une image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image avec filtres */}
              <div className="space-y-4">
                <div className="text-center">
                  <img
                    src={image}
                    alt="Image avec filtres"
                    className="max-w-full h-auto rounded-lg shadow-lg"
                    style={{
                      filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) hue-rotate(${filters.hue}deg) blur(${filters.blur}px) sepia(${filters.sepia}%) grayscale(${filters.grayscale}%) invert(${filters.invert}%) opacity(${filters.opacity}%)`
                    }}
                  />
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">CSS Filter</Label>
                    <Button onClick={copyCSS} size="sm" variant="outline">
                      Copier CSS
                    </Button>
                  </div>
                  <code className="text-sm font-mono break-all">
                    {generateFilterCSS()}
                  </code>
                </div>

                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Changer d'image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Contrôles des filtres */}
              <div className="space-y-6">
                {/* Luminosité */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Luminosité: {filters.brightness}%
                  </Label>
                  <Slider
                    value={[filters.brightness]}
                    onValueChange={([value]) => updateFilter('brightness', value)}
                    min={0}
                    max={200}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Contraste */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Contraste: {filters.contrast}%
                  </Label>
                  <Slider
                    value={[filters.contrast]}
                    onValueChange={([value]) => updateFilter('contrast', value)}
                    min={0}
                    max={200}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Saturation */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Saturation: {filters.saturation}%
                  </Label>
                  <Slider
                    value={[filters.saturation]}
                    onValueChange={([value]) => updateFilter('saturation', value)}
                    min={0}
                    max={200}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Teinte */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Teinte: {filters.hue}°
                  </Label>
                  <Slider
                    value={[filters.hue]}
                    onValueChange={([value]) => updateFilter('hue', value)}
                    min={-180}
                    max={180}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Flou */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Flou: {filters.blur}px
                  </Label>
                  <Slider
                    value={[filters.blur]}
                    onValueChange={([value]) => updateFilter('blur', value)}
                    min={0}
                    max={10}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Sépia */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Sépia: {filters.sepia}%
                  </Label>
                  <Slider
                    value={[filters.sepia]}
                    onValueChange={([value]) => updateFilter('sepia', value)}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Niveaux de gris */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Niveaux de gris: {filters.grayscale}%
                  </Label>
                  <Slider
                    value={[filters.grayscale]}
                    onValueChange={([value]) => updateFilter('grayscale', value)}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Inversion */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Inversion: {filters.invert}%
                  </Label>
                  <Slider
                    value={[filters.invert]}
                    onValueChange={([value]) => updateFilter('invert', value)}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Opacité */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Opacité: {filters.opacity}%
                  </Label>
                  <Slider
                    value={[filters.opacity]}
                    onValueChange={([value]) => updateFilter('opacity', value)}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filtres prédéfinis */}
      {image && (
        <Card>
          <CardHeader>
            <CardTitle>Filtres prédéfinis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
              {presetFilters.map((preset, index) => (
                <div
                  key={index}
                  onClick={() => applyPreset(preset)}
                  className="cursor-pointer group"
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={image}
                      alt={preset.name}
                      className="w-full h-20 object-cover transition-transform group-hover:scale-110"
                      style={{
                        filter: `brightness(${preset.filters.brightness}%) contrast(${preset.filters.contrast}%) saturate(${preset.filters.saturation}%) hue-rotate(${preset.filters.hue}deg) blur(${preset.filters.blur}px) sepia(${preset.filters.sepia}%) grayscale(${preset.filters.grayscale}%) invert(${preset.filters.invert}%) opacity(${preset.filters.opacity}%)`
                      }}
                    />
                  </div>
                  <Badge variant="outline" className="w-full mt-2 text-xs justify-center">
                    {preset.name}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Canvas caché pour le téléchargement */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
