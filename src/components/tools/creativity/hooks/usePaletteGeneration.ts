import { useState, useCallback } from "react";

export interface PaletteType {
  id: string;
  name: string;
  description: string;
  category: 'harmonic' | 'temperature' | 'style' | 'accessibility';
  generator: (baseColor: string) => string[];
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  type: string;
  baseColor: string;
  isFavorite: boolean;
  createdAt: Date;
}

export const usePaletteGeneration = () => {
  const [currentPalette, setCurrentPalette] = useState<ColorPalette | null>(null);
  const [paletteHistory, setPaletteHistory] = useState<ColorPalette[]>([]);
  const [favorites, setFavorites] = useState<ColorPalette[]>([]);

  // Utilitaires de conversion couleur
  const hexToHsl = useCallback((hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

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

    return [h * 360, s * 100, l * 100];
  }, []);

  const hslToHex = useCallback((h: number, s: number, l: number): string => {
    h = ((h % 360) + 360) % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  }, []);

  // Générateurs de palettes
  const paletteTypes: PaletteType[] = [
    {
      id: 'monochromatic',
      name: 'Monochromatique',
      description: 'Variations de luminosité d\'une seule teinte',
      category: 'harmonic',
      generator: (baseColor: string) => {
        const [h, s, l] = hexToHsl(baseColor);
        return [
          hslToHex(h, s, Math.max(l - 40, 5)),
          hslToHex(h, s, Math.max(l - 20, 15)),
          baseColor,
          hslToHex(h, s, Math.min(l + 20, 85)),
          hslToHex(h, s, Math.min(l + 40, 95))
        ];
      }
    },
    {
      id: 'complementary',
      name: 'Complémentaire',
      description: 'Couleurs opposées sur le cercle chromatique',
      category: 'harmonic',
      generator: (baseColor: string) => {
        const [h, s, l] = hexToHsl(baseColor);
        const compH = (h + 180) % 360;
        return [
          hslToHex(h, s, Math.max(l - 20, 20)),
          baseColor,
          hslToHex(h, s, Math.min(l + 20, 80)),
          hslToHex(compH, s, Math.max(l - 20, 20)),
          hslToHex(compH, s, Math.min(l + 20, 80))
        ];
      }
    },
    {
      id: 'triadic',
      name: 'Triadique',
      description: 'Trois couleurs équidistantes',
      category: 'harmonic',
      generator: (baseColor: string) => {
        const [h, s, l] = hexToHsl(baseColor);
        return [
          baseColor,
          hslToHex((h + 120) % 360, s, l),
          hslToHex((h + 240) % 360, s, l),
          hslToHex(h, Math.max(s - 20, 20), Math.min(l + 15, 85)),
          hslToHex((h + 60) % 360, Math.max(s - 30, 10), Math.min(l + 25, 90))
        ];
      }
    },
    {
      id: 'analogous',
      name: 'Analogues',
      description: 'Couleurs adjacentes harmonieuses',
      category: 'harmonic',
      generator: (baseColor: string) => {
        const [h, s, l] = hexToHsl(baseColor);
        return [
          hslToHex((h - 30 + 360) % 360, s, l),
          hslToHex((h - 15 + 360) % 360, s, l),
          baseColor,
          hslToHex((h + 15) % 360, s, l),
          hslToHex((h + 30) % 360, s, l)
        ];
      }
    },
    {
      id: 'split-complementary',
      name: 'Complémentaire divisée',
      description: 'Base et couleurs adjacentes à sa complémentaire',
      category: 'harmonic',
      generator: (baseColor: string) => {
        const [h, s, l] = hexToHsl(baseColor);
        return [
          baseColor,
          hslToHex((h + 150) % 360, s, l),
          hslToHex((h + 210) % 360, s, l),
          hslToHex(h, Math.max(s - 15, 15), Math.min(l + 20, 80)),
          hslToHex((h + 180) % 360, Math.max(s - 25, 10), Math.min(l + 30, 85))
        ];
      }
    },
    {
      id: 'tetradic',
      name: 'Tétradique',
      description: 'Rectangle de quatre couleurs',
      category: 'harmonic',
      generator: (baseColor: string) => {
        const [h, s, l] = hexToHsl(baseColor);
        return [
          baseColor,
          hslToHex((h + 90) % 360, s, l),
          hslToHex((h + 180) % 360, s, l),
          hslToHex((h + 270) % 360, s, l),
          hslToHex(h, Math.max(s - 20, 20), Math.min(l + 15, 80))
        ];
      }
    },
    {
      id: 'warm',
      name: 'Couleurs chaudes',
      description: 'Teintes chaleureuses et énergiques',
      category: 'temperature',
      generator: (baseColor: string) => {
        const [h, s, l] = hexToHsl(baseColor);
        const warmHue = h > 180 ? h - 180 : h;
        return [
          hslToHex((warmHue + 340) % 360, Math.max(s, 70), Math.max(l, 50)),
          hslToHex((warmHue + 10) % 360, Math.max(s, 75), Math.max(l, 55)),
          hslToHex((warmHue + 30) % 360, Math.max(s, 80), Math.max(l, 60)),
          hslToHex((warmHue + 50) % 360, Math.max(s, 70), Math.max(l, 65)),
          hslToHex((warmHue + 70) % 360, Math.max(s, 65), Math.max(l, 70))
        ];
      }
    },
    {
      id: 'cool',
      name: 'Couleurs froides',
      description: 'Teintes apaisantes et relaxantes',
      category: 'temperature',
      generator: (baseColor: string) => {
        const [h, s, l] = hexToHsl(baseColor);
        const coolHue = h < 180 ? h + 180 : h;
        return [
          hslToHex((coolHue + 180) % 360, Math.max(s, 60), Math.max(l, 45)),
          hslToHex((coolHue + 200) % 360, Math.max(s, 70), Math.max(l, 55)),
          hslToHex((coolHue + 220) % 360, Math.max(s, 75), Math.max(l, 65)),
          hslToHex((coolHue + 240) % 360, Math.max(s, 70), Math.max(l, 70)),
          hslToHex((coolHue + 260) % 360, Math.max(s, 65), Math.max(l, 75))
        ];
      }
    },
    {
      id: 'pastel',
      name: 'Pastel',
      description: 'Couleurs douces et délicates',
      category: 'style',
      generator: (baseColor: string) => {
        const [h, s, l] = hexToHsl(baseColor);
        const angles = [0, 72, 144, 216, 288];
        return angles.map(angle => 
          hslToHex((h + angle) % 360, Math.min(s, 40), Math.max(l, 75))
        );
      }
    },
    {
      id: 'vibrant',
      name: 'Vibrant',
      description: 'Couleurs vives et saturées',
      category: 'style',
      generator: (baseColor: string) => {
        const [h, s, l] = hexToHsl(baseColor);
        const angles = [0, 72, 144, 216, 288];
        return angles.map(angle => 
          hslToHex((h + angle) % 360, Math.max(s, 85), Math.min(Math.max(l, 45), 65))
        );
      }
    },
    {
      id: 'earth',
      name: 'Tons terreux',
      description: 'Couleurs naturelles et organiques',
      category: 'style',
      generator: (baseColor: string) => {
        const earthHues = [25, 35, 45, 60, 80];
        return earthHues.map(hue => 
          hslToHex(hue, Math.random() * 30 + 40, Math.random() * 25 + 40)
        );
      }
    },
    {
      id: 'neon',
      name: 'Néon',
      description: 'Couleurs fluorescentes électriques',
      category: 'style',
      generator: (baseColor: string) => {
        const [h, s, l] = hexToHsl(baseColor);
        const angles = [0, 90, 180, 270, 45];
        return angles.map(angle => 
          hslToHex((h + angle) % 360, 100, 50)
        );
      }
    }
  ];

  const generatePalette = useCallback((type: PaletteType, baseColor?: string) => {
    const color = baseColor || "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    const colors = type.generator(color);
    
    const newPalette: ColorPalette = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: type.name,
      colors,
      type: type.id,
      baseColor: color,
      isFavorite: false,
      createdAt: new Date()
    };

    setCurrentPalette(newPalette);
    setPaletteHistory(prev => [newPalette, ...prev.slice(0, 29)]);
    return newPalette;
  }, [hexToHsl, hslToHex]);

  const generateRandomPalette = useCallback(() => {
    const randomType = paletteTypes[Math.floor(Math.random() * paletteTypes.length)];
    return generatePalette(randomType);
  }, [generatePalette, paletteTypes]);

  const toggleFavorite = useCallback((palette: ColorPalette) => {
    const isFavorite = favorites.some(fav => fav.id === palette.id);
    
    if (isFavorite) {
      setFavorites(prev => prev.filter(fav => fav.id !== palette.id));
    } else {
      setFavorites(prev => [...prev, { ...palette, isFavorite: true }]);
    }
    
    if (currentPalette?.id === palette.id) {
      setCurrentPalette(prev => prev ? { ...prev, isFavorite: !isFavorite } : null);
    }
  }, [favorites, currentPalette]);

  const copyPalette = useCallback((palette: ColorPalette, format: 'hex' | 'css' | 'scss' | 'json' = 'hex') => {
    let text = "";
    
    switch (format) {
      case 'hex':
        text = palette.colors.join(", ");
        break;
      case 'css':
        text = `:root {\n${palette.colors.map((color, i) => `  --color-${i + 1}: ${color};`).join('\n')}\n}`;
        break;
      case 'scss':
        text = palette.colors.map((color, i) => `$color-${i + 1}: ${color};`).join('\n');
        break;
      case 'json':
        text = JSON.stringify({ 
          name: palette.name, 
          colors: palette.colors, 
          type: palette.type 
        }, null, 2);
        break;
    }
    
    navigator.clipboard.writeText(text);
    return text;
  }, []);

  return {
    // State
    currentPalette,
    paletteHistory,
    favorites,
    paletteTypes,
    
    // Actions
    generatePalette,
    generateRandomPalette,
    toggleFavorite,
    copyPalette,
    setCurrentPalette,
    
    // Utils
    hexToHsl,
    hslToHex
  };
};