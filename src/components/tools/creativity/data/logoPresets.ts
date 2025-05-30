
import { LogoPreset, FontFamily, ShapeOption, LayoutOption } from '../types/logoTypes';

export const fontFamilies: FontFamily[] = [
  { name: "Inter", value: "Inter, sans-serif" },
  { name: "Roboto", value: "Roboto, sans-serif" },
  { name: "Montserrat", value: "Montserrat, sans-serif" },
  { name: "Poppins", value: "Poppins, sans-serif" },
  { name: "Playfair Display", value: "'Playfair Display', serif" },
  { name: "Source Code Pro", value: "'Source Code Pro', monospace" },
  { name: "Open Sans", value: "'Open Sans', sans-serif" },
  { name: "Lato", value: "'Lato', sans-serif" }
];

export const iconOptions: string[] = [
  "⭐", "💡", "🚀", "🔥", "⚡", "🌟", "💎", "🎯", "🏆", "🌈",
  "🎨", "📱", "💻", "🎵", "📧", "🔧", "⚙️", "🛡️", "🌍", "🌱",
  "☀️", "🌙", "🔵", "🟢", "🟡", "🟣", "🔴", "🟠", "⚫", "⚪",
  "💪", "🎪", "🎭", "🎬", "📚", "🔑", "💝", "🎉", "🌺", "🍎"
];

export const shapes: ShapeOption[] = [
  { key: 'none', name: 'Aucune', icon: '—' },
  { key: 'circle', name: 'Cercle', icon: '●' },
  { key: 'square', name: 'Carré', icon: '■' },
  { key: 'rounded', name: 'Arrondi', icon: '▢' },
  { key: 'hexagon', name: 'Hexagone', icon: '⬡' }
];

export const layouts: LayoutOption[] = [
  { key: 'horizontal', name: 'Horizontal', icon: '↔' },
  { key: 'vertical', name: 'Vertical', icon: '↕' },
  { key: 'icon-only', name: 'Icône seule', icon: '●' },
  { key: 'text-only', name: 'Texte seul', icon: 'T' }
];

export const presetLogos: LogoPreset[] = [
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
  },
  {
    name: "Modern Finance",
    settings: {
      text: "FinTech",
      fontSize: 32,
      fontFamily: "Roboto, sans-serif",
      fontWeight: "500",
      textColor: "#1E40AF",
      backgroundColor: "#EFF6FF",
      shape: 'rounded' as const,
      shapeColor: "#3B82F6",
      icon: "💎",
      iconSize: 28,
      iconColor: "#1D4ED8",
      layout: 'horizontal' as const,
      padding: 18,
      borderWidth: 1,
      borderColor: "#3B82F6"
    }
  },
  {
    name: "Food & Beverage",
    settings: {
      text: "Bistro",
      fontSize: 34,
      fontFamily: "'Playfair Display', serif",
      fontWeight: "600",
      textColor: "#92400E",
      backgroundColor: "#FEF3C7",
      shape: 'circle' as const,
      shapeColor: "#F59E0B",
      icon: "🍎",
      iconSize: 30,
      iconColor: "#D97706",
      layout: 'vertical' as const,
      padding: 22,
      borderWidth: 2,
      borderColor: "#F59E0B"
    }
  }
];
