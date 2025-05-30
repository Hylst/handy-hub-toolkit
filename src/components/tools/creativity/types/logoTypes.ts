
export interface LogoSettings {
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

export interface FontFamily {
  name: string;
  value: string;
}

export interface ShapeOption {
  key: LogoSettings['shape'];
  name: string;
  icon: string;
}

export interface LayoutOption {
  key: LogoSettings['layout'];
  name: string;
  icon: string;
}

export interface LogoPreset {
  name: string;
  settings: LogoSettings;
}
